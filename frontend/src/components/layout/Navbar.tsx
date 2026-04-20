"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <nav style={{
      position:"fixed",top:0,width:"100%",zIndex:100,
      padding:"0 40px",height:"64px",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:"rgba(10,0,5,0.75)",backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--border)",
    }}>
      <Link href="/" style={{
        fontFamily:"var(--font-display)",fontSize:"1.3rem",fontWeight:600,
        letterSpacing:"0.08em",color:"var(--gold-light)",
        display:"flex",alignItems:"center",gap:10,textDecoration:"none",
      }}>
        ♛ META MISS & MASTER
      </Link>

      <div style={{display:"flex",gap:32,alignItems:"center"}} className="hidden md:flex">
        {[["Candidats","/candidates"],["Classement","/ranking"],["Participer","/candidates/register"]].map(([l,h])=>(
          <Link key={h} href={h} style={{
            color:"var(--text-muted)",textDecoration:"none",fontSize:"0.82rem",
            letterSpacing:"0.06em",textTransform:"uppercase",transition:"color .2s",
          }}
          onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
          onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}
          >{l}</Link>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12}} className="hidden md:flex">
        {isAuthenticated ? (
          <>
            {user?.role==="ADMIN" && (
              <Link href="/admin" style={{color:"var(--gold)",fontSize:"0.82rem",textDecoration:"none",letterSpacing:"0.06em",textTransform:"uppercase"}}>Admin</Link>
            )}
            <span style={{color:"var(--text-muted)",fontSize:"0.82rem"}}>{user?.name}</span>
            <button onClick={handleLogout} style={{background:"transparent",border:"1px solid rgba(239,83,80,.3)",borderRadius:100,padding:"6px 16px",color:"#EF5350",fontSize:"0.78rem",cursor:"pointer",fontFamily:"var(--font-body)"}}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{color:"var(--text-muted)",fontSize:"0.82rem",textDecoration:"none",letterSpacing:"0.06em"}}>Connexion</Link>
            <Link href="/vote" className="btn-primary" style={{padding:"8px 20px",fontSize:"0.82rem"}}>Voter maintenant</Link>
          </>
        )}
      </div>

      {/* Mobile burger */}
      <button onClick={()=>setOpen(!open)} className="md:hidden" style={{background:"transparent",border:"none",color:"var(--text)",fontSize:"1.4rem",cursor:"pointer"}}>
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div style={{
          position:"absolute",top:"64px",left:0,right:0,
          background:"rgba(10,0,5,0.95)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid var(--border)",
          padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,
        }}>
          {[["Candidats","/candidates"],["Classement","/ranking"],["Participer","/candidates/register"]].map(([l,h])=>(
            <Link key={h} href={h} onClick={()=>setOpen(false)} style={{color:"var(--text-muted)",textDecoration:"none",fontSize:"0.9rem"}}>{l}</Link>
          ))}
          {isAuthenticated
            ? <button onClick={handleLogout} style={{textAlign:"left",background:"transparent",border:"none",color:"#EF5350",fontSize:"0.9rem",cursor:"pointer",padding:0}}>Déconnexion</button>
            : <><Link href="/auth/login" onClick={()=>setOpen(false)} style={{color:"var(--text-muted)",textDecoration:"none"}}>Connexion</Link>
               <Link href="/auth/register" onClick={()=>setOpen(false)} style={{color:"var(--gold-light)",textDecoration:"none",fontWeight:500}}>S'inscrire</Link></>
          }
        </div>
      )}
    </nav>
  );
}
