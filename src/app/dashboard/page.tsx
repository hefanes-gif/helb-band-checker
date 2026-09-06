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

 return(
  <div className="max-w-3xl mx-auto space-y-6">
   {/* Header Card */}
   <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border overflow-hidden">
    <div className="bg-[#0a3d62] p-6 md:p-8 text-white flex justify-between items-center">
     <div>
      <h1 className="text-2xl md:text-3xl font-black leading-none">Student Dashboard</h1>
      <p className="text-xs md:text-sm opacity-60 mt-2">Welcome back, <span className="font-bold text-white">{data?.full_name || user.email}</span></p>
     </div>
     <button onClick={logout} className="bg-white/10 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-xs font-black tracking-widest transition">LOGOUT</button>
    </div>

    {data? (
     <div className="p-6 md:p-8">
      {/* BAND CARD */}
      <div className={`bg-gradient-to-br ${info?.color || "from-[#0a3d62] to-[#1e6fa8]"} text-white p-7 rounded-[20px] shadow-xl relative overflow-hidden`}>
       <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
       <div className="relative flex justify-between items-start">
        <div>
         <div className="text-[11px] tracking-[0.2em] opacity-70 font-black">YOUR FUNDING BAND • 2026</div>
         <div className="text-6xl font-black mt-3 tracking-tighter">{data.band}</div>
         <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold">
          <span>Income: KSH {Number(data.income).toLocaleString()}</span>
         </div>
        </div>
        <div className="w-20 h-20 bg-white/15 backdrop-blur rounded-[20px] flex items-center justify-center text-4xl border border-white/20">🎓</div>
       </div>

       {/* Breakdown */}
       {info && (
        <div className="grid grid-cols-3 gap-3 mt-8">
         <div className="bg-white text-[#0a3d62] p-4 rounded-2xl text-center"><div className="text-3xl font-black">{info.sch}%</div><div className="text-[10px] font-black tracking-widest mt-1">SCHOLARSHIP</div></div>
         <div className="bg-white/15 backdrop-blur border border-white/20 p-4 rounded-2xl text-center"><div className="text-3xl font-black">{info.loan}%</div><div className="text-[10px] font-black tracking-widest mt-1">LOAN</div></div>
         <div className="bg-white/15 backdrop-blur border border-white/20 p-4 rounded-2xl text-center"><div className="text-3xl font-black">{info.family}%</div><div className="text-[10px] font-black tracking-widest mt-1">FAMILY</div></div>
        </div>
       )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
       {[
        {label:"Full Name", value:data.full_name, icon:"👤"},
        {label:"ID Number", value:data.id_number, icon:"🪪"},
        {label:"Email Address", value:data.email, icon:"✉️"},
        {label:"Phone Number", value:data.phone, icon:"📱"},
       ].map((item)=>(
        <div key={item.label} className="p-5 border-2 border-gray-100 rounded-[18px] hover:border-[#0a3d62]/20 transition group">
         <div className="flex items-center gap-2"><span className="text-lg">{item.icon}</span><span className="text-[10px] font-black tracking-widest text-gray-400 group-hover:text-[#0a3d62]">{item.label.toUpperCase()}</span></div>
         <div className="font-bold text-[#0a3d62] mt-2 text-[15px] break-all">{item.value}</div>
        </div>
       ))}
      </div>

      {/* Action */}
      <div className="mt-8 flex gap-3">
       <Link href="/calculator" className="flex-1 text-center bg-[#0a3d62] text-white py-4 rounded-2xl font-black text-sm hover:bg-black transition">RECALCULATE BAND</Link>
       <Link href="/" className="flex-1 text-center bg-gray-100 text-[#0a3d62] py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition">HOME</Link>
      </div>
     </div>
    ) : (
     <div className="p-12 text-center"><div className="text-gray-400 text-sm">No registration data found for {user.email}</div><Link href="/register" className="mt-4 inline-block bg-[#0a3d62] text-white px-6 py-2 rounded-full text-sm font-bold">Complete Registration</Link></div>
    )}
   </div>

   <div className="text-center text-[11px] text-gray-400">🔒 Secured by Supabase • Your data is encrypted</div>
  </div>
 );
}