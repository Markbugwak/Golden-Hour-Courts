import React from"react";
import{Link,useSearchParams}from"react-router-dom";
import{CheckCircle2,ArrowRight,PlayCircle}from"lucide-react";
export default function PaymentSuccess(){
 const[params]=useSearchParams();
 return <main className="min-h-[65vh] bg-[#f4f0e8] px-5 py-20 sm:py-28">
  <div className="mx-auto max-w-2xl text-center">
   <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={38}/></div>
   <span className="gh-eyebrow mt-7 inline-flex">DEMO PAYMENT COMPLETE</span>
   <h1 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-6xl">You're booked.</h1>
   <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-neutral-500">This portfolio checkout simulates a successful payment. No real money was charged, and your reservation has been marked confirmed.</p>
   <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900"><PlayCircle size={15}/>{params.get("reference")||"Demo reservation"}</div>
   <Link to="/reservations" className="mt-8 inline-flex items-center rounded-full bg-[#10151d] px-6 py-3 text-sm font-black text-white">View reservation<ArrowRight size={16} className="ml-2"/></Link>
  </div>
 </main>
}
