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
  email:    z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
type F = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router   = useRouter();
  const setAuth  = useAuthStore(s => s.setAuth);
  const { register, handleSubmit, formState:{ errors } } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Bienvenue, ${user.name} !`);
      router.push(user.role === "ADMIN" ? "/admin" : "/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Identifiants incorrects");
    } finally { setLoading(false); }
  };

  const S: Record<string, React.CSSProperties> = {
    wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      background:"radial-gradient(ellipse at 20% 50%,rgba(201,147,42,.07),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(194,24,91,.06),transparent 50%)" },
    card: { background:"var(--glass)", border:"1px solid var(--border)", borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:420, backdropFilter:"blur(20px)" },
    logo: { textAlign:"center" as const, marginBottom:28 },
    title:{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:300, color:"var(--text)", marginBottom:4, textAlign:"center" as const },
    sub:  { fontSize:"0.82rem", color:"var(--text-muted)", textAlign:"center" as const, marginBottom:28 },
    label:{ display:"block", fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:8 },
    input:{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid var(--border)", borderRadius:12, padding:"13px 16px", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:"0.9rem", outline:"none", transition:"border-color .2s" },
    btn:  { width:"100%", padding:15, marginTop:8, background:"linear-gradient(135deg,var(--gold),var(--gold-light))", color:"#08000A", border:"none", borderRadius:12, fontSize:"0.9rem", fontWeight:500, cursor:"pointer", fontFamily:"var(--font-body)", transition:"transform .2s,box-shadow .2s", boxShadow:"0 0 24px rgba(201,147,42,.2)" },
    err:  { fontSize:"0.72rem", color:"#EF5350", marginTop:4 },
    foot: { textAlign:"center" as const, fontSize:"0.82rem", color:"var(--text-muted)", marginTop:24 },
  };

  const focusInput  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(201,147,42,.5)"; };
  const blurInput   = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "var(--border)"; };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}><span style={{ fontFamily:"var(--font-display)", fontSize:"1.5rem", color:"var(--gold-light)" }}>♛ META M&M</span></div>
        <h1 style={S.title}>Connexion</h1>
        <p style={S.sub}>Accédez à votre compte</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={S.label}>Email</label>
            <input {...register("email")} type="email" placeholder="vous@email.com" style={S.input} onFocus={focusInput} onBlur={blurInput} />
            {errors.email && <p style={S.err}>{errors.email.message}</p>}
          </div>
          <div>
            <label style={S.label}>Mot de passe</label>
            <div style={{ position:"relative" }}>
              <input {...register("password")} type={showPwd?"text":"password"} placeholder="••••••••"
                style={{ ...S.input, paddingRight:44 }} onFocus={focusInput} onBlur={blurInput} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:"1rem" }}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p style={S.err}>{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} style={S.btn}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow="0 6px 32px rgba(201,147,42,.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=""; (e.currentTarget as HTMLButtonElement).style.boxShadow="0 0 24px rgba(201,147,42,.2)"; }}
          >{loading ? "Connexion..." : "Se connecter"}</button>
        </form>

        <p style={S.foot}>
          Pas de compte ?{" "}
          <Link href="/auth/register" style={{ color:"var(--gold-light)", textDecoration:"none" }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
