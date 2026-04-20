"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CandidateCard from "@/components/candidate/CandidateCard";
import api from "@/lib/api";

export default function HomePage() {
  const [miss,setMiss]   = useState<any[]>([]);
  const [master,setMaster] = useState<any[]>([]);
  const [stats,setStats]   = useState<any>(null);
  const [candTab,setCandTab] = useState<"ALL"|"MISS"|"MASTER">("ALL");

  useEffect(()=>{
    api.get("/candidates/top?type=MISS&limit=3").then(r=>setMiss(r.data.data||[])).catch(()=>{});
    api.get("/candidates/top?type=MASTER&limit=3").then(r=>setMaster(r.data.data||[])).catch(()=>{});
    api.get("/ranking/stats").then(r=>setStats(r.data.data)).catch(()=>{});
  },[]);

  const displayCands = candTab==="ALL" ? [...miss,...master] : candTab==="MISS" ? miss : master;

  const S:Record<string,React.CSSProperties> = {
    page:{minHeight:"100vh"},
    hero:{
      position:"relative",zIndex:1,minHeight:"100vh",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:"100px 40px 60px",textAlign:"center",
    },
    eyebrow:{
      display:"inline-flex",alignItems:"center",gap:10,
      fontSize:"0.72rem",letterSpacing:"0.28em",textTransform:"uppercase",
      color:"var(--gold)",border:"1px solid rgba(201,147,42,.3)",
      padding:"6px 18px",borderRadius:100,marginBottom:32,
      animation:"fade-up .8s ease both",
    },
    eyebrowDot:{width:5,height:5,borderRadius:"50%",background:"var(--gold)",display:"inline-block"},
    title:{
      fontFamily:"var(--font-display)",
      fontSize:"clamp(4rem,12vw,9rem)",fontWeight:300,
      lineHeight:.9,letterSpacing:"-0.02em",marginBottom:28,
      animation:"fade-up .8s .1s ease both",
    },
    sub:{
      fontSize:"1rem",color:"var(--text-muted)",maxWidth:500,
      margin:"0 auto 44px",animation:"fade-up .8s .2s ease both",
    },
    actions:{
      display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",
      animation:"fade-up .8s .3s ease both",
    },
    statsBar:{
      position:"relative",zIndex:1,
      borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",
      padding:"20px 40px",display:"flex",justifyContent:"center",
      gap:60,background:"rgba(17,0,9,.6)",flexWrap:"wrap",
    },
    statVal:{fontFamily:"var(--font-display)",fontSize:"1.8rem",fontWeight:600,color:"var(--gold-light)",lineHeight:1},
    statLabel:{fontSize:"0.72rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-muted)",marginTop:4},
    candSection:{padding:"90px 40px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1},
    sectionTitle:{fontFamily:"var(--font-display)",fontSize:"clamp(2.2rem,5vw,3.4rem)",fontWeight:300,color:"var(--text)",letterSpacing:"-0.01em"},
    sectionTitleEm:{fontStyle:"italic",color:"var(--gold-light)"},
    tabRow:{display:"flex",gap:8,justifyContent:"center",marginBottom:48},
    grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20},
    howSection:{padding:"80px 40px",maxWidth:900,margin:"0 auto",position:"relative",zIndex:1},
    howGrid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24},
    howCard:{
      background:"var(--glass)",border:"1px solid var(--border)",
      borderRadius:20,padding:"32px 24px",textAlign:"center",
      backdropFilter:"blur(10px)",transition:"border-color .2s",
    },
    howIcon:{
      width:56,height:56,borderRadius:16,background:"rgba(201,147,42,.08)",
      border:"1px solid rgba(201,147,42,.15)",display:"flex",alignItems:"center",
      justifyContent:"center",fontSize:"1.5rem",margin:"0 auto 20px",
    },
    howTitle:{fontFamily:"var(--font-display)",fontSize:"1.15rem",fontWeight:600,color:"var(--text)",marginBottom:10},
    howDesc:{fontSize:"0.83rem",color:"var(--text-muted)",lineHeight:1.65},
    orbs:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0},
  };

  return (
    <div style={S.page}>
      {/* Ambient orbs */}
      <div style={S.orbs}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,147,42,.07),transparent)",top:-200,left:-200,filter:"blur(80px)"}} />
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(194,24,91,.06),transparent)",bottom:0,right:-150,filter:"blur(80px)"}} />
      </div>

      <Navbar />

      {/* Hero */}
      <section style={S.hero}>
        <div style={{maxWidth:900}}>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDot} />
            Concours officiel · Édition 2025
            <span style={S.eyebrowDot} />
          </div>
          <h1 style={S.title}>
            <span style={{display:"block",fontStyle:"italic",color:"var(--text)"}}>Le Grand Concours</span>
            <span className="text-gold-gradient" style={{display:"block"}}>Miss & Master</span>
            <span style={{display:"block",fontStyle:"italic",color:"var(--text)",fontSize:"0.55em",letterSpacing:"0.12em",marginTop:8}}>
              — Votez · Soutenez · Couronnez —
            </span>
          </h1>
          <p style={S.sub}>
            Chaque vote compte.{" "}
            <strong style={{color:"var(--gold-light)",fontWeight:500}}>100 FCFA = 1 vote</strong>.{" "}
            Paiement sécurisé via Fapshi, CinetPay ou Stripe.
          </p>
          <div style={S.actions}>
            <Link href="/candidates" className="btn-primary">Voir les candidats</Link>
            <Link href="/ranking" className="btn-ghost">Classement live →</Link>
            <Link href="/candidates/register" className="btn-ghost">Je participe</Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <div style={S.statsBar}>
          {[
            {label:"Candidats",    val:stats.totalCandidates},
            {label:"Votes totaux", val:(stats.totalVotesCount||0).toLocaleString("fr-FR")},
            {label:"Transactions", val:stats.totalTransactions},
            {label:"FCFA collectés",val:Math.round(stats.totalRevenue||0).toLocaleString("fr-FR")},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center"}}>
              <div style={S.statVal}>{s.val}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      {/* Candidats */}
      <section style={S.candSection}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className="section-tag">Les concurrentes &amp; concurrents</div>
          <h2 style={S.sectionTitle}>Découvrez les <em style={S.sectionTitleEm}>candidats</em></h2>
        </div>
        <div style={S.tabRow}>
          {(["ALL","MISS","MASTER"] as const).map(t=>(
            <button key={t} onClick={()=>setCandTab(t)} className={`tab-pill${candTab===t?" active":""}`}>
              {t==="ALL"?"Tous":t==="MISS"?"♛ Miss":"♚ Master"}
            </button>
          ))}
        </div>
        <div style={S.grid}>
          {displayCands.map((c,i)=><CandidateCard key={c.id} candidate={{...c,rank:i+1}} index={i} />)}
        </div>
        <div style={{textAlign:"center",marginTop:40}}>
          <Link href="/candidates" style={{padding:"13px 32px",border:"1px solid rgba(201,147,42,.4)",color:"var(--gold)",borderRadius:100,textDecoration:"none",fontSize:"0.9rem",display:"inline-block",transition:"all .2s"}}>
            Voir tous les candidats →
          </Link>
        </div>
      </section>

      <div className="divider" />

      {/* Comment ça marche */}
      <section style={S.howSection}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className="section-tag">Simple &amp; sécurisé</div>
          <h2 style={S.sectionTitle}>Comment <em style={S.sectionTitleEm}>ça marche</em></h2>
        </div>
        <div style={S.howGrid}>
          {[
            {icon:"👤",title:"Inscription candidat",desc:"Les candidats soumettent leur profil et photo. L'admin valide sous 24h avant mise en ligne."},
            {icon:"💳",title:"Vote payant sécurisé",desc:"100 FCFA = 1 vote. Montant libre. Paiement via Fapshi/CinetPay (Mobile Money) ou Stripe (carte). Aucun vote sans confirmation backend."},
            {icon:"🏆",title:"Classement temps réel",desc:"Le classement se met à jour en direct via WebSocket. Chaque vote est immédiatement reflété."},
          ].map((h,i)=>(
            <div key={i} style={{...S.howCard,animationDelay:`${i*.1}s`}} className="animate-fade-up"
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(201,147,42,.3)"}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)"}
            >
              <div style={S.howIcon}>{h.icon}</div>
              <div style={S.howTitle}>{h.title}</div>
              <div style={S.howDesc}>{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
