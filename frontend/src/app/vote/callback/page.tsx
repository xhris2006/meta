import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function CallbackContent() {
  "use client";
  const params = useSearchParams();
  const [status,  setStatus]  = useState<"loading"|"success"|"failed">("loading");
  const [votes,   setVotes]   = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const txRef    = params.get("tx_ref");
    const flwSt    = params.get("status");

    if (!txRef)                   { setStatus("failed");  setMessage("Référence introuvable"); return; }
    if (flwSt === "cancelled")    { setStatus("failed");  setMessage("Paiement annulé"); return; }

    api.get(`/payments/verify/${txRef}`).then(r => {
      const d = r.data.data;
      if (d.status === "COMPLETED") { setStatus("success"); setVotes(d.votesCount); setMessage(d.message); }
      else                          { setStatus("failed");  setMessage(d.message || "Paiement non confirmé"); }
    }).catch(() => { setStatus("failed"); setMessage("Erreur lors de la vérification"); });
  }, []);

  const S: Record<string, React.CSSProperties> = {
    wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 },
    card:  { background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, padding:"48px 40px", maxWidth:440, width:"100%", textAlign:"center", backdropFilter:"blur(20px)" },
    icon:  { fontSize:"3.5rem", marginBottom:20 },
    title: { fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:600, color:"var(--text)", marginBottom:8 },
    sub:   { color:"var(--text-muted)", fontSize:"0.88rem", marginBottom:32, lineHeight:1.6 },
    votes: { fontFamily:"var(--font-display)", fontSize:"2.5rem", fontWeight:700, color:"var(--gold-light)", marginBottom:8 },
    btns:  { display:"flex", gap:12 },
    btn1:  { flex:1, padding:"13px 0", background:"linear-gradient(135deg,var(--gold),var(--gold-light))", color:"#08000A", borderRadius:14, textDecoration:"none", fontWeight:500, fontFamily:"var(--font-body)", display:"block", textAlign:"center" as const },
    btn2:  { flex:1, padding:"13px 0", background:"var(--glass)", color:"var(--text-muted)", border:"1px solid var(--border)", borderRadius:14, textDecoration:"none", fontFamily:"var(--font-body)", display:"block", textAlign:"center" as const },
    spinner:{ width:48, height:48, border:"2px solid var(--border)", borderTopColor:"var(--gold)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 24px" },
  };

  return (
    <div style={S.wrap}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.card}>
        {status === "loading" && (
          <>
            <div style={S.spinner} />
            <div style={S.title}>Vérification...</div>
            <div style={S.sub}>Confirmation du paiement en cours. Veuillez patienter.</div>
          </>
        )}
        {status === "success" && (
          <>
            <div style={S.icon}>✅</div>
            <div style={S.title}>Merci pour votre vote !</div>
            <div style={S.votes}>{votes} vote{votes > 1 ? "s" : ""}</div>
            <div style={S.sub}>{message}</div>
            <div style={S.btns}>
              <Link href="/ranking"   style={S.btn1}>Voir le classement</Link>
              <Link href="/candidates" style={S.btn2}>Candidats</Link>
            </div>
          </>
        )}
        {status === "failed" && (
          <>
            <div style={S.icon}>❌</div>
            <div style={S.title}>Paiement non confirmé</div>
            <div style={S.sub}>{message}</div>
            <Link href="/candidates" style={{ ...S.btn2, display:"block", maxWidth:240, margin:"0 auto" }}>
              Retour aux candidats
            </Link>
          </>
        )}
      </div>
    </div>
}

export default function VoteCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, padding:"48px 40px", maxWidth:440, width:"100%", textAlign:"center", backdropFilter:"blur(20px)" }}>
          <div style={{ width:48, height:48, border:"2px solid var(--border)", borderTopColor:"var(--gold)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 24px" }} />
          <div style={{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:600, color:"var(--text)", marginBottom:8 }}>Vérification...</div>
          <div style={{ color:"var(--text-muted)", fontSize:"0.88rem", marginBottom:32, lineHeight:1.6 }}>Confirmation du paiement en cours. Veuillez patienter.</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

  const S: Record<string, React.CSSProperties> = {
    wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 },
    card:  { background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, padding:"48px 40px", maxWidth:440, width:"100%", textAlign:"center", backdropFilter:"blur(20px)" },
    icon:  { fontSize:"3.5rem", marginBottom:20 },
    title: { fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:600, color:"var(--text)", marginBottom:8 },
    sub:   { color:"var(--text-muted)", fontSize:"0.88rem", marginBottom:32, lineHeight:1.6 },
    votes: { fontFamily:"var(--font-display)", fontSize:"2.5rem", fontWeight:700, color:"var(--gold-light)", marginBottom:8 },
    btns:  { display:"flex", gap:12 },
    btn1:  { flex:1, padding:"13px 0", background:"linear-gradient(135deg,var(--gold),var(--gold-light))", color:"#08000A", borderRadius:14, textDecoration:"none", fontWeight:500, fontFamily:"var(--font-body)", display:"block", textAlign:"center" as const },
    btn2:  { flex:1, padding:"13px 0", background:"var(--glass)", color:"var(--text-muted)", border:"1px solid var(--border)", borderRadius:14, textDecoration:"none", fontFamily:"var(--font-body)", display:"block", textAlign:"center" as const },
    spinner:{ width:48, height:48, border:"2px solid var(--border)", borderTopColor:"var(--gold)", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 24px" },
  };

  return (
    <div style={S.wrap}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.card}>
        {status === "loading" && (
          <>
            <div style={S.spinner} />
            <div style={S.title}>Vérification...</div>
            <div style={S.sub}>Confirmation du paiement en cours. Veuillez patienter.</div>
          </>
        )}
        {status === "success" && (
          <>
            <div style={S.icon}>✅</div>
            <div style={S.title}>Merci pour votre vote !</div>
            <div style={S.votes}>{votes} vote{votes > 1 ? "s" : ""}</div>
            <div style={S.sub}>{message}</div>
            <div style={S.btns}>
              <Link href="/ranking"   style={S.btn1}>Voir le classement</Link>
              <Link href="/candidates" style={S.btn2}>Candidats</Link>
            </div>
          </>
        )}
        {status === "failed" && (
          <>
            <div style={S.icon}>❌</div>
            <div style={S.title}>Paiement non confirmé</div>
            <div style={S.sub}>{message}</div>
            <Link href="/candidates" style={{ ...S.btn2, display:"block", maxWidth:240, margin:"0 auto" }}>
              Retour aux candidats
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
