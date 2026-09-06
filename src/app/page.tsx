"use client";
import Link from "next/link";
export default function Home(){
 return(
  <div className="min-h-screen bg-[#f6f8fb] flex flex-col">
    <header className="bg-white border-b sticky top-0 z-20"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><div className="font-black text-[#0a3d62]">HEF PORTAL</div><Link href="/login" className="bg-[#0a3d62] text-white px-5 py-2 rounded-full text-sm font-bold">Check Band</Link></div></header>
    <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      <div><div className="inline-block bg-[#0a3d62]/10 text-[#0a3d62] text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full">2026 OFFICIAL BAND CHECKER</div><h1 className="text-4xl md:text-5xl font-black text-[#0a3d62] mt-4 leading-[1.1]">Know Your University Funding Band Instantly</h1><p className="text-gray-500 mt-4 text-[15px] leading-relaxed">Enter KCSE details, get Band 1-5 classification based on household income. Download official letter in seconds.</p><div className="mt-8 flex gap-3"><Link href="/register" className="bg-[#0a3d62] text-white px-8 py-3.5 rounded-xl font-bold text-sm">Check My Band →</Link><div className="text-xs text-gray-400 self-center">Trusted by 12k+ students</div></div></div>
      <div className="bg-white border rounded-[24px] p-6 shadow-sm"><div className="grid grid-cols-2 gap-3">{["BAND 1","BAND 2","BAND 3","BAND 4","BAND 5"].map(b=><div key={b} className="border rounded-2xl p-4"><div className="text-[10px] font-black text-gray-400">{b}</div><div className="font-black text-[#0a3d62] mt-1">{b==="BAND 1"?"70%":b==="BAND 2"?"60%":b==="BAND 3"?"50%":b==="BAND 4"?"40%":"30%"} Scholarship</div></div>)}</div></div>
    </main>
    <footer className="bg-white border-t py-6 text-center text-[11px] text-gray-400">© 2026 Higher Education Financing • helb-band-checker.vercel.app • Till 8629094</footer>
  </div>
 )
}