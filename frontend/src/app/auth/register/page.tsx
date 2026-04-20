"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const schema = z.object({
  name:     z.string().min(2, "Nom requis (min 2 caractères)"),
  email:    z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  phone:    z.string().optional(),
});
type F = z.infer<typeof schema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router   = useRouter();
  const setAuth  = useAuthStore(s => s.setAuth);
  const { register, handleSubmit, formState:{ errors } } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success("Compte créé avec succès !");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  const S: Record<string, React.CSSProperties> = {
    wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      background:"radial-gradient(ellipse at 20% 50%,rgba(201,147,42,.07),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(194,24,91,.06),transparent 50%)" },
    card:  { background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:420, backdropFilter:"blur(20px)" },
    title: { fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:300, color:"var(--text)", marginBottom:4, textAlign:"center" as const },
    sub:   { fontSize:"0.82rem", color:"var(--text-muted)", textAlign:"center" as const, marginBottom:28 },
    label: { display:"block", fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:8 },
    input: { width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid var(--border)", borderRadius:12, padding:"13px 16px", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:"0.9rem", outline:"none", transition:"border-color .2s" },
    btn:   { width:"100%", padding:15, marginTop:8, background:"linear-gradient(135deg,var(--gold),var(--gold-light))", color:"#08000A", border:"none", borderRadius:12, fontSize:"0.9rem", fontWeight:500, cursor:"pointer", fontFamily:"var(--font-body)", transition:"transform .2s,box-shadow .2s", boxShadow:"0 0 24px rgba(201,147,42,.2)" },
    err:   { fontSize:"0.72rem", color:"#EF5350", marginTop:4 },
    foot:  { textAlign:"center" as const, fontSize:"0.82rem", color:"var(--text-muted)", marginTop:24 },
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(201,147,42,.5)"; };
  const blurInput  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "var(--border)"; };

  const fields = [
    { name:"name"     as const, label:"Nom complet",           type:"text",     placeholder:"Jean Dupont" },
    { name:"email"    as const, label:"Email",                 type:"email",    placeholder:"vous@email.com" },
    { name:"password" as const, label:"Mot de passe",          type:"password", placeholder:"8 caractères min." },
    { name:"phone"    as const, label:"Téléphone (optionnel)", type:"tel",      placeholder:"+237 6XX XXX XXX" },
  ];

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <span style={{ fontFamily:"var(--font-display)", fontSize:"1.5rem", color:"var(--gold-light)" }}>♛ META M&M</span>
        </div>
        <h1 style={S.title}>Créer un compte</h1>
        <p style={S.sub}>Rejoignez la communauté META MISS & MASTER</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {fields.map(f => (
            <div key={f.name}>
              <label style={S.label}>{f.label}</label>
              <input {...register(f.name)} type={f.type} placeholder={f.placeholder}
                style={S.input} onFocus={focusInput} onBlur={blurInput} />
              {errors[f.name] && <p style={S.err}>{errors[f.name]?.message as string}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading} style={S.btn}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=""; }}
          >{loading ? "Création..." : "Créer mon compte"}</button>
        </form>

        <p style={S.foot}>
          Déjà un compte ?{" "}
          <Link href="/auth/login" style={{ color:"var(--gold-light)", textDecoration:"none" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
