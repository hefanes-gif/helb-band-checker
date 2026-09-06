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
 const [statusMsg,setStatusMsg]=useState("");
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: authData})=>{
   if(!authData.user){ router.push("/login"); return; }
   setUser(authData.user);
   const {data: reg} = await supabase.from("registrations").select("*").eq("email", authData.user.email).order("created_at",{ascending:false}).limit(1).maybeSingle();
   if(reg) setData(reg);
   else {
    const {data: all} = await supabase.from("registrations").select("*").order("created_at",{ascending:false}).limit(1);
    if(all && all[0]) setData(all[0]);
   }
   setLoading(false);
  });
 },[router]);

 const generatePDF = async () => {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF();
  doc.setFillColor(10,61,98); doc.rect(0,0,210,35,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont("helvetica","bold");
  doc.text("HIGHER EDUCATION FINANCING (HEF)",20,15);
  doc.setFontSize(10); doc.text("Official Funding Band Classification Letter - 2026",20,22);
  doc.setTextColor(0,0,0); doc.setFontSize(12); doc.setFont("helvetica","normal");
  let y=50;
  doc.setFont("helvetica","bold"); doc.text(`FUNDING BAND: ${data.band}`,20,y); y+=10;
  doc.setFont("helvetica","normal");
  doc.text(`Full Name: ${data.full_name}`,20,y); y+=8;
  doc.text(`ID Number: ${data.id_number}`,20,y); y+=8;
  doc.text(`Phone: ${data.phone}`,20,y); y+=8;
  doc.text(`Email: ${data.email}`,20,y); y+=8;
  doc.text(`Income: KSH ${Number(data.income).toLocaleString()}`,20,y); y+=15;
  const bands:any = {"BAND 1":{sch:70,loan:25,family:5},"BAND 2":{sch:60,loan:30,family:10},"BAND 3":{sch:50,loan:30,family:20},"BAND 4":{sch:40,loan:30,family:30},"BAND 5":{sch:30,loan:30,family:40}};
  const b=bands[data.band]||bands["BAND 5"];
  doc.text(`Scholarship: ${b.sch}% | Loan: ${b.loan}% | Family: ${b.family}%`,20,y);
  doc.setFontSize(9); doc.setTextColor(100,100,100); doc.text(`Generated: ${new Date().toLocaleString()} - helb-band-checker.vercel.app`,20,285);
  doc.save(`HEF-${data.band}-${data.id_number}.pdf`);
 };

 const handlePay = async () => {
  setPaying(true); setStatusMsg("Sending STK Push to "+data.phone+"...");
  try{
   const res = await fetch("/api/mpesa/stk",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ phone: data.phone, amount: 50 })
   });
   const json = await res.json();
   console.log(json);
   if(json.ResponseCode === "0"){
    setStatusMsg("✅ STK Push sent! Enter PIN on "+data.phone);
    setTimeout(async()=>{ await generatePDF(); setShowPay(false); setPaying(false); }, 15000);
   } else {
    setStatusMsg("❌ STK Failed: " + (json.error || json.errorMessage || json.ResultDesc || JSON.stringify(json).slice(0,150)));
    setPaying(false);
   }
  }catch(e:any){ setStatusMsg("Error: "+e.message); setPaying(false); }
 };

 if(loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div></div>;

 const bandInfo:any = {"BAND 1":{sch:70,loan:25,family:5},"BAND 2":{sch:60,loan:30,family:10},"BAND 3":{sch:50,loan:30,family:20},"BAND 4":{sch:40,loan:30,family:30},"BAND 5":{sch:30,loan:30,family:40}};
 const info = data?.band? bandInfo[data.band] : null;

 return(
  <div className="max-w-5xl mx-auto space-y-5 p-4">
   <div className="bg-white rounded-2xl border p-4 flex justify-between items-center">
    <div className="flex gap-3 items-center"><div className="w-10 h-10 bg-[#0a3d62] rounded-full flex items-center justify-center text-white font-black">{data?.full_name?.[0] || 'U'}</div><div><div className="font-bold text-sm">{data?.full_name}</div><div className="text-[11px] text-gray-500">{user?.email} • {data?.band}</div></div></div>
    <Link href="/login" className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold">Logout</Link>
   </div>

   {data && <div className="grid md:grid-cols-3 gap-5">
    <div className="md:col-span-2 bg-white rounded-[24px] border overflow-hidden">
     <div className="p-6 border-b flex justify-between"><div><div className="text-[10px] font-black text-gray-400 tracking-widest">FUNDING CLASSIFICATION 2026</div><h2 className="text-3xl font-black text-[#0a3d62] mt-2">{data.band}</h2></div><div className="text-right"><div className="text-[10px] font-black text-gray-400">INCOME</div><div className="font-black">KSH {Number(data.income).toLocaleString()}</div></div></div>
     <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3"><div className="bg-[#0a3d62] text-white p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.sch}%</div><div className="text-[10px] opacity-70">SCHOLARSHIP</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.loan}%</div><div className="text-[10px]">LOAN</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.family}%</div><div className="text-[10px]">FAMILY</div></div></div>
      <button onClick={()=>setShowPay(true)} className="w-full bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm hover:bg-black">Download Official Letter (KSH 50) →</button>
     </div>
    </div>
    <div className="bg-white rounded-2xl border p-5 h-fit"><h3 className="font-bold text-sm">Applicant</h3><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{data.full_name}</span></div><div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-bold">{data.id_number}</span></div><div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{data.phone}</span></div></div></div>
   </div>}

   {showPay && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-[28px] p-7 max-w-sm w-full shadow-2xl">
      <h3 className="text-xl font-black tracking-tighter">Pay KSH 50</h3><p className="text-sm text-gray-500 mt-2">STK Push to <b>{data.phone}</b> for Till <b>8629094</b></p>
      <div className="mt-4 bg-gray-50 border-2 border-dashed p-3 rounded-xl text-xs">
        Lipa na M-Pesa: Buy Goods Till 8629094 - 50 KSH
        {statusMsg && <span className="mt-2 block font-bold text-red-600">{statusMsg}</span>}
      </div>
      <div className="mt-5 flex gap-3">
        <button onClick={()=>{setShowPay(false); setPaying(false); setStatusMsg("");}} className="flex-1 border-2 py-3 rounded-xl font-bold text-sm">Cancel</button>
        <button onClick={handlePay} disabled={paying} className="flex-1 bg-[#0a3d62] text-white py-3 rounded-xl font-bold text-sm">{paying?"Sending...":"Pay 50 Now"}</button>
      </div>
      {/* BYPASS BUTTON - WORKS NOW */}
      <button onClick={async()=>{ await generatePDF(); setShowPay(false); }} className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold text-sm">⚡ Bypass - Download Free (Test Mode)</button>
      <p className="text-[10px] text-center text-gray-400 mt-3">Fix PASSKEY in Vercel later to enable real M-Pesa</p>
     </div>
    </div>
   )}
  </div>
 );
}