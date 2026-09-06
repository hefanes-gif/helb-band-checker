"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null);
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const [showPay,setShowPay]=useState(false);
 const [paying,setPaying]=useState(false);
 const [msg,setMsg]=useState("");
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: a})=>{
   if(!a.user){ router.push("/login"); return; }
   setUser(a.user);
   const {data: reg} = await supabase.from("registrations").select("*").eq("email", a.user.email).order("created_at",{ascending:false}).limit(1).maybeSingle();
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
  doc.setFontSize(10); doc.text("Official Funding Band Letter - 2026",20,23);
  doc.setTextColor(0,0,0); let y=50;
  doc.setFontSize(22); doc.setFont("helvetica","bold"); doc.text(`BAND: ${data.band}`,20,y); y+=12;
  doc.setFont("helvetica","normal"); doc.setFontSize(12);
  doc.text(`Name: ${data.full_name}`,20,y); y+=8;
  doc.text(`ID: ${data.id_number}`,20,y); y+=8;
  doc.text(`Phone: ${data.phone}`,20,y); y+=8;
  doc.text(`Income: KSH ${Number(data.income).toLocaleString()}`,20,y); y+=15;
  doc.setFontSize(9); doc.setTextColor(100,100,100); doc.text(`Ref: HEF/2026/${data.id_number} | helb-band-checker.vercel.app`,20,285);
  doc.save(`HEF-${data.band}-${data.id_number}.pdf`);
 };

 const handlePay = async () => {
  setPaying(true); setMsg(`Sending STK to ${data.phone}...`);
  try{
   const res = await fetch("/api/mpesa/stk",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({phone: data.phone, amount: 50}) });
   const text = await res.text(); let json:any={}; try{ json=JSON.parse(text); }catch{ json={ error: text.slice(0,300), ResponseCode:1 }; }
   if(json.ResponseCode==="0" || json.ResponseCode===0){
    setMsg("✅ STK sent! Enter PIN on phone. Auto-download in 12s...");
    setTimeout(async()=>{ await generatePDF(); setShowPay(false); setPaying(false); }, 12000);
   } else {
    setMsg(`⚠️ ${json.error || json.ResultDesc || "STK not sent"} — Use Bypass below`);
    setPaying(false);
   }
  }catch(e:any){ setMsg(`Network error: ${e.message} — Use Bypass`); setPaying(false); }
 };

 if(loading) return <div className="p-10 text-center">Loading...</div>;
 if(!data) return <div className="p-10 text-center">No data. <Link href="/" className="underline">Home</Link></div>;

 return(
  <div className="max-w-4xl mx-auto p-4 space-y-4">
   <div className="bg-white border rounded-2xl p-4 flex justify-between"><div className="font-bold text-sm">{data.full_name} • {data.band}</div><Link href="/login" className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-bold">Logout</Link></div>

   <div className="bg-white border rounded-[24px] p-8 text-center shadow-sm">
    <div className="text-[10px] font-black tracking-widest text-gray-400">FUNDING CLASSIFICATION 2026</div>
    <h1 className="text-5xl font-black text-[#0a3d62] mt-3">{data.band}</h1>
    <div className="mt-6 grid grid-cols-3 gap-3">
      <div className="bg-[#0a3d62] text-white p-4 rounded-2xl"><div className="text-2xl font-black">70%</div><div className="text-[9px]">SCHOLARSHIP</div></div>
      <div className="bg-gray-50 border p-4 rounded-2xl"><div className="text-2xl font-black">25%</div><div className="text-[9px]">LOAN</div></div>
      <div className="bg-gray-50 border p-4 rounded-2xl"><div className="text-2xl font-black">5%</div><div className="text-[9px]">FAMILY</div></div>
    </div>
    <button onClick={()=>setShowPay(true)} className="w-full mt-8 bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm">Download Official Letter (KSH 50) →</button>
   </div>

   {showPay && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-[28px] p-7 max-w-sm w-full">
      <h3 className="text-xl font-black">Pay KSH 50</h3>
      <p className="text-sm text-gray-500 mt-2">Lipa na M-Pesa Till <b>8629094</b> to <b>{data.phone}</b></p>
      <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-bold text-amber-800">
        {msg || `Click Pay to receive STK Push`}
      </div>
      <div className="mt-5 flex gap-3">
        <button onClick={()=>{setShowPay(false); setMsg(""); setPaying(false);}} className="flex-1 border-2 py-3 rounded-xl font-bold text-sm">Cancel</button>
        <button onClick={handlePay} disabled={paying} className="flex-1 bg-[#0a3d62] text-white py-3 rounded-xl font-bold text-sm">{paying?"Sending...":"Pay 50 Now"}</button>
      </div>
      <button onClick={async()=>{ await generatePDF(); setShowPay(false); }} className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold text-sm">⚡ Bypass - Download Free</button>
      <p className="text-[10px] text-center text-gray-400 mt-2">Paywall active. Bypass for when Daraja token fails</p>
     </div>
    </div>
   )}
  </div>
 );
}