"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard(){
 const [user,setUser]=useState<any>(null); const [data,setData]=useState<any>(null); const router=useRouter();
 useEffect(()=>{
  supabase.auth.getUser().then(async({data})=>{
   if(!data.user) router.push("/login"); else { setUser(data.user); const {data:reg}=await supabase.from("registrations").select("*").eq("email", data.user.email).single(); setData(reg); }
  });
 },[]);
 const logout=async()=>{ await supabase.auth.signOut(); router.push("/login"); };
 if(!user) return <div className="p-10 text-center">Loading...</div>;
 return(
  <div className="max-w-3xl mx-auto p-4">
   <div className="bg-white rounded-2xl shadow p-6 border">
    <div className="flex justify-between items-center"><h1 className="text-2xl font-black text-[#0a3d62]">Student Dashboard</h1><button onClick={logout} className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg">Logout</button></div>
    {data ? (<div className="mt-6"><div className="bg-[#0a3d62] text-white p-5 rounded-xl"><div className="text-sm opacity-80">YOUR BAND</div><div className="text-4xl font-black mt-1">{data.band}</div><div className="text-sm mt-2">Income: KSH {data.income?.toLocaleString()}</div></div><div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="p-3 border rounded-lg">Name: <b>{data.full_name}</b></div><div className="p-3 border rounded-lg">ID: <b>{data.id_number}</b></div><div className="p-3 border rounded-lg">Email: <b>{data.email}</b></div><div className="p-3 border rounded-lg">Phone: <b>{data.phone}</b></div></div></div>) : (<div className="mt-6 text-gray-500">No registration found for {user.email}</div>)}
   </div>
  </div>
 );
}