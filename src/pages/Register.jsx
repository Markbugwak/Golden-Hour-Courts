import React,{useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{ArrowRight,ShieldCheck,Sparkles}from"lucide-react";
import Button from"../components/Button";
import{supabase}from"../lib/supabase";

export default function Register(){
 const[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false),nav=useNavigate();
 const submit=async e=>{
  e.preventDefault();setBusy(true);setError("");setMessage("");
  if(!supabase){setError("Supabase is not configured. Add the variables from .env.example.");setBusy(false);return}
  const{data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name}}});
  if(error)setError(error.message);else if(data.session)nav("/reservations",{replace:true});else setMessage("Account created. Check your email if confirmation is enabled.");
  setBusy(false)
 };
 return <main className="relative overflow-hidden bg-[#f4f0e8] px-5 py-16 sm:py-24"><div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"/><div className="relative mx-auto max-w-xl"><div className="mb-7 flex items-center gap-2 text-[10px] font-black tracking-[.22em] text-amber-700"><Sparkles size={14}/> NEW MEMBER</div><h1 className="text-5xl font-black tracking-[-.05em]">Join the club.</h1><p className="mt-4 max-w-md text-neutral-500">Create an account for secure reservations and easier repeat sessions.</p><form onSubmit={submit} className="mt-8 rounded-[1.8rem] border border-black/[.07] bg-white p-6 shadow-[0_25px_70px_rgba(8,11,18,.08)] sm:p-8">
  <label className="block text-sm font-black">Name<input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 mb-5 min-h-12 w-full rounded-xl border border-stone-200 px-4 shadow-sm"/></label>
  <label className="block text-sm font-black">Email<input required autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 mb-5 min-h-12 w-full rounded-xl border border-stone-200 px-4 shadow-sm"/></label>
  <label className="block text-sm font-black">Password<input required minLength={8} autoComplete="new-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 px-4 shadow-sm"/></label>
  <div className="mt-5 flex gap-3 rounded-xl bg-stone-50 p-4 text-xs leading-5 text-neutral-500"><ShieldCheck size={17} className="shrink-0 text-emerald-600"/>Your account is used to protect and manage your reservations.</div>
  {error&&<div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
  {message&&<div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
  <Button type="submit" disabled={busy} className="mt-6 w-full">{busy?"Creating…":"Create account"} <ArrowRight size={17} className="ml-2"/></Button>
  <p className="mt-5 text-center text-sm text-neutral-500">Already a member? <Link className="font-black text-amber-800" to="/login">Sign in</Link></p>
 </form></div></main>
