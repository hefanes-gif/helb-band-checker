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
 const [showManual,setShowManual]=useState(false);
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

 const generatePDF = async (isBypass=false) => {
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
  if(isBypass){
    setShowPay(false);
    setShowManual(true); // SHOW MANUAL PAY MENU AFTER BYPASS
  }
 };

 const handlePay = async () => {
  setPaying(true); setMsg(`Sending STK to ${data.phone}...`);
  try{
   const res = await fetch("/api/mpesa/stk",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({phone: data.phone, amount: 50}) });
   const text = await res.text(); let json:any={}; try{ json=JSON.parse(text); }catch{ json={ error: text.slice(0,300), ResponseCode:1 }; }
   if(json.ResponseCode==="0" || json.ResponseCode===0){
    setMsg("✅ STK sent! Enter M-Pesa PIN. Downloading in 12s...");
    setTimeout(async()=>{ await generatePDF(false); setShowPay(false); setPaying(false); }, 12000);
   } else {
    setMsg(`⚠️ ${json.error || json.ResultDesc || "STK not sent"} — Use Bypass or Manual Till below`);
    setPaying(false);
   }
  }catch(e:any){ setMsg(`Error: ${e.message} — Use Bypass`); setPaying(false); }
 };

 const copyTill = () => { navigator.clipboard.writeText("8629094"); alert("Till 8629094 copied!"); };

 if(loading) return <div className="p-10 text-center">Loading...</div>;
 if(!data) return <div className="p-10 text-center">No data. <Link href="/" className="underline">Home</Link></div>;

 return(
  <div className="max-w-4xl mx-auto p-4 space-y-4">
   <div className="bg-white border rounded-2xl p-4 flex justify-between"><div className="font-bold text-sm">{data.full_name} • {data.band}</div><Link href="/login" className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-bold">Logout</Link></div>

   <div className="bg-white border rounded-[24px] p-8 text-center shadow-sm">
    <div className="text-[10px] font-black tracking-widest text-gray-400">FUNDING CLASSIFICATION 2026</div>
    <h1 className="text-5xl font-black text-[#0a3d62] mt-3">{data.band}</h1>
    <button onClick={()=>setShowPay(true)} className="w-full mt-8 bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm">Download Official Letter (KSH 50) →</button>
   </div>

   {/* PAYWALL MODAL */}
   {showPay && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-[28px] p-7 max-w-sm w-full">
      <h3 className="text-xl font-black">Pay KSH 50</h3>
      <p className="text-sm text-gray-500 mt-2">Lipa na M-Pesa to <b>{data.phone}</b></p>
      <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-bold text-amber-800 min-h-[40px]">{msg || `Click Pay to receive STK Push`}</div>
      <div className="mt-5 flex gap-3">
        <button onClick={()=>{setShowPay(false); setMsg(""); setPaying(false);}} className="flex-1 border-2 py-3 rounded-xl font-bold text-sm">Cancel</button>
        <button onClick={handlePay} disabled={paying} className="flex-1 bg-[#0a3d62] text-white py-3 rounded-xl font-bold text-sm">{paying?"Sending...":"Pay 50 Now"}</button>
      </div>
      <button onClick={async()=>{ await generatePDF(true); }} className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold text-sm">⚡ Bypass - Download Free</button>
      <button onClick={()=>{ setShowPay(false); setShowManual(true); }} className="w-full mt-2 text-xs underline text-gray-500">Manual M-Pesa Pay → Till 8629094</button>
     </div>
    </div>
   )}

   {/* MANUAL PAY MENU AFTER BYPASS */}
   {showManual && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
     <div className="bg-white rounded-t-[28px] md:rounded-[28px] p-7 max-w-md w-full animate-slide-up">
      <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 md:hidden"></div>
      <h3 className="text-xl font-black">Support the Project 🙏</h3>
      <p className="text-sm text-gray-600 mt-2">You downloaded via Bypass. Please pay <b>KSH 50</b> manually to keep site running.</p>

      <div className="mt-5 bg-[#0a3d62] text-white rounded-2xl p-5">
        <div className="text-[10px] tracking-widest opacity-60 font-black">LIPA NA M-PESA</div>
        <div className="flex justify-between items-center mt-2">
          <div><div className="text-xs opacity-70">Buy Goods Till Number</div><div className="text-3xl font-black tracking-wider">8629094</div></div>
          <button onClick={copyTill} className="bg-white text-[#0a3d62] px-4 py-2 rounded-full text-xs font-black">COPY</button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm"><span>Amount</span><b>KSH 50</b></div>
      </div>

      <div className="mt-4 bg-gray-50 border rounded-2xl p-4 text-xs space-y-2">
        <b>How to pay:</b>
        <div>1. M-Pesa → Lipa na M-Pesa → Buy Goods & Services</div>
        <div>2. Enter Till: <b>8629094</b></div>
        <div>3. Amount: <b>50</b> → Enter PIN → Send</div>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={()=>setShowManual(false)} className="flex-1 border-2 py-3.5 rounded-xl font-bold text-sm">Later</button>
        <a href={`https://wa.me/254758973109?text=${encodeURIComponent(`Hi Evans, I used bypass for ID ${data.id_number} ${data.band}. I have paid 50 to Till 8629094. Confirm.`)}`} target="_blank" className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm text-center">I Have Paid (WhatsApp)</a>
      </div>
      <p className="text-[10px] text-center text-gray-400 mt-3">© 2026 HEF Bands — helb-band-checker.vercel.app</p>
     </div>
    </div>
   )}
  </div>
 );
}