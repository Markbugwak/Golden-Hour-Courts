import React,{useEffect,useMemo,useState}from"react";
import{useSearchParams}from"react-router-dom";
import{CalendarDays,Clock3,Info,MapPin,Sparkles}from"lucide-react";
import TimeSlotGrid from"../components/TimeSlotGrid";
import BookingForm from"../components/BookingForm";
import{slots as baseSlots}from"../lib/booking";
import{supabase}from"../lib/supabase";

export default function Availability(){
 const[params,setParams]=useSearchParams();
 const[courts,setCourts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const[date,setDate]=useState(new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Manila"}));
 const[courtId,setCourtId]=useState(params.get("court")||""),[duration,setDuration]=useState(60),[selected,setSelected]=useState(""),[taken,setTaken]=useState([]),[loadingSlots,setLoadingSlots]=useState(false);

 useEffect(()=>{
  if(!supabase){setError("Supabase is not configured.");setLoading(false);return}
  supabase.from("courts").select("id,name,description,image_url,features,is_active,display_order").eq("is_active",true).order("display_order").then(({data,error})=>{
   if(error)setError(error.message);else{setCourts(data||[]);if(!courtId&&data?.[0])setCourtId(data[0].id)}
   setLoading(false)
  })
 },[]);

 const court=useMemo(()=>courts.find(c=>c.id===courtId),[courts,courtId]);

 useEffect(()=>{if(courtId)setParams(p=>{p.set("court",courtId);return p},{replace:true})},[courtId,setParams]);

 useEffect(()=>{
  setSelected("");
  if(!supabase||!courtId||!date)return;
  let alive=true;setLoadingSlots(true);setError("");
  (async()=>{
   const start=new Date(date+"T16:00:00+08:00").toISOString();
   const end=new Date(new Date(date+"T03:00:00+08:00").getTime()+86400000).toISOString();
   const{data,error}=await supabase.rpc("get_court_occupied_ranges",{p_court_id:courtId,p_window_start:start,p_window_end:end});
   if(!alive)return;
   if(error)setError(error.message);
   setTaken((data||[]).map(x=>[x.start_at,x.end_at]));
   setLoadingSlots(false);
  })();
  return()=>{alive=false}
 },[courtId,date]);

 const display=baseSlots().map(value=>{
  const[h]=value.split(":").map(Number);
  const start=new Date(date+"T"+String(h).padStart(2,"0")+":00:00+08:00");
  const end=new Date(start.getTime()+duration*60000);
  const closing=new Date(date+"T03:00:00+08:00");closing.setDate(closing.getDate()+1);
  const outside=end>closing;
  const overlap=taken.some(([a,b])=>new Date(a)<end&&new Date(b)>start);
  return{value,label:start.toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit",hour12:true}),taken:outside||overlap}
 });

 if(loading)return <main className="min-h-[60vh] px-5 py-24 text-center text-neutral-500">Loading courts…</main>;
 if(error&&!courts.length)return <main className="mx-auto max-w-7xl px-5 py-20"><div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</div></main>;

 return <main className="bg-[#f4f0e8]">
  <section className="relative overflow-hidden bg-[#10151d] px-5 py-14 text-white sm:px-6 sm:py-20">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,166,35,.2),transparent_28%)]"/>
   <div className="relative mx-auto max-w-7xl">
    <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[.24em] text-amber-400"><Sparkles size={14}/> LIVE AVAILABILITY</span>
    <h1 className="mt-5 text-5xl font-black tracking-[-.055em] sm:text-7xl">Reserve<br/><span className="text-amber-400">your session.</span></h1>
    <p className="mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">Pick a court, date, duration, and open start time. Availability is checked against the booking database before your hold is created.</p>
   </div>
  </section>

  <section className="gh-section">
   <div className="mx-auto max-w-7xl px-5 sm:px-6">
    {error&&<div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
     <div className="gh-card rounded-[1.8rem] p-5 sm:p-7">
      <div className="grid gap-4 md:grid-cols-3">
       <Field label="Court"><select value={courtId} onChange={e=>setCourtId(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 font-semibold shadow-sm"><option value="">Choose court</option>{courts.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></Field>
       <Field label="Date"><input type="date" value={date} min={new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Manila"})} onChange={e=>setDate(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 font-semibold shadow-sm"/></Field>
       <Field label="Duration"><select value={duration} onChange={e=>setDuration(Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 font-semibold shadow-sm"><option value="60">1 hour</option><option value="120">2 hours</option></select></Field>
      </div>
      <div className="my-8 h-px bg-stone-100"/>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       <div><div className="flex items-center gap-2"><CalendarDays size={18} className="text-amber-600"/><h2 className="text-xl font-black">Choose a start time</h2></div><p className="mt-1 text-sm text-neutral-400">Times shown in Asia/Manila.</p></div>
       <div className="flex gap-2 text-[10px] font-black tracking-wider"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">OPEN</span><span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-400">TAKEN</span></div>
      </div>
      <TimeSlotGrid slots={display} selected={selected} onSelect={setSelected} loading={loadingSlots}/>
     </div>
     <aside className="h-fit rounded-[1.8rem] bg-[#10151d] p-6 text-white shadow-xl lg:sticky lg:top-24">
      <span className="text-[9px] font-black tracking-[.22em] text-amber-400">SESSION DETAILS</span>
      <h2 className="mt-4 text-2xl font-black">{court?.name||"Choose a court"}</h2>
      <div className="mt-6 grid gap-4 text-sm">
       <InfoRow icon={MapPin} label="Location" value="Cebu, Philippines"/>
       <InfoRow icon={Clock3} label="Hours" value="4 PM — 3 AM"/>
       <InfoRow icon={Info} label="Rate" value="₱450 / court / hour"/>
      </div>
      <div className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/40">Payment is required before a booking becomes confirmed. A server-side conflict check protects the selected slot.</div>
     </aside>
    </div>
    {court&&selected&&<div className="mt-6"><BookingForm court={court} date={date} start={selected} duration={duration}/></div>}
   </div>
  </section>
 </main>
}

function Field({label,children}){return <label className="text-sm font-black text-neutral-800">{label}{children}</label>}
function InfoRow({icon:Icon,label,value}){return <div className="flex gap-3"><Icon size={17} className="mt-0.5 text-amber-400"/><div><span className="block text-[10px] font-black tracking-wider text-white/30">{label}</span><b className="mt-1 block">{value}</b></div></div>}
