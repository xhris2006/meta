import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(201,147,42,.15)",
        padding: "24px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        background: "rgba(10,0,5,0.6)",
        fontSize: "0.75rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.8rem",
          color: "var(--gold-light)",
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        MISS & MASTER
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", flex: 1 }}>
        {[
          ["Candidats", "/candidates"],
          ["Classement", "/ranking"],
          ["Participer", "/candidates/register"],
        ].map(([l, h]) => (
          <Link
            key={h}
            href={h}
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {l}
          </Link>
        ))}
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()}</div>
    </footer>
  );
}
