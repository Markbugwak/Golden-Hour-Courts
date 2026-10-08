import React,{useEffect,useState}from"react";
import{Navigate,useLocation}from"react-router-dom";
import{supabase}from"../lib/supabase";

export default function AdminRoute({children}){
 const[status,setStatus]=useState("loading");
 const location=useLocation();

 useEffect(()=>{
  let alive=true;
  if(!supabase){setStatus("unauthenticated");return}
  (async()=>{
   const{data:{user}}=await supabase.auth.getUser();
   if(!user){if(alive)setStatus("unauthenticated");return}
   const{data,error}=await supabase.rpc("current_user_is_admin");
   if(alive)setStatus(!error&&data===true?"admin":"forbidden");
  })();
  return()=>{alive=false};
 },[]);

 if(status==="loading")return <div className="grid min-h-[60vh] place-items-center bg-[#f4f0e8] text-sm text-neutral-500">Checking admin access…</div>;
 if(status==="unauthenticated")return <Navigate to="/login" replace state={{from:location.pathname}}/>;
 if(status==="forbidden")return <main className="grid min-h-[60vh] place-items-center bg-[#f4f0e8] px-5"><div className="max-w-md text-center"><span className="gh-eyebrow">ADMIN ACCESS</span><h1 className="mt-4 text-4xl font-black">Access denied.</h1><p className="mt-3 text-neutral-500">Your account does not have the Golden Hour Courts admin role.</p></div></main>;
 return children;
}
