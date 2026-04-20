const express = require("express");
const { body } = require("express-validator");
const paymentController = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/auth");
const { paymentRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

// ── Webhooks (raw body, pas d'auth) ──────────────────────
router.post("/webhook/fapshi",   express.raw({ type:"*/*" }), paymentController.webhookFapshi);
router.post("/webhook/cinetpay", express.raw({ type:"*/*" }), paymentController.webhookCinetPay);
router.post("/webhook/stripe",   express.raw({ type:"application/json" }), paymentController.webhookStripe);

// ── Routes authentifiées ─────────────────────────────────
router.use(authenticate);

router.post(
  "/initialize",
  paymentRateLimiter,
  [
    body("candidateId").notEmpty().withMessage("Candidat requis"),
    body("amount").isInt({ min:100 }).withMessage("Montant minimum 100 FCFA"),
    body("provider").isIn(["fapshi","cinetpay","stripe"]).withMessage("Provider invalide"),
  ],
  paymentController.initialize
);

router.get("/verify/:txRef", paymentController.verify);
router.get("/history",       paymentController.history);

module.exports = router;
