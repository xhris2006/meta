"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const publicLinks = [
  ["Candidats", "/candidates"],
  ["Classement", "/ranking"],
  ["Participer", "/candidates/register"],
  ["Support", "/support"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          padding: "0 12px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,0,5,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,147,42,.15)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "var(--gold-light)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>M</span>
          <span className="hidden sm:inline">MISS & MASTER</span>
        </Link>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }} className="hidden lg:flex">
          {publicLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden lg:flex">
          {isAuthenticated && user?.role === "ADMIN" ? (
            <>
              <Link
                href="/admin"
                style={{
                  color: "var(--gold)",
                  fontSize: "0.65rem",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(239,83,80,.4)",
                  borderRadius: 100,
                  padding: "5px 12px",
                  color: "#EF5350",
                  fontSize: "0.65rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/vote" className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.7rem" }}>
                Vote
              </Link>
              <Link
                href="/xhrisadmin"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.65rem",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                }}
              >
                Admin
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden"
          aria-label="Menu"
          style={{
            width: 38,
            height: 36,
            borderRadius: 8,
            border: "1px solid rgba(201,147,42,.25)",
            background: "rgba(201,147,42,.08)",
            color: "var(--text)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          ☰
        </button>
      </nav>

      {open && (
        <>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              border: "none",
              zIndex: 99,
              cursor: "pointer",
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "min(280px,100vw)",
              height: "100vh",
              zIndex: 101,
              background: "linear-gradient(180deg,rgba(20,5,12,.95),rgba(10,2,6,.95))",
              borderLeft: "1px solid rgba(201,147,42,.2)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: "1px solid rgba(201,147,42,.15)",
              }}
            >
              <div style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                MENU
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid rgba(201,147,42,.2)",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px" }}>
              {publicLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    color: "var(--text)",
                    textDecoration: "none",
                    background: "rgba(201,147,42,.08)",
                    border: "1px solid rgba(201,147,42,.15)",
                    fontSize: "0.8rem",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,147,42,.15)";
                    e.currentTarget.style.borderColor = "rgba(201,147,42,.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,147,42,.08)";
                    e.currentTarget.style.borderColor = "rgba(201,147,42,.15)";
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 10px" }}>
              <Link
                href="/vote"
                onClick={() => setOpen(false)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  textDecoration: "none",
                  textAlign: "center",
                  background: "linear-gradient(135deg,var(--gold),var(--gold-light))",
                  color: "#08000A",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Vote Now
              </Link>

              {isAuthenticated && user?.role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      textDecoration: "none",
                      color: "var(--gold-light)",
                      border: "1px solid rgba(201,147,42,.3)",
                      textAlign: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(239,83,80,.3)",
                      background: "transparent",
                      color: "#EF5350",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/xhrisadmin"
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "var(--text-muted)",
                    border: "1px solid rgba(201,147,42,.2)",
                    textAlign: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  Admin
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
