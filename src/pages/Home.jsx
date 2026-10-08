import React,{Suspense,lazy,useEffect,useRef}from"react";
import{Link}from"react-router-dom";
import{ArrowRight,CalendarDays,CheckCircle2,Clock3,ShieldCheck,Sparkles,Users,Zap}from"lucide-react";
import Button from"../components/Button";
import Lenis from"lenis";

const Hero3D=lazy(()=>import("../components/Hero3D"));

export default function Home(){
 const ref=useRef(null);
 useEffect(()=>{
  const lenis=new Lenis({autoRaf:true});
  const el=ref.current;
  if(!el||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return()=>lenis.destroy();
  let cleanup=()=>{};
  import("gsap").then(async({default:gsap})=>{
   const{ScrollTrigger}=await import("gsap/ScrollTrigger");
   gsap.registerPlugin(ScrollTrigger);
   const ctx=gsap.context(()=>{
    gsap.utils.toArray(".parallax-layer").forEach(node=>{
     const speed=Number(node.dataset.speed||.2);
     gsap.to(node,{yPercent:-20*speed,opacity:1,ease:"none",scrollTrigger:{trigger:node.closest("section")||node,start:"top bottom",end:"bottom top",scrub:true}});
    });
   },el);
   cleanup=()=>ctx.revert();
  }).catch(()=>{});
  return()=>{cleanup();lenis.destroy()};
 },[]);

 return <main ref={ref}>
  <section className="gh-noise relative min-h-[calc(100svh-72px)] overflow-hidden bg-[#07090d] text-white">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(245,166,35,.30),transparent_24%),radial-gradient(circle_at_10%_100%,rgba(102,132,106,.25),transparent_28%),linear-gradient(145deg,#07090d_12%,#141b28_58%,#8f4535_125%)]"/>
   <div className="parallax-layer absolute inset-x-0 bottom-0 h-2/5 opacity-70" data-speed=".5"><div className="h-full bg-[linear-gradient(155deg,transparent_0_35%,rgba(77,116,80,.7)_35%_36%,transparent_36%_42%,rgba(77,116,80,.7)_42%_43%,transparent_43%)]"/></div>
   <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,.72),transparent_70%)]"/>
   <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.05fr_.95fr] lg:py-24">
    <div className="z-10">
     <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-amber-200"><Sparkles size={14}/> Cebu · Philippines</span>
     <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.88] tracking-[-.065em] sm:text-7xl lg:text-[clamp(4.5rem,7.4vw,7.6rem)]">PLAY INTO THE<br/><span className="text-amber-400">GOLDEN HOUR.</span></h1>
     <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">Premium pickleball courts for the people who stay for one more game. Book your court, bring your crew, and own the night.</p>
     <div className="mt-8 flex flex-wrap gap-3">
      <Button as={Link} to="/availability">Book a Court <ArrowRight size={18} className="ml-2"/></Button>
      <Button as={Link} to="/courts" variant="secondary">Explore Courts</Button>
     </div>
     <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
      <Stat icon={Clock3} label="OPEN DAILY" value="4 PM — 3 AM"/>
      <Stat icon={Zap} label="COURT RATE" value="₱450 / HR"/>
      <Stat icon={Users} label="FACILITY" value="5+ COURTS" className="hidden sm:block"/>
     </div>
    </div>
    <div className="relative mx-auto w-full max-w-xl">
     <div className="absolute inset-10 rounded-full bg-amber-400/20 blur-3xl"/>
     <div className="relative rounded-[3rem] border border-white/10 bg-white/[.035] p-2 shadow-2xl backdrop-blur-sm">
      <Suspense fallback={<div className="grid aspect-square place-items-center rounded-[2.6rem] bg-white/[.04] text-sm text-white/40">Loading court visual…</div>}><Hero3D/></Suspense>
     </div>
     <div className="absolute -bottom-3 left-4 rounded-2xl border border-white/10 bg-[#10151d]/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-0"><span className="block text-[9px] font-black tracking-[.2em] text-white/35">TONIGHT'S PLAY</span><b className="mt-1 block text-sm">Your court is waiting.</b></div>
    </div>
   </div>
  </section>

  <section className="gh-section gh-grid bg-[#f4f0e8]">
   <div className="mx-auto max-w-7xl px-5 sm:px-6">
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
     <div><span className="gh-eyebrow">THE GOLDEN HOUR STANDARD</span><h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.04em] sm:text-6xl">Less friction.<br/>More rallies.</h2></div>
     <p className="max-w-md text-sm leading-7 text-neutral-500">Everything from choosing a court to securing your session is designed to stay simple, fast, and clear.</p>
    </div>
    <div className="mt-12 grid gap-4 md:grid-cols-3">
     <Feature icon={CalendarDays} number="01" title="Pick your slot" text="Choose a court, date, duration, and start time from live availability."/>
     <Feature icon={ShieldCheck} number="02" title="Secure the session" text="Server-side checks protect every booking from overlapping reservations."/>
     <Feature icon={CheckCircle2} number="03" title="Play with confidence" text="Your reservation stays connected to your account and ready when you are."/>
    </div>
   </div>
  </section>

  <section className="relative overflow-hidden bg-[#10151d] py-20 text-white sm:py-28">
   <div className="absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-400/[.09] blur-3xl"/>
   <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end">
    <div><span className="text-[10px] font-black tracking-[.24em] text-amber-400">READY WHEN YOU ARE</span><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-6xl">Your next game starts here.</h2><p className="mt-5 max-w-xl text-white/45">Open daily until 3 AM. Grab your crew and reserve a court before the good hours disappear.</p></div>
    <Button as={Link} to="/availability">Find a Court <ArrowRight size={18} className="ml-2"/></Button>
   </div>
  </section>
 </main>
}

function Stat({icon:Icon,label,value,className=""}){return <div className={"rounded-2xl border border-white/10 bg-white/[.055] p-4 backdrop-blur-md "+className}><Icon size={17} className="text-amber-400"/><small className="mt-3 block text-[9px] font-black tracking-[.18em] text-white/35">{label}</small><b className="mt-1 block text-sm">{value}</b></div>}
function Feature({icon:Icon,number,title,text}){return <div className="gh-card group rounded-[1.7rem] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(8,11,18,.12)]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#10151d] text-amber-400"><Icon size={19}/></span><span className="text-[10px] font-black tracking-[.2em] text-neutral-300">{number}</span></div><h3 className="mt-8 text-2xl font-black tracking-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-500">{text}</p></div>}
