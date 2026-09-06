"use client";
import { useState } from "react";
import Link from "next/link";

const bands=[ {max:23000,name:"BAND 1",sch:70,loan:25,family:5,desc:"Extremely Needy",color:"bg-green-600"}, {max:60000,name:"BAND 2",sch:60,loan:30,family:10,desc:"Very Needy",color:"bg-blue-600"}, {max:120000,name:"BAND 3",sch:50,loan:30,family:20,desc:"Needy",color:"bg-amber-500"}, {max:300000,name:"BAND 4",sch:40,loan:30,family:30,desc:"Less Needy",color:"bg-orange-600"}, {max:9999999,name:"BAND 5",sch:30,loan:30,family:40,desc:"Able",color:"bg-red-600"} ];

export default function Calc(){
 const [income,setIncome]=useState(""); const [res,setRes]=useState<any>(null);
 const calc=()=>{ const v=Number(income); if(!v) return; const b=bands.find(x=>v<=x.max); setRes({...b,v}); };
 return (
  <div className="max-w-2xl mx-auto">
   <div className="bg-white rounded-[28px] border shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 md:p-10">
    <div className="w-12 h-12 bg-[#0a3d62] rounded-2xl flex items-center justify-center text-white text-xl">🧮</div>
    <h1 className="text-3xl font-black mt-5 tracking-tighter">Funding Calculator</h1><p className="text-sm text-gray-500 mt-2">Enter monthly household income to know your band instantly.</p>
    <div className="mt-8 flex gap-3"><input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 35000" className="flex-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-lg outline-none focus:border-[#0a3d62]"/><button onClick={calc} className="bg-[#0a3d62] text-white px-8 rounded-2xl font-black hover:bg-black">CHECK</button></div>
    {res && (
     <div className="mt-8">
      <div className={`h-1 w-full ${res.color} rounded-full`}></div>
      <div className="mt-5 flex justify-between items-end"><div><div className="text-[11px] font-black tracking-widest text-gray-400">{res.desc.toUpperCase()}</div><div className="text-5xl font-black mt-1">{res.name}</div></div><div className="text-right"><div className="text-xs text-gray-500">Income</div><div className="font-bold">KSH {res.v.toLocaleString()}</div></div></div>
      <div className="grid grid-cols-3 gap-3 mt-6"><div className="bg-[#0a3d62] text-white p-4 rounded-2xl text-center"><div className="text-2xl font-black">{res.sch}%</div><div className="text-[10px] opacity-70">SCHOLARSHIP</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{res.loan}%</div><div className="text-[10px]">LOAN</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{res.family}%</div><div className="text-[10px]">FAMILY</div></div></div>
      <Link href="/register" className="mt-6 block text-center bg-black text-white py-4 rounded-2xl font-bold text-sm">Save Result & Create Account →</Link>
     </div>
    )}
   </div>
  </div>
 );
}