import React,{useState}from"react";
import{Link,useLocation,useNavigate}from"react-router-dom";
import{ArrowRight,LockKeyhole,Sparkles}from"lucide-react";
import Button from"../components/Button";
import{supabase}from"../lib/supabase";

export default function Login(){
 const[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const nav=useNavigate(),location=useLocation();
 const submit=async e=>{
  e.preventDefault();setBusy(true);setError("");
  if(!supabase){setError("Supabase is not configured. Add the variables from .env.example.");setBusy(false);return}
  const{error}=await supabase.auth.signInWithPassword({email,password});
  if(error)setError(error.message);else nav(location.state?.from||"/reservations",{replace:true});
  setBusy(false)
 };
 return <AuthShell eyebrow="MEMBER ACCESS" title="Welcome back" text="Sign in to manage your reservations and get back on court.">
  <form onSubmit={submit} className="space-y-5">
   <Field label="Email"><input required autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-4 shadow-sm"/></Field>
   <Field label="Password"><input required autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-4 shadow-sm"/></Field>
   {error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
   <Button type="submit" disabled={busy} className="w-full">{busy?"Signing in…":"Sign in"} <ArrowRight size={17} className="ml-2"/></Button>
   <p className="text-center text-sm text-neutral-500">New here? <Link className="font-black text-amber-800" to="/register">Create an account</Link></p>
  </form>
 </AuthShell>
}

function Field({label,children}){return <label className="block text-sm font-black text-neutral-800">{label}{children}</label>}
function AuthShell({eyebrow,title,text,children}){return <main className="relative overflow-hidden bg-[#f4f0e8] px-5 py-16 sm:py-24"><div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"/><div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[.85fr_1fr]"><div className="hidden lg:block"><span className="gh-eyebrow">GOLDEN HOUR COURTS</span><h2 className="mt-5 text-6xl font-black tracking-[-.055em]">Stay for<br/><span className="text-amber-700">one more game.</span></h2><p className="mt-5 max-w-md leading-7 text-neutral-500">Your account keeps reservations organized so you can spend less time managing a booking and more time playing.</p></div><div><div className="mb-7 flex items-center gap-2 text-[10px] font-black tracking-[.22em] text-amber-700"><Sparkles size={14}/> {eyebrow}</div><h1 className="text-5xl font-black tracking-[-.05em]">{title}</h1><p className="mt-4 max-w-md text-neutral-500">{text}</p><div className="mt-8 rounded-[1.8rem] border border-black/[.07] bg-white p-6 shadow-[0_25px_70px_rgba(8,11,18,.08)] sm:p-8">{children}</div></div></div></main>}
