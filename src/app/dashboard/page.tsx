"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null);
 const [data,setData]=useState<any>(null);
 const [loading,setLoading]=useState(true);
 const [downloading,setDownloading]=useState(false);
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
  setDownloading(true);
  try{
   const jsPDF = (await import("jspdf")).default;
   const doc = new jsPDF();

   // Header
   doc.setFillColor(10,61,98); doc.rect(0,0,210,35,"F");
   doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont("helvetica","bold");
   doc.text("HIGHER EDUCATION FINANCING (HEF)",20,15);
   doc.setFontSize(10); doc.setFont("helvetica","normal");
   doc.text("Official Funding Band Classification Letter - 2026 Academic Year",20,22);
   doc.text("Ministry of Education - HEF Portal",20,28);

   doc.setTextColor(0,0,0);
   let y=50;
   doc.setFontSize(22); doc.setFont("helvetica","bold"); doc.setTextColor(10,61,98);
   doc.text(`FUNDING BAND: ${data.band}`,20,y); y+=12;

   doc.setFontSize(11); doc.setTextColor(0,0,0); doc.setFont("helvetica","normal");
   doc.text(`Full Name: ${data.full_name}`,20,y); y+=8;
   doc.text(`ID Number: ${data.id_number}`,20,y); y+=8;
   doc.text(`Phone: ${data.phone}`,20,y); y+=8;
   doc.text(`Email: ${data.email}`,20,y); y+=8;
   doc.text(`Family Income: KSH ${Number(data.income).toLocaleString()}`,20,y); y+=15;

   const bands:any = {"BAND 1":{sch:70,loan:25,family:5,desc:"Extremely Needy"},"BAND 2":{sch:60,loan:30,family:10,desc:"Very Needy"},"BAND 3":{sch:50,loan:30,family:20,desc:"Needy"},"BAND 4":{sch:40,loan:30,family:30,desc:"Less Needy"},"BAND 5":{sch:30,loan:30,family:40,desc:"Able"}};
   const b=bands[data.band]||bands["BAND 5"];

   doc.setFont("helvetica","bold"); doc.text("Funding Breakdown:",20,y); y+=8;
   doc.setFont("helvetica","normal");
   doc.text(`- Government Scholarship: ${b.sch}%`,25,y); y+=7;
   doc.text(`- Government Loan (HELB): ${b.loan}%`,25,y); y+=7;
   doc.text(`- Family Contribution: ${b.family}%`,25,y); y+=15;

   doc.setFontSize(10); doc.text(`Category: ${b.desc}`,20,y); y+=15;
   doc.setFontSize(9); doc.setTextColor(100,100,100);
   doc.text(`Date Issued: ${new Date().toLocaleString()}`,20,y); y+=5;
   doc.text(`Ref No: HEF/${new Date().getFullYear()}/${data.id_number}`,20,y); y+=5;
   doc.text(`This document is system generated from helb-band-checker.vercel.app`,20,y); y+=5;
   doc.text(`Not affiliated with Government. For information purposes only.`,20,285);

   doc.save(`HEF-${data.band}-${data.id_number}.pdf`);

   // WhatsApp viral after download
   setTimeout(()=>{
     const msg = `I got ${data.band}! Check your HEF Band here: https://helb-band-checker.vercel.app`;
     if(confirm("✅ PDF Downloaded! Share to WhatsApp to help friends check their band?")){
       window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
     }
   },800);

  } catch(e){ alert("Error generating PDF"); }
  setDownloading(false);
 };

 if(loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div></div>;

 if(!data) return <div className="p-10 text-center">No data found. <Link href="/register" className="underline font-bold">Register again</Link></div>;

 const bandInfo:any = {"BAND 1":{sch:70,loan:25,family:5,color:"bg-green-600"},"BAND 2":{sch:60,loan:30,family:10,color:"bg-blue-600"},"BAND 3":{sch:50,loan:30,family:20,color:"bg-amber-500"},"BAND 4":{sch:40,loan:30,family:30,color:"bg-orange-600"},"BAND 5":{sch:30,loan:30,family:40,color:"bg-red-600"}};
 const info = bandInfo[data.band];

 return(
  <div className="max-w-5xl mx-auto space-y-5 p-4">
   <div className="bg-white rounded-2xl border p-4 flex justify-between items-center">
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 bg-[#0a3d62] rounded-full flex items-center justify-center text-white font-black">{data.full_name[0]}</div>
      <div><div className="font-bold text-sm">{data.full_name}</div><div className="text-[11px] text-gray-500">{user?.email} • {data.band}</div></div>
    </div>
    <Link href="/login" className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold">Logout</Link>
   </div>

   <div className="grid md:grid-cols-3 gap-5">
    <div className="md:col-span-2 bg-white rounded-[24px] border overflow-hidden shadow-sm">
     <div className="p-6 border-b flex justify-between items-center">
       <div><div className="text-[10px] font-black text-gray-400 tracking-widest">FUNDING CLASSIFICATION 2026</div><h2 className="text-4xl font-black text-[#0a3d62] mt-2 tracking-tighter">{data.band}</h2></div>
       <div className="text-right"><div className="text-[10px] font-black text-gray-400">INCOME</div><div className="font-black text-[#0a3d62]">KSH {Number(data.income).toLocaleString()}</div></div>
     </div>
     <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0a3d62] text-white p-5 rounded-2xl text-center"><div className="text-3xl font-black">{info.sch}%</div><div className="text-[10px] opacity-70 mt-1 font-bold tracking-widest">SCHOLARSHIP</div></div>
        <div className="bg-gray-50 border p-5 rounded-2xl text-center"><div className="text-3xl font-black text-[#0a3d62]">{info.loan}%</div><div className="text-[10px] mt-1 font-bold tracking-widest text-gray-500">LOAN</div></div>
        <div className="bg-gray-50 border p-5 rounded-2xl text-center"><div className="text-3xl font-black text-[#0a3d62]">{info.family}%</div><div className="text-[10px] mt-1 font-bold tracking-widest text-gray-500">FAMILY</div></div>
      </div>

      <button onClick={generatePDF} disabled={downloading} className="w-full bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm hover:bg-black transition flex items-center justify-center gap-2">
        {downloading? "Generating PDF..." : "⬇ Download Official Letter (PDF)"}
      </button>

      <p className="text-[11px] text-center text-gray-400">✅ Instant download — No M-Pesa needed in test mode</p>
     </div>
    </div>

    <div className="bg-white rounded-2xl border p-5 h-fit">
      <h3 className="font-bold text-sm">Applicant Details</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{data.full_name}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-bold">{data.id_number}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{data.phone}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Band</span><span className="font-black text-[#0a3d62]">{data.band}</span></div>
      </div>
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-xl text-[11px] text-green-700">
        🎉 Your band has been classified successfully. Download and print for school.
      </div>
    </div>
   </div>
  </div>
 );
}