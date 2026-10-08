import React,{useEffect,useState}from"react";
import{ArrowRight,Clock3,MapPin,Sparkles}from"lucide-react";
import{Link}from"react-router-dom";
import CourtGrid from"../components/CourtGrid";
import{supabase}from"../lib/supabase";

export default function Courts(){
 const[courts,setCourts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{
  let alive=true;
  (async()=>{
   if(!supabase){setError("Supabase is not configured. Add the environment variables from .env.example.");setLoading(false);return}
   const{data,error}=await supabase.from("courts").select("id,name,description,image_url,features,is_active,display_order").eq("is_active",true).order("display_order",{ascending:true});
   if(!alive)return;
   if(error)setError(error.message);else setCourts(data||[]);
   setLoading(false);
  })();
  return()=>{alive=false}
 },[]);
 return <main>
  <section className="relative overflow-hidden bg-[#10151d] px-5 py-16 text-white sm:px-6 sm:py-24">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,166,35,.22),transparent_28%),linear-gradient(130deg,#10151d,#18232b)]"/>
   <div className="relative mx-auto max-w-7xl">
    <div className="max-w-3xl">
     <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[.24em] text-amber-400"><Sparkles size={14}/> THE LINEUP</span>
     <h1 className="mt-5 text-5xl font-black tracking-[-.055em] sm:text-7xl">Find your<br/><span className="text-amber-400">court.</span></h1>
     <p className="mt-6 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">Five starting courts, built for serious rallies and easy sessions. Pick your surface, check the time, and get on court.</p>
    </div>
    <div className="mt-10 flex flex-wrap gap-3 text-xs font-bold text-white/60"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"><MapPin size={14}/> Cebu, Philippines</span><span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"><Clock3 size={14}/> 4 PM — 3 AM daily</span><span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-300">₱450 / hour</span></div>
   </div>
  </section>
  <section className="gh-section bg-[#f4f0e8]">
   <div className="mx-auto max-w-7xl px-5 sm:px-6">
    <div className="mb-9 flex items-end justify-between gap-5"><div><span className="gh-eyebrow">COURT DIRECTORY</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Choose your court</h2></div><Link to="/availability" className="hidden items-center gap-2 text-sm font-black text-amber-800 sm:inline-flex">View availability <ArrowRight size={16}/></Link></div>
    <CourtGrid courts={courts} loading={loading} error={error}/>
   </div>
  </section>
 </main>
}
