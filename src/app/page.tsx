"use client";
import { useState } from "react"; import Link from "next/link";
const bands=[ {max:23000,name:"BAND 1",sch:70,loan:25,family:5,desc:"Extremely Needy",color:"from-green-600 to-emerald-600"}, {max:60000,name:"BAND 2",sch:60,loan:30,family:10,desc:"Very Needy",color:"from-blue-600 to-indigo-600"}, {max:120000,name:"BAND 3",sch:50,loan:30,family:20,desc:"Needy",color:"from-yellow-500 to-orange-500"}, {max:300000,name:"BAND 4",sch:40,loan:30,family:30,desc:"Less Needy",color:"from-orange-500 to-red-500"}, {max:9999999,name:"BAND 5",sch:30,loan:30,family:40,desc:"Able",color:"from-red-600 to-rose-700"} ];
export default function Home(){
 const [income,setIncome]=useState(""); const [band,setBand]=useState<any>(null);
 const check=()=>{ const v=Number(income); if(!v) return; const b=bands.find(x=>v<=x.max); setBand({...b,income:v}); };
 return(
  <div className="grid md:grid-cols-2 gap-6">
   <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 border">
    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full border border-green-200">● LIVE MTI MODEL 2026</div>
    <h1 className="text-[36px] font-black text-[#0a3d62] leading-[0.9] mt-4">Know Your<br/>Funding Band<br/><span className="text-[#f5a623]">In 5 Seconds</span></h1>
    <p className="text-sm text-gray-500 mt-3">Enter household income — get Scholarship / Loan / Family split instantly.</p>
    <div className="mt-6 bg-[#f8fafc] p-4 rounded-2xl border"><label className="text-[11px] font-black tracking-widest text-[#0a3d62]">MONTHLY HOUSEHOLD INCOME (KSH)</label><div className="flex gap-2 mt-2"><input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 45000" className="flex-1 p-4 border-2 border-[#0a3d62]/10 rounded-xl font-bold text-lg focus:border-[#0a3d62] outline-none"/><button onClick={check} className="bg-[#0a3d62] text-white px-8 rounded-xl font-black hover:bg-black transition">CHECK</button></div></div>
    {band && (<div className={`mt-6 p-6 rounded-2xl text-white bg-gradient-to-br ${band.color} shadow-xl`}><div className="text-[11px] opacity-80 tracking-widest">RESULT • {band.desc.toUpperCase()}</div><div className="text-4xl font-black mt-1">{band.name}</div><div className="grid grid-cols-3 gap-3 mt-5"><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.sch}%</div><div className="text-[10px]">SCHOLARSHIP</div></div><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.loan}%</div><div className="text-[10px]">LOAN</div></div><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.family}%</div><div className="text-[10px]">FAMILY</div></div></div><Link href="/register" className="mt-4 block text-center bg-white text-black font-black py-3 rounded-xl text-sm">SAVE RESULT & CREATE ACCOUNT →</Link></div>)}
   </div>
   <div className="space-y-4">
    <div className="bg-[#0a3d62] rounded-[24px] p-6 text-white"><h3 className="font-black">All 5 Bands - Official 2026</h3><div className="mt-4 space-y-2">{bands.map(b=><div key={b.name} className="flex justify-between items-center bg-white/10 p-3 rounded-xl text-sm"><span className="font-bold">{b.name}</span><span className="text-xs opacity-70">{b.desc}</span><span className="font-mono text-xs">≤ {b.max.toLocaleString()}</span></div>)}</div></div>
    <div className="bg-white rounded-[24px] p-6 border"><h3 className="font-black text-[#0a3d62]">Why Students Trust Us</h3><ul className="mt-3 text-sm text-gray-600 space-y-2"><li>✓ 100% Free & Accurate MTI model</li><li>✓ Instant results — no waiting</li><li>✓ Data saved securely in Supabase</li></ul></div>
   </div>
  </div>
 );
}