import React,{useCallback,useEffect,useState}from"react";
import{CalendarDays,Clock3,MapPin,Sparkles,XCircle,ArrowUpRight,PlayCircle}from"lucide-react";
import{Link}from"react-router-dom";
import{supabase}from"../lib/supabase";
import{cancelBooking}from"../lib/booking";
const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);

export default function Reservations(){
 const[rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState(""),[paying,setPaying]=useState("");
 const load=useCallback(async()=>{
  setLoading(true);
  const{data,error}=await supabase.from("bookings").select("id,booking_reference,court_id,start_at,end_at,status,total_amount,currency,hold_expires_at,created_at,courts(name),payments(status)").order("start_at",{ascending:false});
  if(error)setError(error.message);else setRows(data||[]);
  setLoading(false)
 },[]);
 useEffect(()=>{load()},[load]);
 const cancel=async id=>{if(!window.confirm("Cancel this booking?"))return;setBusy(id);setError("");try{await cancelBooking(id);await load()}catch(e){setError(e.message||"Unable to cancel booking.")}finally{setBusy("")}};
 const pay=async id=>{
  setPaying(id);setError("");
  const{data,error}=await supabase.functions.invoke("demo-payment",{body:{booking_id:id}});
  if(error||data?.error){setError(error?.message||data?.error||"Unable to complete demo payment.");setPaying("");return}
  await load();
  setPaying("");
 };
 return <main className="bg-[#f4f0e8] px-5 py-14 sm:px-6 sm:py-20">
  <div className="mx-auto max-w-5xl">
   <span className="gh-eyebrow">YOUR SESSIONS</span>
   <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="text-5xl font-black tracking-[-.055em] sm:text-6xl">My reservations.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-500">Everything you've booked, in one place.</p></div><Link to="/availability" className="inline-flex w-fit items-center rounded-full bg-[#10151d] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black">Book another</Link></div>
   <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><PlayCircle size={17} className="shrink-0"/><span><strong>Portfolio demo:</strong> payments are simulated. No real money is charged.</span></div>
   {error&&<div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
   <div className="mt-10 space-y-4">
    {loading?<div className="rounded-[1.7rem] bg-white p-8 shadow-sm">Loading reservations…</div>:!rows.length?<div className="rounded-[1.7rem] border border-black/[.06] bg-white p-10 text-center shadow-sm"><Sparkles className="mx-auto text-amber-500"/><h2 className="mt-4 text-2xl font-black">No sessions yet.</h2><p className="mt-2 text-sm text-neutral-500">Your next rally could start here.</p><Link className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-black" to="/availability">Find a court</Link></div>:rows.map(r=>{const payment=Array.isArray(r.payments)?r.payments[0]:r.payments;return <article key={r.id} className="group rounded-[1.7rem] border border-black/[.06] bg-white p-6 shadow-[0_15px_50px_rgba(8,11,18,.05)] transition hover:shadow-[0_22px_65px_rgba(8,11,18,.09)] sm:p-7">
     <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-black">{r.courts?.name||"Court"}</h2><Status status={r.status}/></div><div className="mt-4 grid gap-2 text-sm text-neutral-500 sm:grid-cols-3"><span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-amber-600"/>{new Date(r.start_at).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}</span><span className="inline-flex items-center gap-2"><Clock3 size={15} className="text-amber-600"/>{new Date(r.start_at).toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit"})}</span><span className="inline-flex items-center gap-2"><MapPin size={15} className="text-amber-600"/>Cebu</span></div><p className="mt-4 text-xs text-neutral-400">{r.booking_reference} · {peso(r.total_amount)}</p></div>
      <div className="flex flex-wrap gap-3 sm:justify-end">{r.status==="pending_payment"&&payment?.status==="pending"&&<button disabled={paying===r.id} onClick={()=>pay(r.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber-400 px-5 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:opacity-50">{paying===r.id?"Confirming…":"Demo pay"}<ArrowUpRight size={16}/></button>}{!["cancelled","expired"].includes(r.status)&&<button disabled={busy===r.id} onClick={()=>cancel(r.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-200 px-5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"><XCircle size={16}/>{busy===r.id?"Cancelling…":"Cancel"}</button>}</div>
     </div>
    </article>})}
   </div>
  </div>
 </main>
}
function Status({status}){const label=status.replace("_"," ");const cls=status==="confirmed"?"bg-emerald-100 text-emerald-700":status==="cancelled"||status==="expired"?"bg-stone-100 text-stone-500":"bg-amber-100 text-amber-800";return <span className={"rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[.12em] "+cls}>{label}</span>}
