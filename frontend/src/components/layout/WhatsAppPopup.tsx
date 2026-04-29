"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mmm-whatsapp-popup-dismissed";
const DEFAULT_WHATSAPP_URL = "https://wa.me/237680000000";

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_URL || DEFAULT_WHATSAPP_URL;

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  const close = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Fermer l invitation WhatsApp"
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5,0,3,.72)",
          border: "none",
          zIndex: 160,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: "auto 16px 20px 16px",
          maxWidth: 420,
          margin: "0 auto",
          zIndex: 161,
          background: "linear-gradient(180deg, rgba(20,7,11,.98), rgba(8,0,3,.98))",
          border: "1px solid rgba(255,107,0,.18)",
          borderRadius: 24,
          padding: "22px 18px",
          boxShadow: "0 24px 60px rgba(0,0,0,.45)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(37,211,102,.12)",
            color: "#7FF0A0",
            border: "1px solid rgba(37,211,102,.22)",
            fontSize: "0.76rem",
            marginBottom: 14,
          }}
        >
          Support rapide
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 10 }}>
          Rejoindre WhatsApp ?
        </h3>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: 18 }}>
          Pour les questions, paiements et confirmations, rejoignez le support WhatsApp officiel.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              minWidth: 180,
              textAlign: "center",
              textDecoration: "none",
              padding: "14px 16px",
              borderRadius: 16,
              background: "linear-gradient(135deg,#25D366,#7FF0A0)",
              color: "#04150A",
              fontWeight: 700,
            }}
          >
            Rejoindre WhatsApp
          </Link>
          <button
            onClick={close}
            style={{
              flex: 1,
              minWidth: 140,
              padding: "14px 16px",
              borderRadius: 16,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Plus tard
          </button>
        </div>
      </div>
    </>
  );
}
