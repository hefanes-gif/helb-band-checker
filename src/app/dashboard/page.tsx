"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard(){
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const [showPay,setShowPay]=useState(false);
 const [showManual,setShowManual]=useState(false);
 const [paying,setPaying]=useState(false);
 const [msg,setMsg]=useState("");
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data:a})=>{
   if(!a.user){ router.push("/login"); return; }
   const {data:reg}=await supabase.from("registrations").select("*").eq("email",a.user.email).order("created_at",{ascending:false}).limit(1).maybeSingle();
   setData(reg); setLoading(false);
  });
 },[router]);

 const pdf = async(isBypass=false)=>{
  const jsPDF=(await import("jspdf")).default; const doc=new jsPDF();
  doc.setFillColor(10,61,98); doc.rect(0,0,210,32,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(14); doc.setFont("helvetica","bold"); doc.text("HIGHER EDUCATION FINANCING",15,14);
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.text("Official Funding Classification Letter - 2026",15,21);
  doc.setTextColor(0,0,0); doc.setFontSize(24); doc.setFont("helvetica","bold"); doc.text(`${data.band}`,15,50);
  doc.setFontSize(11); doc.setFont("helvetica","normal"); doc.text(`Name: ${data.full_name}`,15,62); doc.text(`ID: ${data.id_number} | Phone: ${data.phone}`,15,68); doc.text(`Income: KSH ${Number(data.income).toLocaleString()}`,15,74);
  doc.setFontSize(8); doc.setTextColor(120,120,120); doc.text(`Ref: HEF/2026/${data.id_number} • Generated at helb-band-checker.vercel.app • Valid for 2026 intake`,15,285);
  doc.save(`HEF-${data.band}-${data.id_number}.pdf`);
  if(isBypass){ setShowPay(false); setShowManual(true); }
 };

 const handlePay=async()=>{
  setPaying(true); setMsg(`STK push to ${data.phone}...`);
  try{
   const r=await fetch("/api/mpesa/stk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:data.phone,amount:50})});
   const t=await r.text(); let j:any={}; try{j=JSON.parse(t);}catch{j={error:t.slice(0,200),ResponseCode:1};}
   if(j.ResponseCode==="0"||j.ResponseCode===0){ setMsg("✅ Enter M-Pesa PIN on phone... Downloading in 12s"); setTimeout(async()=>{await pdf(false); setShowPay(false); setPaying(false);},12000); }
   else{ setMsg(j.error||j.ResultDesc||"Failed — use manual Till"); setPaying(false); }
  }catch(e:any){ setMsg("Network error — use Bypass"); setPaying(false); }
 };

 if(loading) return <div className="min-h-screen grid place-items-center text-sm text-gray-400">Loading your band...</div>;
 if(!data) return <div className="p-10 text-center"><Link href="/" className="underline">No record found — Go home</Link></div>;

 return(
  <div className="min-h-screen bg-[#f6f8fb]">
    <header className="bg-white border-b"><div className="max-w-4xl mx-auto px-4 py-3 flex justify-between"><div className="font-black text-[#0a3d62] text-sm">HEF PORTAL</div><Link href="/login" className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-bold">Logout</Link></div></header>
    <div className="max-w-3xl mx-auto p-4 mt-6 space-y-4">
      <div className="bg-white border rounded-[24px] p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="text-[10px] font-black tracking-[0.2em] text-gray-400">FUNDING CLASSIFICATION 2026</div>
        <h1 className="text-5xl md:text-6xl font-black text-[#0a3d62] mt-4 tracking-tight">{data.band}</h1>
        <p className="text-sm text-gray-500 mt-3">{data.full_name} • ID {data.id_number}</p>
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="bg-[#0a3d62] text-white rounded-2xl p-4"><div className="text-2xl font-black">{data.band==="BAND 1"?70:data.band==="BAND 2"?60:data.band==="BAND 3"?50:data.band==="BAND 4"?40:30}%</div><div className="text-[9px] font-bold tracking-widest opacity-70 mt-1">SCHOLARSHIP</div></div>
          <div className="bg-gray-50 border rounded-2xl p-4"><div className="text-2xl font-black text-[#0a3d62]">30%</div><div className="text-[9px] font-bold tracking-widest text-gray-400 mt-1">LOAN</div></div>
          <div className="bg-gray-50 border rounded-2xl p-4"><div className="text-2xl font-black text-[#0a3d62]">{data.band==="BAND 1"?"0%":data.band==="BAND 2"?"10%":data.band==="BAND 3"?"20%":data.band==="BAND 4"?"30%":"40%"}</div><div className="text-[9px] font-bold tracking-widest text-gray-400 mt-1">FAMILY</div></div>
        </div>
        <button onClick={()=>setShowPay(true)} className="w-full mt-8 bg-[#0a3d62] hover:bg-[#08304d] transition text-white py-4 rounded-xl font-black text-[14px] shadow-lg">Download Official Letter — KSH 50 →</button>
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-gray-400"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Instant PDF • Secure M-Pesa • Till 8629094</div>
      </div>
    </div>

    {showPay && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"><div className="bg-white rounded-[28px] p-7 max-w-sm w-full shadow-2xl"><h3 className="text-[18px] font-black">Secure Payment</h3><p className="text-[13px] text-gray-500 mt-1">Pay to <b>Till 8629094</b> — {data.phone}</p><div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-bold text-amber-900 min-h-[44px]">{msg||"Tap Pay to receive STK prompt"}</div><div className="mt-5 flex gap-3"><button onClick={()=>setShowPay(false)} className="flex-1 border-2 py-3 rounded-xl font-bold text-sm">Cancel</button><button onClick={handlePay} disabled={paying} className="flex-1 bg-[#0a3d62] text-white py-3 rounded-xl font-bold text-sm">{paying?"Sending...":"Pay 50"}</button></div><button onClick={()=>pdf(true)} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm">⚡ Bypass — Free Download</button><button onClick={()=>{setShowPay(false); setShowManual(true);}} className="w-full mt-2 text-[11px] text-gray-400 underline">Pay manually via Till →</button></div></div>
    )}

    {showManual && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-end md:items-center justify-center"><div className="bg-white rounded-t-[28px] md:rounded-[28px] w-full max-w-md p-7"><div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden"/><h3 className="text-[18px] font-black">Support Project 🙏</h3><p className="text-[13px] text-gray-600 mt-2">You used bypass. Please pay KSH 50 manually to keep servers running.</p><div className="mt-5 bg-[#0a3d62] text-white rounded-2xl p-5"><div className="text-[10px] font-black tracking-widest opacity-60">LIPA NA M-PESA — BUY GOODS</div><div className="flex justify-between items-center mt-3"><div><div className="text-xs opacity-70">Till Number</div><div className="text-3xl font-black tracking-wider">8629094</div></div><button onClick={()=>{navigator.clipboard.writeText("8629094"); alert("Copied!");}} className="bg-white text-[#0a3d62] px-4 py-2 rounded-full text-xs font-black">COPY</button></div><div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-sm"><span>Amount</span><b>KSH 50</b></div></div><div className="mt-4 bg-gray-50 border rounded-2xl p-4 text-[12px] leading-5"><b>How to pay:</b> M-Pesa → Lipa na M-Pesa → Buy Goods → Till 8629094 → 50 → PIN</div><div className="mt-5 flex gap-3"><button onClick={()=>setShowManual(false)} className="flex-1 border-2 py-3.5 rounded-xl font-bold text-sm">Later</button><a href={`https://wa.me/254758973109?text=I paid 50 to Till 8629094 for ${data.id_number}`} target="_blank" className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm text-center">I Paid (WhatsApp)</a></div></div></div>
    )}
  </div>
 );
}