import React,{Suspense,lazy,useEffect,useRef,useState}from"react";
import{Link}from"react-router-dom";
import{ArrowDownRight,ArrowRight,Camera,Clock3,Instagram,MapPin,Play,Users,Zap}from"lucide-react";
import Button from"../components/Button";
import Lenis from"lenis";

const Hero3D=lazy(()=>import("../components/Hero3D"));

export default function Home(){
 const ref=useRef(null);
 const [loadHero3D,setLoadHero3D]=useState(false);
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop=window.matchMedia("(min-width: 1024px)").matches;
  if(!reduced&&desktop){
   const load=()=>setLoadHero3D(true);
   if("requestIdleCallback"in window){
    const id=window.requestIdleCallback(load,{timeout:1200});
    return()=>window.cancelIdleCallback(id);
   }
   const timer=window.setTimeout(load,800);
   return()=>window.clearTimeout(timer);
  }
 },[]);
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis=new Lenis({autoRaf:true});
  if(reduced)return()=>lenis.destroy();
  let cleanup=()=>{};
  import("gsap").then(async({default:gsap})=>{
   const{ScrollTrigger}=await import("gsap/ScrollTrigger");
   gsap.registerPlugin(ScrollTrigger);
   const ctx=gsap.context(()=>{
    gsap.utils.toArray(".gh-reveal").forEach(node=>{
     gsap.fromTo(node,{y:42,opacity:0},{y:0,opacity:1,duration:.9,ease:"power3.out",scrollTrigger:{trigger:node,start:"top 88%",once:true}});
    });
    gsap.utils.toArray(".parallax-layer").forEach(node=>{
     const speed=Number(node.dataset.speed||.2);
     gsap.to(node,{yPercent:-20*speed,ease:"none",scrollTrigger:{trigger:node.closest("section")||node,start:"top bottom",end:"bottom top",scrub:true}});
    });
   },ref);
   cleanup=()=>ctx.revert();
  }).catch(()=>{});
  return()=>{cleanup();lenis.destroy()};
 },[]);

 return <main ref={ref} className="overflow-hidden">
  <section className="gh-hero gh-noise relative min-h-[calc(100svh-72px)] overflow-hidden bg-[#050608] text-white">
   <div className="gh-hero-sun absolute -right-[12vw] top-[8vh] h-[52vw] max-h-[680px] w-[52vw] max-w-[680px] rounded-full"/>
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(245,166,35,.22),transparent_22%),linear-gradient(110deg,rgba(5,6,8,.98)_5%,rgba(5,6,8,.76)_46%,rgba(5,6,8,.18)_100%)]"/>
   <div className="parallax-layer absolute -bottom-10 left-[12%] h-[42vh] w-[76%] rotate-[-5deg] opacity-50" data-speed=".7"><div className="gh-court-lines h-full w-full"/></div>
   <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] to-transparent"/>
   <div className="relative mx-auto grid max-w-[1400px] items-end gap-10 px-5 pb-14 pt-14 sm:px-8 sm:pb-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:pt-20">
    <div className="relative z-10">
     <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[.24em] text-white/45"><span>CEBU, PHILIPPINES</span><span>4 PM — 3 AM</span><span>5+ COURTS</span></div>
     <h1 className="mt-8 max-w-6xl text-[clamp(4rem,10vw,10.5rem)] font-black leading-[.78] tracking-[-.075em]">PLAY.<br/><span className="text-amber-400">CREATE.</span><br/>CONNECT.</h1>
     <div className="mt-8 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end">
      <p className="max-w-lg text-base leading-7 text-white/55 sm:text-lg">Cebu's after-hours pickleball experience. Golden-hour light, night sessions, and a place worth bringing your camera to.</p>
      <div className="shrink-0"><span className="block text-[9px] font-black tracking-[.2em] text-white/30">FROM</span><b className="text-3xl font-black text-white">₱450<span className="text-sm text-white/35"> / HR</span></b></div>
     </div>
     <div className="mt-8 flex flex-wrap gap-3">
      <Button as={Link} to="/availability">Book a Court <ArrowRight size={18} className="ml-2"/></Button>
      <Button as={Link} to="/courts" variant="secondary">Explore Courts</Button>
     </div>
    </div>
    <div className="relative hidden min-h-[520px] lg:block">
     <div className="absolute right-0 top-1/2 w-[min(40vw,560px)] -translate-y-1/2">
      <div className="gh-hero-frame">
       {loadHero3D?<Suspense fallback={<div className="grid aspect-square place-items-center rounded-[2rem] bg-white/[.04] text-sm text-white/40">Loading visual…</div>}><Hero3D/></Suspense>:<div className="grid aspect-square place-items-center rounded-[2rem] bg-white/[.025] text-sm text-white/25">Golden hour loading…</div>}
      </div>
      <div className="absolute -bottom-5 -left-10 rounded-2xl border border-white/10 bg-[#10151d]/90 px-5 py-4 shadow-2xl backdrop-blur-xl">
       <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-[#050608]"><Camera size={16}/></span><div><small className="block text-[8px] font-black tracking-[.2em] text-white/30">CONTENT FRIENDLY</small><b className="text-sm">Bring your camera.</b></div></div>
      </div>
     </div>
    </div>
   </div>
   <div className="absolute bottom-6 right-6 hidden items-center gap-2 text-[9px] font-black tracking-[.22em] text-white/30 sm:flex"><ArrowDownRight size={14}/> SCROLL TO EXPLORE</div>
  </section>

  <section className="gh-section relative bg-[#f4f0e8]">
   <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-12">
    <div className="gh-reveal lg:pt-10"><span className="gh-eyebrow">THE BACKDROP</span><h2 className="mt-5 text-5xl font-black leading-[.9] tracking-[-.06em] sm:text-7xl">NOT JUST A COURT.<br/><span className="text-amber-700">IT'S THE BACKDROP.</span></h2><p className="mt-7 max-w-md text-base leading-8 text-neutral-500">Pickleball is the reason to show up. The atmosphere is the reason you stay.</p></div>
    <div className="gh-editorial-image gh-reveal relative min-h-[420px] overflow-hidden rounded-[2rem] sm:min-h-[560px]">
     <div className="absolute inset-0 gh-sunset-art"/>
     <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10"><div className="max-w-md text-white"><span className="text-[9px] font-black tracking-[.25em] text-amber-300">GOLDEN HOUR / CEBU</span><p className="mt-3 text-2xl font-black leading-tight sm:text-4xl">Good light. Good game. Good people.</p></div></div>
    </div>
   </div>
  </section>

  <section className="relative bg-[#10151d] py-24 text-white sm:py-32">
   <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
    <div className="gh-reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><span className="text-[10px] font-black tracking-[.25em] text-amber-400">FOR THE CAMERA</span><h2 className="mt-4 max-w-4xl text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl">MADE FOR<br/><span className="text-amber-400">THE CAMERA.</span></h2></div><p className="max-w-md text-sm leading-7 text-white/45">Three ways to make your next session look as good as it feels.</p></div>
    <div className="mt-14 grid gap-4 md:grid-cols-3">
     <Experience index="01" title="Golden Hour" text="Warm light, long shadows, and the perfect window for portraits and reels." icon={Zap} className="gh-experience-gold"/>
     <Experience index="02" title="After Dark" text="Court lights, deep contrast, and late-night energy for cinematic content." icon={Clock3} className="gh-experience-night"/>
     <Experience index="03" title="The Crowd" text="Bring your crew. Capture the rallies, reactions, fits, and moments between games." icon={Users} className="gh-experience-crowd"/>
    </div>
   </div>
  </section>

  <section className="gh-section bg-[#e8e0d4]">
   <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
    <div className="gh-reveal flex items-end justify-between gap-5"><div><span className="gh-eyebrow">THE LINEUP</span><h2 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">CHOOSE YOUR<br/>COURT.</h2></div><Link className="hidden items-center gap-2 text-sm font-black text-amber-900 sm:flex" to="/courts">View all courts <ArrowRight size={16}/></Link></div>
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     {[1,2,3,4,5].map((n,i)=><Link key={n} to="/courts" className={"gh-court-tile gh-reveal "+(i===0?"md:col-span-2 lg:col-span-2":"")}><div className={"gh-court-art gh-court-art-"+n}><span>COURT {String(n).padStart(2,"0")}</span><ArrowRight className="gh-court-arrow" size={24}/></div><div className="flex items-center justify-between border-b border-black/10 py-4"><div><b className="text-lg font-black">Court {String(n).padStart(2,"0")}</b><small className="ml-3 text-xs text-neutral-500">₱450 / hour</small></div><span className="text-[9px] font-black tracking-[.16em] text-emerald-700">BOOKABLE</span></div></Link>)}
    </div>
   </div>
  </section>

  <section className="gh-section gh-dark-editorial relative overflow-hidden bg-[#07090d] text-white">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(245,166,35,.18),transparent_25%)]"/>
   <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:px-12">
    <div className="gh-reveal"><span className="text-[10px] font-black tracking-[.25em] text-amber-400">AFTER SUNSET</span><h2 className="mt-5 text-6xl font-black leading-[.82] tracking-[-.065em] sm:text-8xl">WHEN THE SUN GOES DOWN,<br/><span className="text-amber-400">THE GAME GETS BETTER.</span></h2><div className="mt-9 flex items-center gap-6"><div><b className="block text-4xl font-black">4 PM</b><span className="text-[9px] font-black tracking-[.2em] text-white/30">OPEN</span></div><div className="h-10 w-px bg-white/10"/><div><b className="block text-4xl font-black">3 AM</b><span className="text-[9px] font-black tracking-[.2em] text-white/30">CLOSE</span></div></div></div>
    <div className="gh-night-art gh-reveal"><div className="gh-night-scene"><div className="gh-night-glow"/><div className="gh-night-court"><div className="gh-night-net"/><div className="gh-night-centerline"/><div className="gh-night-service service-a"/><div className="gh-night-service service-b"/><span className="gh-night-ball"/></div><div className="gh-night-light light-a"/><div className="gh-night-light light-b"/></div></div>
   </div>
  </section>

  <section className="gh-section bg-[#f4f0e8]">
   <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
    <div className="gh-reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="gh-eyebrow">SOCIAL PROOF</span><h2 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">SEEN AT<br/>GOLDEN HOUR.</h2></div><p className="max-w-sm text-sm leading-7 text-neutral-500">A visual placeholder wall ready for real creator content once your social feed is connected.</p></div>
    <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
     {["01","02","03","04","05","06","07","08"].map((n,i)=><div key={n} className={"gh-social-tile gh-reveal gh-social-"+((i%6)+1)+" "+(i===0||i===5?"md:row-span-2":"")}><div className="gh-social-overlay"><Instagram size={18}/><span>#GOLDENHOURCOURTS</span></div></div>)}
    </div>
   </div>
  </section>

  <section className="relative overflow-hidden bg-[#f5a623] px-5 py-20 sm:px-8 sm:py-28">
   <div className="absolute right-0 top-0 h-full w-1/2 opacity-20"><div className="gh-cta-pattern h-full w-full"/></div>
   <div className="relative mx-auto flex max-w-[1400px] flex-col justify-between gap-10 sm:px-4 lg:flex-row lg:items-end">
    <div className="gh-reveal"><span className="text-[10px] font-black tracking-[.25em] text-black/50">YOUR NEXT SESSION</span><h2 className="mt-4 max-w-5xl text-6xl font-black leading-[.82] tracking-[-.065em] text-[#07090d] sm:text-8xl">BRING<br/>YOUR<br/>CAMERA.</h2></div>
    <div className="gh-reveal max-w-sm"><p className="text-lg font-bold leading-7 text-black/65">Golden-hour light. Night sessions. Fast rallies. Good people.</p><Button as={Link} to="/availability" variant="dark" className="mt-7">Book a Court <ArrowRight size={18} className="ml-2"/></Button></div>
   </div>
  </section>
 </main>
}

function Experience({index,title,text,icon:Icon,className=""}){return <article className={"gh-experience relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 p-7 sm:p-9 "+className}><div className="absolute inset-0 gh-experience-art"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-[.2em] text-white/40">{index}</span><span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/20 text-amber-300 backdrop-blur"><Icon size={18}/></span></div><div><h3 className="text-4xl font-black tracking-[-.04em]">{title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-white/55">{text}</p></div></div></article>}
