import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      position:"relative",zIndex:1,
      borderTop:"1px solid var(--border)",
      padding:"36px 40px",
      display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,
      background:"rgba(10,0,5,0.5)",
    }}>
      <div style={{fontFamily:"var(--font-display)",fontSize:"1rem",color:"var(--gold-light)",fontStyle:"italic"}}>
        META MISS & MASTER
      </div>
      <div style={{display:"flex",gap:24}}>
        {[["Candidats","/candidates"],["Classement","/ranking"],["Participer","/candidates/register"]].map(([l,h])=>(
          <Link key={h} href={h} style={{color:"var(--text-muted)",textDecoration:"none",fontSize:"0.78rem",letterSpacing:"0.05em",transition:"color .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
            onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}
          >{l}</Link>
        ))}
      </div>
      <div style={{fontSize:"0.72rem",color:"var(--text-muted)"}}>© {new Date().getFullYear()} META MISS & MASTER</div>
    </footer>
  );
}
