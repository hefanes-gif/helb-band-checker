"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null);
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: authData})=>{
   if(!authData.user){ router.push("/login"); return; }
   setUser(authData.user);
   const {data: reg} = await supabase.from("registrations").select("*").eq("email", authData.user.email).order("created_at",{ascending:false}).limit(1).maybeSingle();
   setData(reg);
   setLoading(false);
  });
 },[router]);

 const generatePDF = async () => {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF();
  doc.setFillColor(10,61,98); doc.rect(0,0,210,35,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text("HIGHER EDUCATION FINANCING (HEF)",20,15);
  doc.setFontSize(10); doc.text("Official Band Letter - 2026",20,23);
  doc.setTextColor(0,0,0); let y=50;
  doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.text(`BAND: ${data?.band}`,20,y); y+=12;
  doc.setFontSize(12); doc.setFont("helvetica","normal");
  doc.text(`Name: ${data?.full_name}`,20,y); y+=8;
  doc.text(`ID: ${data?.id_number}`,20,y); y+=8;
  doc.text(`Phone: ${data?.phone}`,20,y); y+=8;
  doc.text(`Income: KSH ${Number(data?.income).toLocaleString()}`,20,y); y+=15;
  doc.text(`Scholarship / Loan / Family breakdown per ${data?.band}`,20,y);
  doc.save(`HEF-${data?.band}-${data?.id_number}.pdf`);
  setTimeout(()=>{ window.open(`https://wa.me/?text=${encodeURIComponent("I got "+data?.band+"! Check yours: https://helb-band-checker.vercel.app")}`,"_blank"); },500);
 };

 if(loading) return <div className="p-10 text-center">Loading...</div>;
 if(!data) return <div className="p-10 text-center">No record. <Link href="/" className="underline">Go home</Link></div>;

 return(
  <div className="max-w-4xl mx-auto p-4 space-y-4">
   <div className="bg-white border rounded-2xl p-4 flex justify-between"><div className="font-bold">{data.full_name} - {data.band}</div><Link href="/login" className="text-xs bg-gray-100 px-3 py-1 rounded-full">Logout</Link></div>
   <div className="bg-white border rounded-[24px] p-8 text-center">
    <div className="text-xs tracking-widest text-gray-400 font-black">FUNDING CLASSIFICATION 2026</div>
    <h1 className="text-5xl font-black text-[#0a3d62] mt-3">{data.band}</h1>
    <div className="mt-6 grid grid-cols-3 gap-3"><div className="bg-[#0a3d62] text-white p-4 rounded-2xl"><div className="text-2xl font-black">{data.band=="BAND 1"?70:data.band=="BAND 2"?60:data.band=="BAND 3"?50:data.band=="BAND 4"?40:30}%</div><div className="text-[10px]">SCHOLARSHIP</div></div><div className="bg-gray-50 border p-4 rounded-2xl"><div className="text-2xl font-black">30%</div><div className="text-[10px]">LOAN</div></div><div className="bg-gray-50 border p-4 rounded-2xl"><div className="text-2xl font-black">% </div><div className="text-[10px]">FAMILY</div></div></div>
    <button onClick={generatePDF} className="w-full mt-8 bg-[#0a3d62] text-white py-4 rounded-xl font-black">⬇ Download Official Letter (PDF)</button>
    <p className="text-[11px] text-gray-400 mt-3">Instant download - no payment needed in test mode</p>
   </div>
  </div>
 );
}