const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { AppError } = require("../utils/errors");
const logger = require("../utils/logger");
const { emitRankingUpdate } = require("../socket/socket");

const prisma = new PrismaClient();
const VOTE_PRICE = 100; // 100 FCFA par vote

function amountToVotes(amount) {
  return Math.floor(amount / VOTE_PRICE);
}

// ─────────────────────────────────────────────────────────
// FAPSHI  (Mobile Money Cameroun — MTN / Orange)
// ─────────────────────────────────────────────────────────
async function initFapshi({ txRef, amount, userEmail, userName, candidateName, votesCount }) {
  const response = await axios.post(
    "https://live.fapshi.com/initiate-pay",
    {
      amount,
      email:       userEmail,
      redirectUrl: `${process.env.FRONTEND_URL}/vote/callback?tx_ref=${txRef}&provider=fapshi`,
      externalId:  txRef,
      message:     `${votesCount} vote(s) pour ${candidateName}`,
    },
    {
      headers: {
        apiuser: process.env.FAPSHI_API_USER,
        apikey:  process.env.FAPSHI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data.statusCode !== 200 && !response.data.paymentLink) {
    throw new AppError("Erreur Fapshi: " + (response.data.message || "Inconnue"), 502);
  }
  return { paymentLink: response.data.paymentLink, transId: response.data.transId };
}

async function verifyFapshi(transId) {
  const response = await axios.get(
    `https://live.fapshi.com/payment-status/${transId}`,
    {
      headers: {
        apiuser: process.env.FAPSHI_API_USER,
        apikey:  process.env.FAPSHI_API_KEY,
      },
    }
  );
  return response.data; // { status: "SUCCESSFUL" | "FAILED" | "PENDING", ... }
}

// ─────────────────────────────────────────────────────────
// CINETPAY  (Mobile Money multi-pays africains)
// ─────────────────────────────────────────────────────────
async function initCinetPay({ txRef, amount, userEmail, userName, candidateName, votesCount }) {
  const response = await axios.post(
    "https://api-checkout.cinetpay.com/v2/payment",
    {
      apikey:           process.env.CINETPAY_API_KEY,
      site_id:          process.env.CINETPAY_SITE_ID,
      transaction_id:   txRef,
      amount,
      currency:         "XAF",
      description:      `${votesCount} vote(s) pour ${candidateName}`,
      customer_email:   userEmail,
      customer_name:    userName,
      notify_url:       `${process.env.BACKEND_URL}/api/payments/webhook/cinetpay`,
      return_url:       `${process.env.FRONTEND_URL}/vote/callback?tx_ref=${txRef}&provider=cinetpay`,
      channels:         "ALL",
      lang:             "fr",
    },
    { headers: { "Content-Type": "application/json" } }
  );
  if (response.data.code !== "201") {
    throw new AppError("Erreur CinetPay: " + (response.data.message || "Inconnue"), 502);
  }
  return { paymentLink: response.data.data.payment_url };
}

async function verifyCinetPay(txRef) {
  const response = await axios.post(
    "https://api-checkout.cinetpay.com/v2/payment/check",
    {
      apikey:         process.env.CINETPAY_API_KEY,
      site_id:        process.env.CINETPAY_SITE_ID,
      transaction_id: txRef,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data; // { code: "00" = success, data: { status: "ACCEPTED"|... } }
}

// ─────────────────────────────────────────────────────────
// STRIPE  (Carte internationale)
// ─────────────────────────────────────────────────────────
let stripe;
function getStripe() {
  if (!stripe) {
    const Stripe = require("stripe");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

async function initStripe({ txRef, amount, userEmail, candidateName, votesCount }) {
  const stripeClient = getStripe();
  // Convertir FCFA → EUR (taux approximatif : 1 EUR = 655.96 FCFA)
  const amountEurCents = Math.round((amount / 655.96) * 100);

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: { name: `${votesCount} vote(s) — META MISS & MASTER`, description: `Pour : ${candidateName}` },
        unit_amount: amountEurCents,
      },
      quantity: 1,
    }],
    mode: "payment",
    customer_email: userEmail,
    client_reference_id: txRef,
    success_url: `${process.env.FRONTEND_URL}/vote/callback?tx_ref=${txRef}&provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.FRONTEND_URL}/vote/callback?tx_ref=${txRef}&status=cancelled`,
    metadata: { txRef, votesCount: String(votesCount) },
  });

  return { paymentLink: session.url, sessionId: session.id };
}

// ─────────────────────────────────────────────────────────
// INITIALIZE  (choisir le provider)
// ─────────────────────────────────────────────────────────
async function initializePayment({ userId, candidateId, amount, provider, userEmail, userName, userPhone }) {
  const contest = await prisma.contest.findFirst({ where: { status: "OPEN" } });
  if (!contest) throw new AppError("Les votes sont actuellement fermés", 403);

  const candidate = await prisma.candidate.findFirst({ where: { id: candidateId, status: "APPROVED" } });
  if (!candidate) throw new AppError("Candidat introuvable ou non approuvé", 404);

  const votesCount = amountToVotes(amount);
  if (votesCount < 1) throw new AppError("Montant minimum : 100 FCFA", 400);

  const validProviders = ["fapshi", "cinetpay", "stripe"];
  if (!validProviders.includes(provider)) throw new AppError("Provider invalide", 400);

  const txRef = `MMM-${provider.toUpperCase()}-${uuidv4()}`;

  const payment = await prisma.payment.create({
    data: {
      userId, candidateId, amount, votesCount,
      flutterwaveTxRef: txRef, // champ réutilisé comme txRef générique
      status: "PENDING",
      metadata: { provider, candidateName: candidate.name, candidateType: candidate.type },
    },
  });

  let paymentLink = "";
  const params = { txRef, amount, userEmail, userName: userName || userEmail, candidateName: candidate.name, votesCount };

  try {
    if (provider === "fapshi") {
      const r = await initFapshi(params);
      paymentLink = r.paymentLink;
      if (r.transId) await prisma.payment.update({ where: { id: payment.id }, data: { flutterwaveFlwRef: r.transId } });
    } else if (provider === "cinetpay") {
      const r = await initCinetPay(params);
      paymentLink = r.paymentLink;
    } else if (provider === "stripe") {
      const r = await initStripe({ ...params, userEmail });
      paymentLink = r.paymentLink;
      if (r.sessionId) await prisma.payment.update({ where: { id: payment.id }, data: { flutterwaveTransId: r.sessionId } });
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error(`[${provider}] init error:`, err.response?.data || err.message);
    throw new AppError(`Erreur lors de l'initialisation du paiement (${provider})`, 502);
  }

  logger.info(`Payment initialized: provider=${provider} txRef=${txRef} amount=${amount} votes=${votesCount}`);
  return { paymentId: payment.id, txRef, paymentLink, votesCount, amount, candidateName: candidate.name, provider };
}

// ─────────────────────────────────────────────────────────
// VERIFY  (appelé après redirect)
// ─────────────────────────────────────────────────────────
async function verifyPayment(txRef, userId) {
  const payment = await prisma.payment.findUnique({ where: { flutterwaveTxRef: txRef } });
  if (!payment) throw new AppError("Transaction introuvable", 404);
  if (payment.userId !== userId) throw new AppError("Non autorisé", 403);
  if (payment.status === "COMPLETED") return { status: "COMPLETED", votesCount: payment.votesCount, message: "Votes déjà crédités" };
  if (payment.status === "FAILED")    return { status: "FAILED", message: "Paiement échoué" };

  const provider = payment.metadata?.provider || "fapshi";

  try {
    let success = false;

    if (provider === "fapshi") {
      const transId = payment.flutterwaveFlwRef;
      if (!transId) return { status: "PENDING", message: "En attente de confirmation" };
      const r = await verifyFapshi(transId);
      success = r.status === "SUCCESSFUL";
    } else if (provider === "cinetpay") {
      const r = await verifyCinetPay(txRef);
      success = r.code === "00" && r.data?.status === "ACCEPTED";
    } else if (provider === "stripe") {
      const stripeClient = getStripe();
      const sessionId = payment.flutterwaveTransId;
      if (!sessionId) return { status: "PENDING", message: "En attente Stripe" };
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      success = session.payment_status === "paid";
    }

    if (success) {
      if (payment.status !== "PENDING") return { status: payment.status, votesCount: payment.votesCount, message: "Déjà traité" };
      await creditVotes(payment, {});
      return { status: "COMPLETED", votesCount: payment.votesCount, message: "Votes crédités avec succès !" };
    }
    return { status: "PENDING", message: "Paiement en attente de confirmation" };
  } catch (err) {
    logger.error("Verify error:", err.message);
    return { status: "PENDING", message: "Vérification impossible pour l'instant" };
  }
}

// ─────────────────────────────────────────────────────────
// WEBHOOKS
// ─────────────────────────────────────────────────────────
async function processFapshiWebhook(body) {
  // Fapshi envoie { transId, externalId, status, amount }
  const { externalId: txRef, status, transId } = body;
  if (!txRef) return;

  const payment = await prisma.payment.findUnique({ where: { flutterwaveTxRef: txRef } });
  if (!payment || payment.webhookReceived || payment.status !== "PENDING") return;

  await prisma.payment.update({ where: { id: payment.id }, data: { webhookReceived: true, flutterwaveFlwRef: transId } });

  if (status === "SUCCESSFUL") {
    await creditVotes(payment, {});
    logger.info(`Fapshi webhook: votes credited txRef=${txRef}`);
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  }
}

async function processCinetPayWebhook(body) {
  // CinetPay envoie { cpm_trans_id, cpm_result, ... }
  const { cpm_trans_id: txRef, cpm_result } = body;
  if (!txRef) return;

  const payment = await prisma.payment.findUnique({ where: { flutterwaveTxRef: txRef } });
  if (!payment || payment.webhookReceived || payment.status !== "PENDING") return;

  await prisma.payment.update({ where: { id: payment.id }, data: { webhookReceived: true } });

  if (cpm_result === "00") {
    await creditVotes(payment, {});
    logger.info(`CinetPay webhook: votes credited txRef=${txRef}`);
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  }
}

async function processStripeWebhook(rawBody, signature) {
  const stripeClient = getStripe();
  let event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError("Stripe webhook signature invalide", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const txRef   = session.client_reference_id || session.metadata?.txRef;
    if (!txRef) return;

    const payment = await prisma.payment.findUnique({ where: { flutterwaveTxRef: txRef } });
    if (!payment || payment.webhookReceived || payment.status !== "PENDING") return;

    await prisma.payment.update({ where: { id: payment.id }, data: { webhookReceived: true } });

    if (session.payment_status === "paid") {
      await creditVotes(payment, {});
      logger.info(`Stripe webhook: votes credited txRef=${txRef}`);
    }
  }
}

// ─────────────────────────────────────────────────────────
// CREDIT VOTES  (atomique)
// ─────────────────────────────────────────────────────────
async function creditVotes(payment, _meta) {
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({ where: { id: payment.id }, data: { status: "COMPLETED" } });
    await tx.vote.create({ data: { userId: payment.userId, candidateId: payment.candidateId, count: payment.votesCount, paymentId: payment.id } });
    await tx.candidate.update({ where: { id: payment.candidateId }, data: { totalVotes: { increment: payment.votesCount } } });
  });
  await emitRankingUpdate();
}

async function getUserPayments(userId, page, limit) {
  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.payment.count({ where: { userId } }),
  ]);
  return { payments, total, page, totalPages: Math.ceil(total / limit) };
}

module.exports = {
  initializePayment, verifyPayment,
  processFapshiWebhook, processCinetPayWebhook, processStripeWebhook,
  getUserPayments, creditVotes,
};
