import React from"react";
import{CalendarDays,Clock3,MapPin}from"lucide-react";
import{RATE,total}from"../lib/booking";
const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);

export default function BookingSummary({court,date,start,duration}){
 return <aside className="h-fit overflow-hidden rounded-[1.8rem] bg-[#10151d] text-white shadow-[0_20px_60px_rgba(8,11,18,.18)] lg:sticky lg:top-24">
  <div className="border-b border-white/10 bg-white/[.025] p-6"><p className="text-[9px] font-black tracking-[.22em] text-amber-400">BOOKING SUMMARY</p><h2 className="mt-3 text-2xl font-black">{court?.name||"Choose a court"}</h2></div>
  <div className="p-6">
   <div className="space-y-5 text-sm">
    <Row icon={CalendarDays} label="DATE" value={date||"—"}/>
    <Row icon={Clock3} label="START" value={start||"—"}/>
    <Row icon={Clock3} label="DURATION" value={duration/60+" hour"+(duration>60?"s":"")}/>
   </div>
   <div className="my-6 h-px bg-white/10"/>
   <div className="flex items-end justify-between gap-4"><span className="text-xs font-bold text-white/40">ESTIMATED TOTAL</span><strong className="text-3xl font-black text-amber-400">{peso(total(duration))}</strong></div>
   <p className="mt-5 text-xs leading-5 text-white/35">Rate: ₱{RATE} per court per hour. Payment is required before confirmation.</p>
  </div>
 </aside>
}

function Row({icon:Icon,label,value}){return <div className="flex items-start gap-3"><Icon size={16} className="mt-0.5 text-amber-400"/><div><span className="block text-[9px] font-black tracking-[.16em] text-white/30">{label}</span><b className="mt-1 block">{value}</b></div></div>}
