import React from"react";

export default function TimeSlotGrid({slots,selected,onSelect,loading}){
 if(loading)return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="h-[72px] animate-pulse rounded-2xl bg-stone-100"/>)}</div>;
 if(!slots.length)return <p className="rounded-2xl bg-stone-100 p-5 text-sm text-neutral-500">No slots are available for this date.</p>;
 return <div role="radiogroup" aria-label="Available start times" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
  {slots.map(s=><button key={s.value} type="button" role="radio" aria-checked={selected===s.value} disabled={s.taken} onClick={()=>onSelect(s.value)} className={"group min-h-[72px] rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 "+(s.taken?"cursor-not-allowed border-stone-100 bg-stone-100 text-stone-400":"border-stone-200 bg-white hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-[0_10px_30px_rgba(8,11,18,.07)]")+" "+(selected===s.value?"border-amber-500 bg-amber-50 ring-2 ring-amber-200":"")}>
   <span className="flex items-center justify-between gap-2"><b className={selected===s.value?"text-amber-900":""}>{s.label}</b>{selected===s.value&&<span className="h-2 w-2 rounded-full bg-amber-500"/>}</span>
   <span className={"mt-2 block text-[10px] font-black tracking-[.12em] "+(s.taken?"text-stone-400":"text-emerald-600")}>{s.taken?"TAKEN":"OPEN"}</span>
  </button>)}
 </div>
}
