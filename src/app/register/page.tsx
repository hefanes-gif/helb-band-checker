"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register(){
 const [form,setForm]=useState({full_name:"",id_number:"",email:"",phone:"",income:""}); const [loading,setLoading]=useState(false); const router=useRouter();
 const submit=async(e:any)=>{ e.preventDefault(); setLoading(true);
  const v=Number(form.income); let band="BAND 5"; if(v<=23000) band="BAND 1"; else if(v<=60000) band="BAND 2"; else if(v<=120000) band="BAND 3"; else if(v<=300000) band="BAND 4";
  const {error}=await supabase.from("registrations").insert([{...form,income:v,band}]); if(!error){ router.push("/login"); } setLoading(false);
 };
 return (
  <div className="max-w-md mx-auto bg-white rounded-[28px] border shadow-sm p-8">
   <h1 className="text-3xl font-black tracking-tighter">Create Account</h1><p className="text-sm text-gray-500 mt-2">Save your band & download official letter.</p>
   <form onSubmit={submit} className="mt-8 space-y-3">
    <input required placeholder="Full Name (ID Names)" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-[#0a3d62] text-sm font-bold"/>
    <div className="grid grid-cols-2 gap-3"><input required placeholder="ID Number" value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold"/><input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold"/></div>
    <input required type="email" placeholder="Email Address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold"/>
    <input required type="number" placeholder="Monthly Income (KSH)" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold"/>
    <button disabled={loading} className="w-full bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm mt-2 hover:bg-black">{loading?"Saving...":"Create Account →"}</button>
   </form>
   <div className="text-center text-xs mt-4 text-gray-500">Already have account? <Link href="/login" className="font-bold text-[#0a3d62]">Login</Link></div>
  </div>
 );
}