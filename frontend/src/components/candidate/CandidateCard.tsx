"use client";
import Image from "next/image";
import Link from "next/link";

interface Candidate {
  id: string; name: string; type: string; city: string;
  photoUrl: string; totalVotes: number; rank?: number;
}

export default function CandidateCard({ candidate, index = 0 }: { candidate: Candidate; index?: number }) {
  const isMiss = candidate.type === "MISS";
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api","");
  const photo = candidate.photoUrl?.startsWith("http") ? candidate.photoUrl : `${apiBase}${candidate.photoUrl}`;

  const S: Record<string,React.CSSProperties> = {
    card: {
      background:"var(--glass)",border:"1px solid var(--border)",
      borderRadius:20,overflow:"hidden",backdropFilter:"blur(12px)",
      transition:"transform .3s,border-color .3s,box-shadow .3s",
      animation:`fade-up .6s ${index*0.07}s ease both`,
    },
    photo: {
      position:"relative",height:260,overflow:"hidden",
      background: isMiss ? "linear-gradient(135deg,#1A0010,#0A0820)"
                         : "linear-gradient(135deg,#000E1A,#001028)",
    },
    gradient: {
      position:"absolute",bottom:0,left:0,right:0,height:"60%",
      background:"linear-gradient(to top,rgba(10,0,5,.95),transparent)",zIndex:1,
    },
    avatar: {
      width:"100%",height:"100%",display:"flex",alignItems:"center",
      justifyContent:"center",fontSize:"5rem",opacity:.3,
      background:"radial-gradient(ellipse at 50% 30%,rgba(255,107,0,.15),transparent)",
    },
    typeBadge: {
      position:"absolute",top:12,left:12,zIndex:2,
      padding:"4px 12px",borderRadius:100,fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.08em",
    },
    rankBadge: {
      position:"absolute",top:12,right:12,zIndex:2,
      width:30,height:30,borderRadius:"50%",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:"0.75rem",fontWeight:700,
    },
    voteCount: {
      position:"absolute",bottom:12,right:12,zIndex:2,
      display:"flex",alignItems:"center",gap:5,
      background:"rgba(10,0,5,.65)",backdropFilter:"blur(8px)",
      padding:"4px 10px",borderRadius:100,
      fontSize:"0.75rem",color:"var(--gold-pale)",
    },
    body: { padding:16 },
    name: { fontFamily:"var(--font-display)",fontSize:"1.15rem",fontWeight:600,color:"var(--text)",marginBottom:4 },
    city: { fontSize:"0.75rem",color:"var(--text-muted)",marginBottom:14,display:"flex",alignItems:"center",gap:5 },
    actions: { display:"flex",gap:8 },
    btnVote: {
      flex:1,padding:"9px 0",
      background:"linear-gradient(135deg,var(--gold),var(--gold-light))",
      color:"#08000A",border:"none",borderRadius:12,fontSize:"0.8rem",fontWeight:500,
      cursor:"pointer",transition:"opacity .2s",fontFamily:"var(--font-body)",textAlign:"center" as const,
      textDecoration:"none",display:"block",
    },
    btnProfile: {
      flex:1,padding:"9px 0",background:"transparent",
      color:"var(--gold)",border:"1px solid rgba(255,107,0,.3)",borderRadius:12,
      fontSize:"0.8rem",cursor:"pointer",transition:"all .2s",fontFamily:"var(--font-body)",
      textAlign:"center" as const,textDecoration:"none",display:"block",
    },
  };

  const rankClass = candidate.rank && candidate.rank <= 3 ? `rank-${candidate.rank}` : "";

  return (
    <div style={S.card}
      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform="translateY(-6px)";(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,107,0,.35)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 20px 60px rgba(0,0,0,.4)"; }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform="";(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)";(e.currentTarget as HTMLDivElement).style.boxShadow=""; }}
    >
      <div style={S.photo}>
        <Image src={photo} alt={candidate.name} fill style={{objectFit:"cover"}}
          onError={(e:any)=>{ e.target.src="/placeholder.jpg"; }} />
        <div style={S.gradient} />
        <div style={S.typeBadge} className={isMiss?"badge-miss":"badge-master"}>
          {isMiss ? "♛ MISS" : "♚ MASTER"}
        </div>
        {rankClass && (
          <div style={S.rankBadge} className={rankClass}>{candidate.rank}</div>
        )}
        <div style={S.voteCount}>
          <span style={{color:"var(--gold)"}}>★</span>
          {candidate.totalVotes.toLocaleString("fr-FR")}
        </div>
      </div>
      <div style={S.body}>
        <div style={S.name}>{candidate.name}</div>
        <div style={S.city}>📍 {candidate.city}</div>
        <div style={S.actions}>
          <Link href={`/candidates/${candidate.id}`} style={S.btnProfile}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background="rgba(255,107,0,.08)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,107,0,.5)"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,107,0,.3)"; }}
          >Profil</Link>
          <Link href={`/vote/${candidate.id}`} style={S.btnVote}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.opacity=".85"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.opacity="1"; }}
          >⭐ Voter</Link>
        </div>
      </div>
    </div>
  );
}
