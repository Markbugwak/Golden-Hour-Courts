import React from "react";

export default function Button({as:Component="button",variant="primary",className="",children,...props}){
  const styles=variant==="secondary"?"border border-white/15 bg-white/5 text-white hover:bg-white/10":"bg-amber-400 text-neutral-950 hover:bg-amber-300";
  return <Component className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`} {...props}>{children}</Component>;
}