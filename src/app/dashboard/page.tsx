"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null);
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: authData})=>{
   if(!authData.user){
    router.push("/login");
   } else {
    setUser(authData.user);
    const {data: reg} = await supabase.from("registrations").select("*").eq("email", authData.user.email).single();
    setData(reg);
   }
   setLoading(false);
  });
 },[router]);

 const logout=async()=>{
  await supabase.auth.signOut();
  router.push("/login");
 };

 if(loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div></div>;
 if(!user) return null;

 const bandInfo:any = {
  "BAND 1": { sch: 70, loan: 25, family: 5, color: "from-green-600 to-emerald-600" },
  "BAND 2": { sch: 60, loan: 30, family: 10, color: "from-blue-600 to-indigo-600" },
  "BAND 3": { sch: 50, loan: 30, family: 20, color: "from-yellow-500 to-orange-500" },
  "BAND 4": { sch: 40, loan: 30, family: 30, color: "from-orange-500 to-red-500" },
  "BAND 5": { sch: 30, loan: 30, family: 40, color: "from-red-600 to-rose-700" },
 };
 const info = data?.band? bandInfo[data.band] : null;

 const downloadPDF = () => {
  if(!data) return;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("HEF FUNDING BAND - OFFICIAL LETTER 2026", 20, 30);
  doc.setFontSize(12);
  doc.text(`Name: ${data.full_name}`, 20, 50);
  doc.text(`ID: ${data.id_number}`, 20, 60);
  doc.text(`Band: ${data.band}`, 20, 70);
  doc.text(`Income: KSH ${Number(data.income).toLocaleString()}`, 20, 80);
  doc.text(`Scholarship: ${info?.sch}% | Loan: ${info?.loan}% | Family: ${info?.family}%`, 20, 90);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 110);
  doc.text("hefbands.co.ke", 20, 130);
  doc.save(`${data.full_name}-${data.band}.pdf`);
 };

 const shareWhatsapp = () => {
  if(!data) return;
  const text=`🔥 I am ${data.band}! Check your HEF Band: https://helb-band-checker.vercel.app/?ref=${data.band.toLowerCase().replace(' ','')}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
 };

 return(
  <div className="max-w-3xl mx-auto space-y-4">
   <div className="bg-white rounded-[24px] shadow border overflow-hidden">
    <div className="bg-[#0a3d62] p-6 text-white flex justify-between items-center">
     <div><h1 className="text-2xl font-black">Dashboard</h1><p className="text-xs opacity-60">Hi, {data?.full_name?.split(' ')[0] || user.email}</p></div>
     <button onClick={logout} className="bg-white/10 px-5 py-2 rounded-full text-xs font-black">LOGOUT</button>
    </div>
    {data? (
     <div className="p-6">
      <div className={`bg-gradient-to-br ${info?.color || "from-[#0a3d62] to-[#1e6fa8]"} text-white p-6 rounded-[20px]`}>
       <div className="text-5xl font-black">{data.band}</div>
       <div className="mt-2 text-sm opacity-80">Income KSH {Number(data.income).toLocaleString()}</div>
       {info && <div className="grid grid-cols-3 gap-2 mt-5">
        <div className="bg-white text-[#0a3d62] p-3 rounded-xl text-center font-black">{info.sch}%<div className="text-[9px]">SCHOLARSHIP</div></div>
        <div className="bg-white/20 p-3 rounded-xl text-center font-black">{info.loan}%<div className="text-[9px]">LOAN</div></div>
        <div className="bg-white/20 p-3 rounded-xl text-center font-black">{info.family}%<div className="text-[9px]">FAMILY</div></div>
       </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
       <button onClick={downloadPDF} className="bg-[#0a3d62] text-white py-4 rounded-2xl font-black text-sm">📄 DOWNLOAD PDF (KSH 50)</button>
       <button onClick={shareWhatsapp} className="bg-[#25D366] text-white py-4 rounded-2xl font-black text-sm">📱 SHARE WHATSAPP</button>
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-[11px] text-yellow-800">💡 PDF is FREE for now. Later we connect M-Pesa to charge KSH 50 before download.</div>
      <div className="grid grid-cols-2 gap-3 mt-6">
       <div className="p-4 border-2 border-gray-100 rounded-xl"><div className="text-[10px] text-gray-400 font-black">FULL NAME</div><div className="font-bold text-sm">{data.full_name}</div></div>
       <div className="p-4 border-2 border-gray-100 rounded-xl"><div className="text-[10px] text-gray-400 font-black">PHONE</div><div className="font-bold text-sm">{data.phone}</div></div>
      </div>
     </div>
    ) : (
     <div className="p-10 text-center text-sm text-gray-500">No data found</div>
    )}
   </div>
  </div>
 );
}