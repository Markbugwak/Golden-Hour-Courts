import React from"react";
import{Clock3,MapPin,Phone}from"lucide-react";
import{Link}from"react-router-dom";
import{Facebook,Instagram}from"lucide-react";

export default function Footer(){
  return <footer className="relative overflow-hidden bg-[#07090d] px-5 py-16 text-white sm:px-6">
    <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-400/[.08] blur-3xl"/>
    <div className="relative mx-auto max-w-7xl">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_.7fr_.7fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/logo/golden-hour-courts.svg" alt="" className="h-10 w-10"/>
            <div className="font-black tracking-[.12em]">GOLDEN HOUR <span className="text-amber-400">COURTS</span></div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/45">Premium pickleball sessions in Cebu, designed around easy booking, late-night play, and more time on court.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-white/55">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2"><MapPin size={13}/> Cebu, Philippines</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2"><Clock3 size={13}/> 4 PM — 3 AM</span>
          </div>
        </div>
        <div><b className="text-sm">Explore</b><div className="mt-5 grid gap-3 text-sm text-white/45"><Link to="/courts" className="transition hover:text-white">Courts</Link><Link to="/availability" className="transition hover:text-white">Availability</Link><Link to="/reservations" className="transition hover:text-white">My Reservations</Link></div></div>
        <div><b className="text-sm">Contact</b><div className="mt-5 flex items-center gap-3"><a href="https://www.facebook.com/markanthony.blanco.5811" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.03] text-white/55 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"><Facebook size={18}/></a><a href="https://www.instagram.com/Mark.crtfdlb" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.03] text-white/55 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"><Instagram size={18}/></a><a href="tel:09932034185" aria-label="Call 0993 203 4185" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.03] text-white/55 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"><Phone size={18}/></a></div><a href="tel:09932034185" className="mt-4 block text-sm text-white/45 transition hover:text-white">0993 203 4185</a><div className="mt-5 grid gap-3 text-sm text-white/45"><span>₱450 / court / hour</span><span>5+ courts</span><span>Asia/Manila timezone</span></div></div>
      </div>
      <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Golden Hour Courts</span><span>Built for the rally.</span></div>
    </div>
  </footer>
}
