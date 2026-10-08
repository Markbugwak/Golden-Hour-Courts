import React from"react";
import{ArrowRight,Check}from"lucide-react";
import{Link}from"react-router-dom";
import CourtImage from"./CourtImage";

export default function CourtCard({court}){
 return <article className="group overflow-hidden rounded-[1.7rem] border border-black/[.07] bg-white shadow-[0_16px_55px_rgba(8,11,18,.065)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(8,11,18,.12)]">
  <div className="relative overflow-hidden">
   <CourtImage src={court.image_url} name={court.name} className="aspect-[4/3] transition duration-700 group-hover:scale-[1.04]"/>
   <div className="absolute inset-x-4 top-4 flex items-center justify-between"><span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black tracking-[.18em] text-white backdrop-blur-md">COURT {court.display_order||"—"}</span><span className="rounded-full bg-emerald-400 px-3 py-1.5 text-[9px] font-black tracking-[.14em] text-emerald-950">AVAILABLE</span></div>
  </div>
  <div className="p-6 sm:p-7">
   <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-black tracking-tight">{court.name}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{court.description||"Premium pickleball court."}</p></div><span className="text-sm font-black text-amber-700">₱450</span></div>
   <div className="mt-5 flex flex-wrap gap-2">{(court.features||[]).map(f=><span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-semibold text-neutral-600"><Check size={12} className="text-emerald-600"/>{f}</span>)}</div>
   <Link to={"/availability?court="+court.id} className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-800 transition group-hover:gap-3">Check availability <ArrowRight size={16}/></Link>
  </div>
 </article>
}
