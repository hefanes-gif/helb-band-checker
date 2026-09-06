"use client";
import { useState } from "react";
import Link from "next/link";
const bands = [
 { max: 23000, name: "BAND 1", sch: 70, loan: 25, family: 5, color: "bg-green-600" },
 { max: 60000, name: "BAND 2", sch: 60, loan: 30, family: 10, color: "bg-blue-600" },
 { max: 120000, name: "BAND 3", sch: 50, loan: 30, family: 20, color: "bg-yellow-600" },
 { max: 300000, name: "BAND 4", sch: 40, loan: 30, family: 30, color: "bg-orange-600" },
 { max: 9999999, name: "BAND 5", sch: 30, loan: 30, family: 40, color: "bg-red-600" },
];
export default function Home(){
 const [income,setIncome]=useState("");
 const [band,setBand]=useState<any>(null);
 const check=()=>{ const v=Number(income); if(!v)return; const b=bands.find(x=>v<=x.max); setBand({...b,income:v}); };
 return(
  <div className="max-w-4xl mx-auto p-4">
   <div className="bg-white rounded-2xl shadow-lg p-6 border">
    <h1 className="text-3xl font-black text-[#0a3d62]">HEF Portal - Band Checker</h1>
    <p className="text-gray-500 text-sm mt-1">Check your band in 5 seconds - Official MTI Model</p>
    <div className="flex gap-2 mt-4">
     <Link href="/register" className="bg-[#0a3d62] text-white px-5 py-2 rounded-lg font-bold text-sm">Register & Save Band</Link>
     <Link href="/calculator" className="bg-orange-500 text-white px-5 py-2 rounded-lg font-bold text-sm">Calculator</Link>
    </div>
    <div className="mt-6 bg-slate-50 p-4 rounded-xl border">
     <label className="font-bold text-sm">Monthly Household Income (KSH)</label>
     <div className="flex gap-2 mt-2"><input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 45000" className="flex-1 p-3 border rounded-lg"/><button onClick={check} className="bg-[#0a3d62] text-white px-8 rounded-lg font-black">CHECK</button></div>
    </div>
    {band && (<div className="mt-6 p-5 rounded-xl text-white bg-gradient-to-br from-[#0a3d62] to-[#1e6fa8]"><div className="text-xs opacity-80">YOU ARE IN</div><div className="text-4xl font-black mt-1">{band.name}</div><div className="grid grid-cols-3 gap-3 mt-4"><div className="bg-white/20 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.sch}%</div><div className="text-xs">Scholarship</div></div><div className="bg-white/20 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.loan}%</div><div className="text-xs">Loan</div></div><div className="bg-white/20 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.family}%</div><div className="text-xs">Family</div></div></div><Link href="/register" className="mt-4 block text-center bg-white text-[#0a3d62] font-bold py-2 rounded-lg text-sm">Save My Band Result →</Link></div>)}
   </div>
  </div>
 );
}