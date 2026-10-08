import React from"react";
import CourtCard from"./CourtCard";

export default function CourtGrid({courts,loading,error}){
 if(loading)return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5].map(n=><div key={n} className="overflow-hidden rounded-[1.7rem] border border-black/5 bg-white"><div className="aspect-[4/3] animate-pulse bg-stone-200"/><div className="space-y-3 p-7"><div className="h-6 w-2/3 animate-pulse rounded bg-stone-200"/><div className="h-4 w-full animate-pulse rounded bg-stone-200"/><div className="h-4 w-1/2 animate-pulse rounded bg-stone-200"/></div></div>)}</div>;
 if(error)return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>;
 if(!courts.length)return <div className="rounded-2xl bg-white p-10 text-center text-neutral-500 shadow-sm">No active courts are available.</div>;
 return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courts.map(c=><CourtCard key={c.id} court={c}/>)}</div>
}
