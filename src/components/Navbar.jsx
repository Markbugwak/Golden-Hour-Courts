import React,{useEffect,useState}from"react";
import{Link,NavLink,useNavigate}from"react-router-dom";
import{ArrowUpRight,Menu,X}from"lucide-react";
import{supabase}from"../lib/supabase";

export default function Navbar(){
  const[open,setOpen]=useState(false);
  const[user,setUser]=useState(null),[isAdmin,setIsAdmin]=useState(false);
  const nav=useNavigate();

  useEffect(()=>{
    if(!supabase)return;
    supabase.auth.getUser().then(async({data})=>{setUser(data.user);if(data.user){const r=await supabase.rpc("current_user_is_admin");setIsAdmin(!r.error&&r.data===true)}});
    const{data}=supabase.auth.onAuthStateChange(async(_e,s)=>{setUser(s?.user??null);if(s?.user){const r=await supabase.rpc("current_user_is_admin");setIsAdmin(!r.error&&r.data===true)}else setIsAdmin(false)});
    return()=>data.subscription.unsubscribe();
  },[]);

  const signOut=async()=>{await supabase?.auth.signOut();setOpen(false);nav("/")};
  const links=[["Courts","/courts"],["Availability","/availability"],["Reservations","/reservations"]];

  return <header className="sticky top-0 z-50 border-b border-white/[.08] bg-[#07090d]/90 text-white shadow-[0_10px_40px_rgba(0,0,0,.12)] backdrop-blur-2xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
      <Link to="/" className="group flex items-center gap-3" onClick={()=>setOpen(false)}>
        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.06]">
          <img src="/images/logo/golden-hour-courts.svg" alt="" className="h-7 w-7 transition-transform duration-500 group-hover:scale-110"/>
        </span>
        <span className="hidden text-[13px] font-black tracking-[.12em] sm:block">GOLDEN HOUR <span className="text-amber-400">COURTS</span></span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {links.map(([label,path])=><NavLink key={path} to={path} className={({isActive})=>isActive?"relative rounded-full bg-white/[.08] px-4 py-2.5 text-[13px] font-bold text-white":"relative rounded-full px-4 py-2.5 text-[13px] font-bold text-white/55 transition hover:bg-white/[.05] hover:text-white"}>{label}</NavLink>)}
        <span className="mx-3 h-5 w-px bg-white/10"/>
        {user
          ? <button onClick={signOut} className="rounded-full border border-white/12 px-4 py-2.5 text-[13px] font-bold text-white/75 transition hover:border-white/25 hover:bg-white/[.06] hover:text-white">Sign out</button>
          : <Link to="/login" className="group inline-flex items-center gap-1 rounded-full bg-amber-400 px-5 py-2.5 text-[13px] font-black text-black shadow-[0_8px_25px_rgba(245,166,35,.18)] transition hover:-translate-y-0.5 hover:bg-amber-300">Sign in <ArrowUpRight size={15}/></Link>}
      </nav>

      <button className="rounded-xl border border-white/10 bg-white/[.04] p-2.5 md:hidden" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close menu":"Open menu"}>{open?<X size={21}/>:<Menu size={21}/>}</button>
    </div>

    {open&&<nav className="border-t border-white/10 bg-[#07090d] p-3 md:hidden">
      {links.map(([label,path])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"block rounded-xl bg-white/[.08] p-3.5 text-sm font-bold text-amber-300":"block rounded-xl p-3.5 text-sm font-bold text-white/70"}>{label}</NavLink>)}
      {user
        ? <button onClick={signOut} className="mt-1 w-full rounded-xl p-3.5 text-left text-sm font-bold text-white/70">Sign out</button>
        : <Link to="/login" onClick={()=>setOpen(false)} className="mt-1 block rounded-xl p-3.5 text-sm font-bold text-amber-300">Sign in</Link>}
    </nav>}
  </header>
}
