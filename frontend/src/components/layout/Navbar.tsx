"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";

const links = [
  ["Accueil", "/"],
  ["Candidats", "/candidates"],
  ["Classement", "/ranking"],
  ["Participer", "/candidates/register"],
  ["Support", "/support"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    router.push("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 120,
          height: "66px",
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,107,0,0.16)",
          boxShadow: "0 26px 70px rgba(0,0,0,0.35)",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--gold-light)",
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          META VOTE
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
              title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "1px solid rgba(255,107,0,0.22)",
                background: "rgba(255,107,0,0.12)",
                color: "var(--text)",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            style={{
              minWidth: 96,
              height: 42,
              padding: "0 14px",
              borderRadius: 20,
              border: "1px solid rgba(255,107,0,0.24)",
              background: "rgba(255,107,0,0.1)",
              color: "var(--text)",
              fontSize: "0.9rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "0.92rem", lineHeight: 1, letterSpacing: "-0.12em" }}>☰</span>
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {open && (
        <>
          <button
            onClick={closeMenu}
            aria-label="Fermer le menu"
            style={{
              position: "fixed",
              inset: 0,
              border: "none",
              background: "rgba(0,0,0,0.68)",
              zIndex: 121,
              cursor: "pointer",
            }}
          />

          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "min(320px, 92vw)",
              height: "100vh",
              zIndex: 122,
              padding: "24px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "radial-gradient(circle at top right, rgba(255,107,0,0.18), transparent 26%), #070707",
              borderLeft: "1px solid rgba(255,107,0,0.18)",
              boxShadow: "-22px 0 70px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  color: "var(--gold-light)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Navigation
              </div>
              <button
                onClick={closeMenu}
                aria-label="Fermer"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  border: "1px solid rgba(255,107,0,.16)",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                background: "rgba(255,107,0,.06)",
                border: "1px solid rgba(255,107,0,.12)",
                color: "var(--text-muted)",
                fontSize: "0.76rem",
                lineHeight: 1.55,
              }}
            >
              Utilisez ce menu pour aller vers chaque page du concours.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 18,
                    color: "var(--text)",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,107,0,0.16)",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              <Link
                href="/vote"
                onClick={closeMenu}
                style={{
                  padding: "11px 12px",
                  borderRadius: 12,
                  textDecoration: "none",
                  textAlign: "center",
                  background: "linear-gradient(135deg,var(--gold),var(--gold-light))",
                  color: "#08000A",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                }}
              >
                Voter maintenant
              </Link>

              {isAuthenticated && user?.role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    style={{
                      padding: "11px 12px",
                      borderRadius: 12,
                      textDecoration: "none",
                      textAlign: "center",
                      color: "var(--gold-light)",
                      border: "1px solid rgba(255,107,0,.24)",
                      fontSize: "0.84rem",
                    }}
                  >
                    Administration
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "11px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(239,83,80,.24)",
                      background: "transparent",
                      color: "#EF5350",
                      cursor: "pointer",
                      fontSize: "0.84rem",
                    }}
                  >
                    Deconnexion
                  </button>
                </>
              ) : null}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
