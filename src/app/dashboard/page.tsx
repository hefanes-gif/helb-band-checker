"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null);
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: authData})=>{
   if(!authData.user){ router.push("/login"); }
   else {
    setUser(authData.user);
    const {data: reg} = await supabase.from("registrations").select("*").eq("email", authData.user.email).single();
    setData(reg);
   }
   setLoading(false);
  });
 },[router]);

 const logout=async()=>{ await supabase.auth.signOut(); router.push("/login"); };
 if(loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div></div>;
 if(!user) return null;

 const bandInfo:any = {
  "BAND 1": { sch:70, loan:25, family:5, color:"bg-green-600", light:"bg-green-50 border-green-200", text:"text-green-700", desc:"Extremely Needy", status:"Fully Funded" },
  "BAND 2": { sch:60, loan:30, family:10, color:"bg-blue-600", light:"bg-blue-50 border-blue-200", text:"text-blue-700", desc:"Very Needy", status:"Highly Funded" },
  "BAND 3": { sch:50, loan:30, family:20, color:"bg-amber-500", light:"bg-amber-50 border-amber-200", text:"text-amber-700", desc:"Needy", status:"Partially Funded" },
  "BAND 4": { sch:40, loan:30, family:30, color:"bg-orange-600", light:"bg-orange-50 border-orange-200", text:"text-orange-700", desc:"Less Needy", status:"Limited Funding" },
  "BAND 5": { sch:30, loan:30, family:40, color:"bg-red-600", light:"bg-red-50 border-red-200", text:"text-red-700", desc:"Able", status:"Self Sponsored" },
 };
 const info = data?.band? bandInfo[data.band] : null;

 const downloadPDF = () => {
  if(!data) return;
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text("HEF FUNDING BAND - OFFICIAL LETTER 2026", 20, 30);
  doc.setFontSize(12); doc.text(`Name: ${data.full_name}`, 20, 50); doc.text(`ID: ${data.id_number}`, 20, 60);
  doc.text(`Band: ${data.band}`, 20, 70); doc.text(`Income: KSH ${Number(data.income).toLocaleString()}`, 20, 80);
  doc.save(`${data.band}.pdf`);
 };
 const shareWhatsapp = () => {
  if(!data) return;
  const text=`My HEF Band is ${data.band} - ${info?.desc}! Check yours: https://helb-band-checker.vercel.app/?ref=${data.band.toLowerCase().replace(' ','')}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
 };

 return(
  <div className="max-w-5xl mx-auto space-y-5">
   {/* Top Status */}
   <div className="bg-white rounded-2xl border shadow-sm p-4 flex flex-wrap justify-between items-center gap-3">
    <div className="flex items-center gap-3">
     <div className="w-10 h-10 bg-[#0a3d62] rounded-full flex items-center justify-center text-white font-black">{data?.full_name?.[0] || 'U'}</div>
     <div><div className="font-bold text-[#0a3d62] text-sm leading-none">{data?.full_name}</div><div className="text-[11px] text-gray-500 mt-1">{user.email} • Verified ✓</div></div>
    </div>
    <div className="flex gap-2"><button onClick={shareWhatsapp} className="bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold">WhatsApp Share</button><button onClick={logout} className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold">Logout</button></div>
   </div>

   <div className="grid md:grid-cols-3 gap-5">
    {/* Main Card */}
    <div className="md:col-span-2 bg-white rounded-[24px] border shadow-sm overflow-hidden">
     <div className="p-6 border-b flex justify-between items-start">
      <div><div className="text-[10px] tracking-[0.2em] font-black text-gray-400">FUNDING CLASSIFICATION 2026</div><div className="flex items-center gap-3 mt-2"><div className={`w-3 h-3 rounded-full ${info?.color}`}></div><h2 className="text-3xl font-black text-[#0a3d62]">{data?.band || 'N/A'}</h2><span className={`text-xs font-bold px-3 py-1 rounded-full border ${info?.light} ${info?.text}`}>{info?.status}</span></div><div className="text-sm text-gray-500 mt-1">{info?.desc} — Based on MTI Model</div></div>
      <div className="text-right"><div className="text-[10px] font-black text-gray-400">HOUSEHOLD INCOME</div><div className="font-black text-[#0a3d62]">KSH {data? Number(data.income).toLocaleString() : '0'}</div></div>
     </div>

     <div className="p-6 space-y-5">
      {info && (
       <>
        <div><div className="flex justify-between text-xs font-bold mb-2"><span>Scholarship {info.sch}%</span><span className="text-gray-500">Govt pays</span></div><div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="h-full bg-[#0a3d62]" style={{width:`${info.sch}%`}}></div></div></div>
        <div><div className="flex justify-between text-xs font-bold mb-2"><span>HELB Loan {info.loan}%</span><span className="text-gray-500">Pay after school</span></div><div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="h-full bg-[#1e6fa8]" style={{width:`${info.loan}%`}}></div></div></div>
        <div><div className="flex justify-between text-xs font-bold mb-2"><span>Family Contribution {info.family}%</span><span className="text-gray-500">You pay</span></div><div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="h-full bg-gray-400" style={{width:`${info.family}%`}}></div></div></div>
       </>
      )}
      <div className="grid grid-cols-3 gap-3 pt-2">
       <div className="bg-[#0a3d62] text-white p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.sch || 0}%</div><div className="text-[10px] opacity-70">SCHOLARSHIP</div></div>
       <div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black text-[#0a3d62]">{info?.loan || 0}%</div><div className="text-[10px] text-gray-500">LOAN</div></div>
       <div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black text-gray-700">{info?.family || 0}%</div><div className="text-[10px] text-gray-500">FAMILY</div></div>
      </div>

      <div className="flex gap-3">
       <button onClick={downloadPDF} className="flex-1 bg-[#0a3d62] text-white py-3.5 rounded-xl font-bold text-sm">Download Official Letter (KSH 50)</button>
       <Link href="/calculator" className="px-6 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-sm">Recheck</Link>
      </div>
     </div>
    </div>

    {/* Side Panel */}
    <div className="space-y-5">
     <div className="bg-white rounded-2xl border shadow-sm p-5">
      <h3 className="font-bold text-sm text-[#0a3d62]">Applicant Details</h3>
      <div className="mt-4 space-y-3 text-sm">
       <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span className="font-bold text-right max-w-[60%] truncate">{data?.full_name}</span></div>
       <div className="flex justify-between"><span className="text-gray-500">ID No.</span><span className="font-bold">{data?.id_number}</span></div>
       <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{data?.phone}</span></div>
       <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-bold truncate max-w-[60%]">{data?.email}</span></div>
      </div>
     </div>
     <div className="bg-[#0a3d62] rounded-2xl p-5 text-white">
      <h3 className="font-bold text-sm">Next Steps</h3>
      <div className="mt-4 space-y-3 text-xs">
       <div className="flex gap-3"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[11px]">1</div><span>Download letter & present to your university</span></div>
       <div className="flex gap-3"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[11px]">2</div><span>Apply on HEF Portal before deadline</span></div>
       <div className="flex gap-3"><div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">✓</div><span>Band verified successfully</span></div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}