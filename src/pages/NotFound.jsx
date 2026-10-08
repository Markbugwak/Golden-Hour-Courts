import React from"react";
import{Link}from"react-router-dom";
import{ArrowLeft,MapPin}from"lucide-react";

export default function NotFound(){
 return <main className="grid min-h-[70vh] place-items-center overflow-hidden bg-[#10151d] px-5 py-20 text-center text-white">
  <div className="relative"><div className="absolute -inset-20 rounded-full bg-amber-400/10 blur-3xl"/><div className="relative"><span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[.24em] text-amber-400"><MapPin size={14}/> LOST ON THE COURT</span><h1 className="mt-5 text-7xl font-black tracking-[-.08em] sm:text-9xl">404</h1><p className="mt-4 text-lg text-white/45">This page doesn't exist, but your next game can.</p><Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-amber-300"><ArrowLeft size={17}/> Back home</Link></div></div>
 </main>
}
