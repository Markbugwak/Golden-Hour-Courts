import React,{useState}from"react";
import Button from"./Button";
import BookingSummary from"./BookingSummary";
import{createBookingHold}from"../lib/booking";
import{useNavigate}from"react-router-dom";
import{LockKeyhole,ShieldCheck}from"lucide-react";

export default function BookingForm({court,date,start,duration}){
 const[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const nav=useNavigate();
 const submit=async e=>{
  e.preventDefault();setMessage("");
  if(!start){setMessage("Choose a start time first.");return}
  setBusy(true);
  try{const booking=await createBookingHold({courtId:court.id,date,start,duration});setMessage("Booking hold created: "+booking.booking_reference+". Complete payment before confirmation.");setTimeout(()=>nav("/reservations"),700)}
  catch(err){setMessage(err.message||"Unable to create the booking hold.")}
  finally{setBusy(false)}
 };
 return <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
  <form onSubmit={submit} className="gh-card rounded-[1.8rem] p-6 sm:p-7">
   <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#10151d] text-amber-400"><LockKeyhole size={18}/></span><div><h2 className="text-2xl font-black">Secure your session</h2><p className="mt-1 text-sm leading-6 text-neutral-500">Review the selection below. The server rechecks conflicts before creating your booking hold.</p></div></div>
   <label className="mt-7 flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm"><input type="checkbox" required className="mt-0.5 h-5 w-5 accent-amber-500"/><span>I confirm the selected court, date, time, and duration.</span></label>
   <div className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-800"><ShieldCheck size={17} className="shrink-0"/>Payment is required before the reservation is confirmed.</div>
   {message&&<div role="status" className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">{message}</div>}
   <Button type="submit" disabled={busy||!court||!start} className="mt-6 w-full">{busy?"Creating hold…":"Create booking hold"}</Button>
  </form>
  <BookingSummary court={court} date={date} start={start} duration={duration}/>
 </div>
}
