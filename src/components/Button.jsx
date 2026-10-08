import React from"react";

export default function Button({as:Component="button",variant="primary",className="",children,...props}){
  const styles={
    primary:"bg-amber-400 text-neutral-950 shadow-[0_10px_30px_rgba(245,166,35,.18)] hover:-translate-y-0.5 hover:bg-amber-300",
    secondary:"border border-white/15 bg-white/[.06] text-white hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10",
    dark:"bg-[#10151d] text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#1a222d]"
  }[variant]||"";
  return <Component className={"inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50 "+styles+" "+className} {...props}>{children}</Component>
}
