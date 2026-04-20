"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const VOTE_PRICE = 100;
const PRESETS = [100, 500, 1000, 5000];

const PROVIDERS = [
  { id: "fapshi",   label: "Fapshi",    sub: "MTN · Orange Money",     flag: "🇨🇲", color: "#FFC107" },
  { id: "cinetpay", label: "CinetPay",  sub: "Mobile Money Afrique",   flag: "🌍", color: "#E91E63" },
  { id: "stripe",   label: "Stripe",    sub: "Carte internationale",   flag: "💳", color: "#635BFF" },
];

export default function VotePage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [candidate,    setCandidate]    = useState<any>(null);
  const [amount,       setAmount]       = useState<number>(500);
  const [provider,     setProvider]     = useState<string>("fapshi");
  const [loading,      setLoading]      = useState(false);
  const [contestOpen,  setContestOpen]  = useState(true);

  const votes   = Math.floor(amount / VOTE_PRICE);
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

  useEffect(() => {
    if (!id) return;
    api.get(`/candidates/${id}`).then(r => setCandidate(r.data.data)).catch(() => router.push("/candidates"));
    api.get("/contest/active").then(r => setContestOpen(!!r.data.data)).catch(() => setContestOpen(false));
  }, [id]);

  const handleVote = async () => {
    if (!isAuthenticated) return toast.error("Connectez-vous pour voter");
    if (!contestOpen)     return toast.error("Les votes sont fermés");
    if (amount < 100)     return toast.error("Minimum 100 FCFA");
    setLoading(true);
    try {
      const { data } = await api.post("/payments/initialize", { candidateId: id, amount, provider });
      if (data.data.paymentLink) window.location.href = data.data.paymentLink;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur paiement");
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"2px solid var(--gold)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
    </div>
  );

  const photo = candidate.photoUrl?.startsWith("http") ? candidate.photoUrl : `${apiBase}${candidate.photoUrl}`;

  const S: Record<string, React.CSSProperties> = {
    page:    { minHeight:"100vh" },
    wrap:    { paddingTop:100, paddingBottom:80, padding:"100px 40px 80px", maxWidth:500, margin:"0 auto", position:"relative", zIndex:1 },
    card:    { background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, overflow:"hidden", backdropFilter:"blur(20px)" },
    header:  { position:"relative", height:200, overflow:"hidden", background:"linear-gradient(135deg,#1A0010,#0A0820)", display:"flex", alignItems:"flex-end", padding:20 },
    headerBg:{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 40%,rgba(194,24,91,.2),transparent 60%),radial-gradient(ellipse at 70% 60%,rgba(201,147,42,.15),transparent 60%)" },
    body:    { padding:24 },
    label:   { fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:12 },
    presets: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 },
    inputWrap:{ position:"relative", marginBottom:20 },
    input:   { width:"100%", padding:"14px 50px 14px 18px", background:"rgba(255,255,255,.04)", border:"1px solid var(--border)", borderRadius:14, color:"var(--text)", fontSize:"1.1rem", textAlign:"center" as const, outline:"none", fontFamily:"var(--font-display)", transition:"border-color .2s" },
    currency:{ position:"absolute", right:18, top:"50%", transform:"translateY(-50%)", fontSize:"0.78rem", color:"var(--text-muted)" },
    summary: { display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(201,147,42,.06)", border:"1px solid rgba(201,147,42,.15)", borderRadius:14, padding:"14px 18px", marginBottom:20 },
    submit:  { width:"100%", padding:15, background:"linear-gradient(135deg,var(--gold),var(--gold-light))", color:"#08000A", border:"none", borderRadius:14, fontSize:"0.95rem", fontWeight:500, cursor:"pointer", fontFamily:"var(--font-body)", boxShadow:"0 4px 24px rgba(201,147,42,.3)", transition:"transform .2s,box-shadow .2s" },
    footer:  { fontSize:"0.7rem", color:"var(--text-muted)", textAlign:"center" as const, marginTop:14 },
  };

  const providerBar: React.CSSProperties = {
    display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20,
  };
  const providerBtn = (active: boolean): React.CSSProperties => ({
    padding:"10px 8px", borderRadius:12, border:`1px solid ${active?"rgba(201,147,42,.5)":"var(--border)"}`,
    background: active ? "rgba(201,147,42,.08)" : "transparent",
    cursor:"pointer", textAlign:"center", transition:"all .2s",
    fontFamily:"var(--font-body)",
  });

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>
        <Link href={`/candidates/${candidate.id}`} style={{ display:"flex", alignItems:"center", gap:8, color:"var(--text-muted)", textDecoration:"none", fontSize:"0.82rem", marginBottom:20 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold-light)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
        >← Retour au profil</Link>

        <div style={S.card}>
          {/* Header candidat */}
          <div style={S.header}>
            <Image src={photo} alt={candidate.name} fill style={{ objectFit:"cover", opacity:.45 }} onError={(e:any) => { e.target.src="/placeholder.jpg"; }} />
            <div style={S.headerBg} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"1.5rem", fontWeight:600, color:"#fff" }}>{candidate.name}</div>
              <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,.5)" }}>
                {candidate.type === "MISS" ? "♛ MISS" : "♚ MASTER"} · {candidate.city} · ★ {candidate.totalVotes?.toLocaleString("fr-FR")} votes
              </div>
            </div>
          </div>

          <div style={S.body}>
            {!contestOpen && (
              <div style={{ background:"rgba(239,83,80,.1)", border:"1px solid rgba(239,83,80,.3)", borderRadius:12, padding:"12px 16px", color:"#EF5350", fontSize:"0.82rem", textAlign:"center", marginBottom:20 }}>
                🔒 Les votes sont actuellement fermés
              </div>
            )}

            {/* Montant */}
            <div style={S.label}>Choisissez un montant</div>
            <div style={S.presets}>
              {PRESETS.map(p => (
                <button key={p} onClick={() => setAmount(p)}
                  style={{
                    padding:"10px 0", borderRadius:12, fontFamily:"var(--font-body)", fontSize:"0.82rem", cursor:"pointer", transition:"all .2s",
                    border: amount === p ? "1px solid var(--gold)" : "1px solid var(--border)",
                    background: amount === p ? "rgba(201,147,42,.12)" : "transparent",
                    color: amount === p ? "var(--gold-light)" : "var(--text-muted)",
                    fontWeight: amount === p ? 500 : 400,
                  }}
                >{p.toLocaleString("fr-FR")}</button>
              ))}
            </div>

            <div style={S.inputWrap}>
              <input style={S.input} type="number" value={amount} min={100} step={100}
                onChange={e => setAmount(Math.max(100, +e.target.value))}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(201,147,42,.5)"}
                onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
              />
              <span style={S.currency}>FCFA</span>
            </div>

            {/* Résumé */}
            <div style={S.summary}>
              <div>
                <div style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Vous obtenez</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"1.6rem", fontWeight:700, color:"var(--gold-light)", lineHeight:1 }}>
                  {votes} <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>vote{votes>1?"s":""}</span>
                </div>
              </div>
              <span style={{ fontSize:"1.8rem" }}>⚡</span>
            </div>

            {/* Provider */}
            <div style={S.label}>Moyen de paiement</div>
            <div style={providerBar}>
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)} style={providerBtn(provider === p.id)}>
                  <div style={{ fontSize:"1.2rem", marginBottom:4 }}>{p.flag}</div>
                  <div style={{ fontSize:"0.78rem", fontWeight:500, color: provider === p.id ? "var(--gold-light)" : "var(--text)" }}>{p.label}</div>
                  <div style={{ fontSize:"0.65rem", color:"var(--text-muted)" }}>{p.sub}</div>
                </button>
              ))}
            </div>

            {/* Submit ou login */}
            {!isAuthenticated ? (
              <Link href="/auth/login" style={{ ...S.submit, display:"block", textAlign:"center", textDecoration:"none", opacity:.8 }}>
                🔒 Connectez-vous pour voter
              </Link>
            ) : (
              <button style={S.submit} onClick={handleVote} disabled={loading || !contestOpen}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(201,147,42,.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(201,147,42,.3)"; }}
              >
                {loading ? "Redirection..." : `💳 Payer ${amount.toLocaleString("fr-FR")} FCFA → ${votes} vote${votes>1?"s":""}`}
              </button>
            )}

            <div style={S.footer}>Paiement sécurisé · Fapshi · CinetPay · Stripe</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
