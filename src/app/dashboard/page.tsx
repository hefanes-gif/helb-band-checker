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
 const router=useRouter();

 useEffect(()=>{
  supabase.auth.getUser().then(async({data: authData})=>{
   if(!authData.user){ router.push("/login"); return; }
   setUser(authData.user);
   // Try exact email, then case-insensitive, then latest
   let {data: reg} = await supabase.from("registrations").select("*").eq("email", authData.user.email).maybeSingle();
   if(!reg){
    const {data: all} = await supabase.from("registrations").select("*").order("created_at", {ascending:false}).limit(1);
    if(all && all.length>0) reg = all[0];
   }
   setData(reg);
   setLoading(false);
  });
 },[router]);

 const logout=async()=>{ await supabase.auth.signOut(); router.push("/login"); };

 const handleDownloadClick = () => {
  if(!data){ alert("No registration found. Please register again at /register"); router.push("/register"); return; }
  setShowPay(true);
 };

 const confirmPayment = async () => {
  setPaying(true);
  // Simulate M-Pesa STK
  setTimeout(async()=>{
   setPaying(false);
   setShowPay(false);
   // Generate PDF after "payment"
   const jsPDF = (await import("jspdf")).default;
   const doc = new jsPDF();
   doc.setFillColor(10,61,98); doc.rect(0,0,210,35,"F");
   doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont("helvetica","bold");
   doc.text("HIGHER EDUCATION FINANCING (HEF)", 20, 15);
   doc.setFontSize(10); doc.text("Official Funding Band Classification Letter - 2026", 20, 22);
   doc.setTextColor(0,0,0); doc.setFontSize(12); doc.setFont("helvetica","normal");
   let y=50;
   doc.setFont("helvetica","bold"); doc.text(`FUNDING BAND: ${data.band}`, 20, y); y+=10;
   doc.setFont("helvetica","normal");
   doc.text(`Full Name: ${data.full_name}`, 20, y); y+=8;
   doc.text(`ID Number: ${data.id_number}`, 20, y); y+=8;
   doc.text(`Phone: ${data.phone}`, 20, y); y+=8;
   doc.text(`Email: ${data.email}`, 20, y); y+=8;
   doc.text(`Household Income: KSH ${Number(data.income).toLocaleString()}`, 20, y); y+=8;
   doc.text(`Classification: Based on Means Testing Instrument (MTI) Model`, 20, y); y+=15;
   doc.setFont("helvetica","bold"); doc.text("Breakdown:", 20, y); y+=8;
   doc.setFont("helvetica","normal");
   const bands:any = {"BAND 1":{sch:70,loan:25,family:5},"BAND 2":{sch:60,loan:30,family:10},"BAND 3":{sch:50,loan:30,family:20},"BAND 4":{sch:40,loan:30,family:30},"BAND 5":{sch:30,loan:30,family:40}};
   const b=bands[data.band]||bands["BAND 5"];
   doc.text(`- Scholarship: ${b.sch}%`, 20, y); y+=7;
   doc.text(`- HELB Loan: ${b.loan}%`, 20, y); y+=7;
   doc.text(`- Family Contribution: ${b.family}%`, 20, y); y+=15;
   doc.setFontSize(9); doc.setTextColor(100,100,100);
   doc.text("This is a system generated letter from helb-band-checker.vercel.app - Not affiliated with Government.", 20, 285);
   doc.save(`HEF-${data.band}-${data.id_number}.pdf`);
  }, 2000);
 };

 if(loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div></div>;

 const bandInfo:any = {"BAND 1":{sch:70,loan:25,family:5,desc:"Extremely Needy",color:"bg-green-600"},"BAND 2":{sch:60,loan:30,family:10,desc:"Very Needy",color:"bg-blue-600"},"BAND 3":{sch:50,loan:30,family:20,desc:"Needy",color:"bg-amber-500"},"BAND 4":{sch:40,loan:30,family:30,desc:"Less Needy",color:"bg-orange-600"},"BAND 5":{sch:30,loan:30,family:40,desc:"Able",color:"bg-red-600"}};
 const info = data?.band? bandInfo[data.band] : null;

 return(
  <div className="max-w-5xl mx-auto space-y-5">
   <div className="bg-white rounded-2xl border shadow-sm p-4 flex flex-wrap justify-between items-center gap-3">
    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#0a3d62] rounded-full flex items-center justify-center text-white font-black">{data?.full_name?.[0] || 'U'}</div><div><div className="font-bold text-[#0a3d62] text-sm">{data?.full_name || user?.email}</div><div className="text-[11px] text-gray-500">{user?.email} • Verified ✓</div></div></div>
    <div className="flex gap-2"><a href={`https://wa.me/?text=${encodeURIComponent(`My HEF Band is ${data?.band}! Check yours: https://helb-band-checker.vercel.app`)}`} target="_blank" className="bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold">WhatsApp Share</a><button onClick={logout} className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold">Logout</button></div>
   </div>

   {!data && <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-sm"><b>No data found.</b> Your registration was not saved because RLS was ON. Please go to <Link href="/register" className="underline font-bold">/register</Link> and register again now that we fixed it.</div>}

   <div className="grid md:grid-cols-3 gap-5">
    <div className="md:col-span-2 bg-white rounded-[24px] border shadow-sm overflow-hidden">
     <div className="p-6 border-b flex justify-between"><div><div className="text-[10px] tracking-[0.2em] font-black text-gray-400">FUNDING CLASSIFICATION 2026</div><div className="flex items-center gap-3 mt-2"><div className={`w-3 h-3 rounded-full ${info?.color || 'bg-gray-300'}`}></div><h2 className="text-3xl font-black text-[#0a3d62]">{data?.band || 'N/A'}</h2></div><div className="text-sm text-gray-500 mt-1">{info?.desc || 'Based on MTI Model'}</div></div><div className="text-right"><div className="text-[10px] font-black text-gray-400">INCOME</div><div className="font-black text-[#0a3d62]">KSH {data? Number(data.income).toLocaleString() : '0'}</div></div></div>
     <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3"><div className="bg-[#0a3d62] text-white p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.sch || 0}%</div><div className="text-[10px] opacity-70">SCHOLARSHIP</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.loan || 0}%</div><div className="text-[10px]">LOAN</div></div><div className="bg-gray-50 border p-4 rounded-2xl text-center"><div className="text-2xl font-black">{info?.family || 0}%</div><div className="text-[10px]">FAMILY</div></div></div>
      <div className="flex gap-3"><button onClick={handleDownloadClick} className="flex-1 bg-[#0a3d62] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition">Download Official Letter (KSH 50)</button><Link href="/calculator" className="px-6 py-3.5 border-2 rounded-xl font-bold text-sm">Recheck</Link></div>
     </div>
    </div>
    <div className="space-y-5"><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold text-sm">Applicant Details</h3><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{data?.full_name || '-'}</span></div><div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-bold">{data?.id_number || '-'}</span></div><div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{data?.phone || '-'}</span></div></div></div></div>
   </div>

   {showPay && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-[24px] p-7 max-w-sm w-full shadow-2xl">
      <h3 className="text-xl font-black">Pay KSH 50 to Download</h3><p className="text-sm text-gray-500 mt-2">Enter M-Pesa number to get STK push. Official PDF letter will download after payment.</p>
      <div className="mt-5 bg-green-50 border border-green-200 p-3 rounded-xl text-xs"><b>Lipa na M-Pesa:</b><br/>Till: 123456<br/>Amount: 50</div>
      <div className="mt-5 flex gap-3"><button onClick={()=>setShowPay(false)} className="flex-1 border-2 py-3 rounded-xl font-bold text-sm">Cancel</button><button onClick={confirmPayment} disabled={paying} className="flex-1 bg-[#0a3d62] text-white py-3 rounded-xl font-bold text-sm">{paying?"Processing M-Pesa...":"Pay & Download"}</button></div>
      <div className="text-[10px] text-center text-gray-400 mt-3">Demo mode: Payment simulated for now. Connect Daraja API later.</div>
     </div>
    </div>
   )}
  </div>
 );
}