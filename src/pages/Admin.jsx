import React,{useCallback,useEffect,useMemo,useState}from"react";
import{BarChart3,CalendarDays,CheckCircle2,Clock3,LockKeyhole,Plus,RefreshCw,Settings2,ShieldCheck,Trash2,Users,XCircle}from"lucide-react";
import{supabase}from"../lib/supabase";

const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(Number(n||0));
const dateLabel=value=>new Date(value).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"});
const timeLabel=value=>new Date(value).toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit"});

export default function Admin(){
 const[tab,setTab]=useState("overview");
 const[data,setData]=useState({bookings:[],payments:[],courts:[],blocks:[],settings:null});
 const[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState("");
 const[rate,setRate]=useState(450),[opening,setOpening]=useState("16:00"),[closing,setClosing]=useState("03:00");
 const[block,setBlock]=useState({court_id:"",start_at:"",end_at:"",reason:""});
 const load=useCallback(async()=>{
  setLoading(true);setError("");
  const [bookings,courts,blocks,settings]=await Promise.all([
   supabase.from("bookings").select("id,booking_reference,user_id,court_id,start_at,end_at,status,total_amount,currency,created_at,courts(name),payments(status,provider)").order("start_at",{ascending:false}),
   supabase.from("courts").select("id,name,description,image_url,features,is_active,display_order").order("display_order"),
   supabase.from("blocked_times").select("id,court_id,start_at,end_at,reason,created_at,courts(name)").order("start_at"),
   supabase.from("booking_settings").select("id,facility_id,hourly_rate,currency,opening_time,closing_time,slot_duration_minutes,hold_duration_minutes").limit(1).single()
  ]);
  const first=[bookings,courts,blocks,settings].find(x=>x.error);
  if(first)setError(first.error.message);
  const s=settings.data||null;
  setData({bookings:bookings.data||[],courts:courts.data||[],blocks:blocks.data||[],settings:s});
  if(s){setRate(s.hourly_rate);setOpening(String(s.opening_time).slice(0,5));setClosing(String(s.closing_time).slice(0,5))}
  setLoading(false);
 },[]);
 useEffect(()=>{load()},[load]);

 const stats=useMemo(()=>{
  const confirmed=data.bookings.filter(x=>x.status==="confirmed");
  return {
   total:data.bookings.length,
   confirmed:confirmed.length,
   pending:data.bookings.filter(x=>x.status==="pending_payment").length,
   cancelled:data.bookings.filter(x=>x.status==="cancelled").length,
   revenue:confirmed.reduce((sum,x)=>sum+Number(x.total_amount||0),0),
   users:new Set(data.bookings.map(x=>x.user_id)).size
  };
 },[data.bookings]);

 const cancel=async id=>{
  if(!window.confirm("Cancel this reservation?"))return;
  setBusy(id);setError("");
  const{error}=await supabase.rpc("admin_cancel_booking",{p_booking_id:id});
  if(error)setError(error.message);else await load();
  setBusy("");
 };

 const toggleCourt=async court=>{
  setBusy(court.id);setError("");
  const{error}=await supabase.from("courts").update({is_active:!court.is_active}).eq("id",court.id);
  if(error)setError(error.message);else await load();
  setBusy("");
 };

 const saveSettings=async e=>{
  e.preventDefault();setBusy("settings");setError("");
  if(!data.settings){setError("Booking settings record was not found.");setBusy("");return}
  const{error}=await supabase.from("booking_settings").update({hourly_rate:Number(rate),opening_time:opening,closing_time:closing,updated_at:new Date().toISOString()}).eq("id",data.settings.id);
  if(error)setError(error.message);else await load();
  setBusy("");
 };

 const addBlock=async e=>{
  e.preventDefault();setBusy("block");setError("");
  if(!block.start_at||!block.end_at){setError("Choose a start and end time.");setBusy("");return}
  const{error}=await supabase.from("blocked_times").insert({court_id:block.court_id||null,start_at:new Date(block.start_at).toISOString(),end_at:new Date(block.end_at).toISOString(),reason:block.reason||"Admin block"});
  if(error)setError(error.message);else{setBlock({court_id:"",start_at:"",end_at:"",reason:""});await load()}
  setBusy("");
 };

 const deleteBlock=async id=>{
  if(!window.confirm("Remove this blocked period?"))return;
  setBusy(id);setError("");
  const{error}=await supabase.from("blocked_times").delete().eq("id",id);
  if(error)setError(error.message);else await load();
  setBusy("");
 };

 const tabs=[["overview","Overview",BarChart3],["bookings","Bookings",CalendarDays],["courts","Courts",ShieldCheck],["schedule","Schedule",Clock3],["settings","Settings",Settings2]];
 return <main className="min-h-[80vh] bg-[#f4f0e8] px-5 py-10 sm:px-6 sm:py-14">
  <div className="mx-auto max-w-7xl">
   <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
    <div><span className="gh-eyebrow">GOLDEN HOUR COURTS / ADMIN</span><h1 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-6xl">Control room.</h1><p className="mt-4 max-w-2xl text-neutral-500">Manage reservations, courts, operating hours, pricing, and blocked periods from one secure dashboard.</p></div>
    <button onClick={load} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-black transition hover:-translate-y-0.5"><RefreshCw size={16}/> Refresh</button>
   </div>
   {error&&<div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
   <div className="mt-8 flex gap-2 overflow-x-auto pb-1">{tabs.map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={tab===id?"inline-flex shrink-0 items-center gap-2 rounded-full bg-[#10151d] px-4 py-2.5 text-xs font-black text-white":"inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-neutral-500 hover:text-neutral-900"}><Icon size={15}/>{label}</button>)}</div>
   {loading?<div className="mt-8 rounded-[1.7rem] bg-white p-10 text-neutral-500">Loading control room…</div>:<div className="mt-8">
    {tab==="overview"&&<Overview stats={stats} bookings={data.bookings}/>}
    {tab==="bookings"&&<Bookings bookings={data.bookings} cancel={cancel} busy={busy}/>}
    {tab==="courts"&&<Courts courts={data.courts} toggle={toggleCourt} busy={busy}/>}
    {tab==="schedule"&&<Schedule blocks={data.blocks} courts={data.courts} block={block} setBlock={setBlock} addBlock={addBlock} deleteBlock={deleteBlock} busy={busy}/>}
    {tab==="settings"&&<Settings rate={rate} setRate={setRate} opening={opening} setOpening={setOpening} closing={closing} setClosing={setClosing} save={saveSettings} busy={busy}/>}
   </div>}
  </div>
 </main>
}

function Overview({stats,bookings}){
 const recent=bookings.slice(0,5);
 return <div className="space-y-6">
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
   <Stat label="Bookings" value={stats.total} icon={CalendarDays}/><Stat label="Confirmed" value={stats.confirmed} icon={CheckCircle2}/><Stat label="Pending" value={stats.pending} icon={Clock3}/><Stat label="Cancelled" value={stats.cancelled} icon={XCircle}/><Stat label="Demo revenue" value={peso(stats.revenue)} icon={BarChart3}/>
  </div>
  <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
   <section className="rounded-[1.7rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Recent reservations</h2><div className="mt-5 space-y-3">{recent.length?recent.map(r=><div key={r.id} className="flex flex-col justify-between gap-2 rounded-2xl border border-black/[.06] p-4 sm:flex-row sm:items-center"><div><b>{r.courts?.name||"Court"}</b><p className="mt-1 text-xs text-neutral-400">{r.booking_reference} · {dateLabel(r.start_at)} · {timeLabel(r.start_at)}</p></div><div className="text-right"><b>{peso(r.total_amount)}</b><p className="mt-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">{r.status.replace("_"," ")}</p></div></div>):<p className="text-sm text-neutral-500">No reservations yet.</p>}</div></section>
   <section className="rounded-[1.7rem] bg-[#10151d] p-6 text-white"><Users className="text-amber-400"/><p className="mt-5 text-[10px] font-black tracking-[.2em] text-white/40">UNIQUE BOOKERS</p><p className="mt-2 text-5xl font-black">{stats.users}</p><p className="mt-3 text-sm leading-6 text-white/45">Distinct authenticated users who have created bookings.</p></section>
  </div>
 </div>
}

function Stat({label,value,icon:Icon}){return <div className="rounded-[1.5rem] border border-black/[.06] bg-white p-5 shadow-sm"><Icon size={18} className="text-amber-600"/><p className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-neutral-400">{label}</p><p className="mt-2 truncate text-3xl font-black">{value}</p></div>}

function Bookings({bookings,cancel,busy}){
 return <section className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm"><div className="border-b border-black/[.06] p-6"><h2 className="text-xl font-black">All reservations</h2><p className="mt-1 text-sm text-neutral-500">Admin view of every booking and payment state.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-stone-50 text-[10px] font-black uppercase tracking-wider text-neutral-400"><tr><th className="px-5 py-4">Reference</th><th className="px-5 py-4">Court</th><th className="px-5 py-4">Session</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead><tbody>{bookings.map(r=><tr key={r.id} className="border-t border-black/[.05]"><td className="px-5 py-4 font-black">{r.booking_reference}</td><td className="px-5 py-4">{r.courts?.name||"Court"}</td><td className="px-5 py-4">{dateLabel(r.start_at)}<span className="block text-xs text-neutral-400">{timeLabel(r.start_at)} — {timeLabel(r.end_at)}</span></td><td className="px-5 py-4 font-bold">{peso(r.total_amount)}</td><td className="px-5 py-4">{r.payments?.[0]?.status||"—"}</td><td className="px-5 py-4"><span className="rounded-full bg-stone-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider">{r.status.replace("_"," ")}</span></td><td className="px-5 py-4">{!["cancelled","expired"].includes(r.status)&&<button disabled={busy===r.id} onClick={()=>cancel(r.id)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50">{busy===r.id?"…":"Cancel"}</button>}</td></tr>)}</tbody></table>{!bookings.length&&<p className="p-8 text-center text-sm text-neutral-500">No reservations yet.</p>}</div></section>
}

function Courts({courts,toggle,busy}){
 return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{courts.map(c=><article key={c.id} className="rounded-[1.7rem] bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><span className={c.is_active?"rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700":"rounded-full bg-stone-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-stone-500"}>{c.is_active?"active":"hidden"}</span><h2 className="mt-4 text-2xl font-black">{c.name}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{c.description||"Premium pickleball court."}</p></div><ShieldCheck className="text-amber-600"/></div><div className="mt-6 flex flex-wrap gap-2">{(c.features||[]).map(f=><span key={f} className="rounded-full bg-stone-100 px-3 py-1.5 text-[10px] font-bold">{f}</span>)}</div><button disabled={busy===c.id} onClick={()=>toggle(c)} className="mt-6 w-full rounded-full bg-[#10151d] py-3 text-sm font-black text-white disabled:opacity-50">{busy===c.id?"Saving…":c.is_active?"Deactivate court":"Activate court"}</button></article>)}</div>
}

function Schedule({blocks,courts,block,setBlock,addBlock,deleteBlock,busy}){
 return <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
  <form onSubmit={addBlock} className="rounded-[1.7rem] bg-[#10151d] p-6 text-white"><span className="text-[10px] font-black tracking-[.2em] text-amber-400">BLOCK A PERIOD</span><h2 className="mt-3 text-2xl font-black">Close a court.</h2><p className="mt-2 text-sm leading-6 text-white/45">Use this for maintenance, private events, or temporary closures.</p><label className="mt-6 block text-xs font-black text-white/60">Court<select value={block.court_id} onChange={e=>setBlock({...block,court_id:e.target.value})} className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-neutral-900"><option value="">All courts</option>{courts.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label className="mt-4 block text-xs font-black text-white/60">Start<input required type="datetime-local" value={block.start_at} onChange={e=>setBlock({...block,start_at:e.target.value})} className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-neutral-900"/></label><label className="mt-4 block text-xs font-black text-white/60">End<input required type="datetime-local" value={block.end_at} onChange={e=>setBlock({...block,end_at:e.target.value})} className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-neutral-900"/></label><label className="mt-4 block text-xs font-black text-white/60">Reason<input value={block.reason} onChange={e=>setBlock({...block,reason:e.target.value})} placeholder="Maintenance" className="mt-2 min-h-11 w-full rounded-xl bg-white px-3 text-neutral-900"/></label><button disabled={busy==="block"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-3 text-sm font-black text-neutral-950 disabled:opacity-50">{busy==="block"?"Saving…":<><Plus size={16}/> Add block</>}</button></form>
  <section className="rounded-[1.7rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Blocked periods</h2><div className="mt-5 space-y-3">{blocks.length?blocks.map(b=><div key={b.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-black/[.06] p-4 sm:flex-row sm:items-center"><div><b>{b.courts?.name||"All courts"}</b><p className="mt-1 text-xs text-neutral-400">{dateLabel(b.start_at)} · {timeLabel(b.start_at)} — {timeLabel(b.end_at)}</p><p className="mt-1 text-xs text-neutral-500">{b.reason||"No reason provided"}</p></div><button disabled={busy===b.id} onClick={()=>deleteBlock(b.id)} className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"><Trash2 size={14}/>{busy===b.id?"…":"Remove"}</button></div>):<p className="text-sm text-neutral-500">No blocked periods.</p>}</div></section>
 </div>
}

function Settings({rate,setRate,opening,setOpening,closing,setClosing,save,busy}){
 return <form onSubmit={save} className="max-w-2xl rounded-[1.7rem] bg-white p-6 shadow-sm"><span className="gh-eyebrow">FACILITY SETTINGS</span><h2 className="mt-4 text-2xl font-black">Booking rules.</h2><p className="mt-2 text-sm text-neutral-500">These values drive the customer-facing booking experience.</p><div className="mt-7 grid gap-5 sm:grid-cols-3"><label className="text-sm font-black">Hourly rate<input type="number" min="0" step="50" value={rate} onChange={e=>setRate(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 px-3"/></label><label className="text-sm font-black">Opening<input type="time" value={opening} onChange={e=>setOpening(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 px-3"/></label><label className="text-sm font-black">Closing<input type="time" value={closing} onChange={e=>setClosing(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 px-3"/></label></div><div className="mt-7 rounded-2xl bg-stone-50 p-4 text-xs leading-6 text-neutral-500">Current project defaults: ₱450 per court/hour, 4 PM–3 AM, 60-minute slots, 15-minute payment hold.</div><button disabled={busy==="settings"} className="mt-6 rounded-full bg-[#10151d] px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy==="settings"?"Saving…":"Save booking rules"}</button></form>
}
