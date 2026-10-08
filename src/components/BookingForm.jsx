import React,{useState}from"react";
import Button from"./Button";
import BookingSummary from"./BookingSummary";
import{createBookingHold}from"../lib/booking";
import{supabase}from"../lib/supabase";
import{LockKeyhole,ShieldCheck,ArrowUpRight}from"lucide-react";

export default function BookingForm({court,date,start,duration}){
 const[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[hold,setHold]=useState(null);
 const submit=async e=>{
  e.preventDefault();setMessage("");
  if(!start){setMessage("Choose a start time first.");return}
  setBusy(true);
  try{
   const booking=await createBookingHold({courtId:court.id,date,start,duration});
   setHold(booking);
   setMessage("Your 15-minute payment hold is active. Continue to PayMongo to confirm the reservation.");
  }catch(err){setMessage(err.message||"Unable to create the booking hold.")}
  finally{setBusy(false)}
 };
 const pay=async()=>{
  if(!supabase||!hold?.id)return;
  setBusy(true);setMessage("");
  const{data,error}=await supabase.functions.invoke("create-paymongo-checkout",{body:{booking_id:hold.id}});
  if(error){setMessage(error.message||"Unable to start payment.");setBusy(false);return}
  if(data?.checkout_url){window.location.assign(data.checkout_url);return}
  setMessage(data?.error||"Unable to start payment.");
  setBusy(false);
 };
 return <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
  <form onSubmit={submit} className="gh-card rounded-[1.8rem] p-6 sm:p-7">
   <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#10151d] text-amber-400"><LockKeyhole size={18}/></span><div><h2 className="text-2xl font-black">Secure your session</h2><p className="mt-1 text-sm leading-6 text-neutral-500">Review the selection below. The server rechecks conflicts before creating your booking hold.</p></div></div>
   <label className="mt-7 flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm"><input type="checkbox" required disabled={!!hold} className="mt-0.5 h-5 w-5 accent-amber-500"/><span>I confirm the selected court, date, time, and duration.</span></label>
   <div className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-800"><ShieldCheck size={17} className="shrink-0"/>Payment is required before the reservation is confirmed.</div>
   {message&&<div role="status" className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">{message}</div>}
   {!hold?<Button type="submit" disabled={busy||!court||!start} className="mt-6 w-full">{busy?"Creating hold…":"Create booking hold"}</Button>:<Button type="button" disabled={busy} onClick={pay} className="mt-6 w-full">{busy?"Opening payment…":"Continue to payment"}<ArrowUpRight size={17} className="ml-2"/></Button>}
  </form>
  <BookingSummary court={court} date={date} start={start} duration={duration}/>
 </div>
}
