"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const bands=[ {max:23000,name:"BAND 1",sch:70,loan:25,family:5,desc:"Extremely Needy",color:"from-green-600 to-emerald-600"}, {max:60000,name:"BAND 2",sch:60,loan:30,family:10,desc:"Very Needy",color:"from-blue-600 to-indigo-600"}, {max:120000,name:"BAND 3",sch:50,loan:30,family:20,desc:"Needy",color:"from-yellow-500 to-orange-500"}, {max:300000,name:"BAND 4",sch:40,loan:30,family:30,desc:"Less Needy",color:"from-orange-500 to-red-500"}, {max:9999999,name:"BAND 5",sch:30,loan:30,family:40,desc:"Able",color:"from-red-600 to-rose-700"} ];

function Checker(){
 const searchParams=useSearchParams();
 const [income,setIncome]=useState(""); const [band,setBand]=useState<any>(null);
 const [refBand,setRefBand]=useState("");
 useEffect(()=>{ const ref=searchParams.get("ref"); if(ref){ setRefBand(ref); } },[searchParams]);
 const check=()=>{ const v=Number(income); if(!v) return; const b=bands.find(x=>v<=x.max); setBand({...b,income:v}); };
 const shareWhatsapp=()=>{ if(!band) return; const text=`🔥 I am ${band.name}! ${band.desc} - I will get ${band.sch}% Scholarship! Check your HEF Band now: https://helb-band-checker.vercel.app/?ref=${band.name.toLowerCase().replace(' ','')}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank"); };
 return(
  <div className="grid md:grid-cols-2 gap-6">
   <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 border">
    {refBand && <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold p-2 rounded-lg mb-3">👋 Your friend is {refBand.toUpperCase()} — check yours!</div>}
    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full border border-green-200">● LIVE MTI MODEL 2026</div>
    <h1 className="text-[36px] font-black text-[#0a3d62] leading-[0.9] mt-4">Know Your<br/>Funding Band<br/><span className="text-[#f5a623]">In 5 Seconds</span></h1>
    <div className="mt-6 bg-[#f8fafc] p-4 rounded-2xl border"><label className="text-[11px] font-black tracking-widest text-[#0a3d62]">MONTHLY INCOME (KSH)</label><div className="flex gap-2 mt-2"><input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 45000" className="flex-1 p-4 border-2 border-[#0a3d62]/10 rounded-xl font-bold text-lg outline-none"/><button onClick={check} className="bg-[#0a3d62] text-white px-8 rounded-xl font-black">CHECK</button></div></div>
    {band && (<div className={`mt-6 p-6 rounded-2xl text-white bg-gradient-to-br ${band.color} shadow-xl`}><div className="text-[11px] opacity-80 tracking-widest">{band.desc.toUpperCase()}</div><div className="text-4xl font-black mt-1">{band.name}</div><div className="grid grid-cols-3 gap-3 mt-5"><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.sch}%</div><div className="text-[10px]">SCHOLARSHIP</div></div><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.loan}%</div><div className="text-[10px]">LOAN</div></div><div className="bg-white/20 backdrop-blur p-3 rounded-xl text-center"><div className="text-2xl font-black">{band.family}%</div><div className="text-[10px]">FAMILY</div></div></div><button onClick={shareWhatsapp} className="mt-4 w-full bg-[#25D366] text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">📱 SHARE ON WHATSAPP</button><Link href="/register" className="mt-2 block text-center bg-white text-black font-black py-3 rounded-xl text-sm">SAVE & CREATE ACCOUNT →</Link></div>)}
   </div>
   <div className="bg-[#0a3d62] rounded-[24px] p-6 text-white h-fit"><h3 className="font-black">All 5 Bands</h3><div className="mt-4 space-y-2">{bands.map(b=><div key={b.name} className="flex justify-between items-center bg-white/10 p-3 rounded-xl text-sm"><span className="font-bold">{b.name}</span><span className="text-xs opacity-70">{b.desc}</span></div>)}</div></div>
  </div>
 );
}

export default function Home(){
 return (
  <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
   <Checker/>
  </Suspense>
 );
}