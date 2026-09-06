"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register(){
 const [form,setForm]=useState({full_name:"",id_number:"",email:"",phone:"",income:"",password:""});
 const [loading,setLoading]=useState(false);
 const [msg,setMsg]=useState("");
 const router=useRouter();

 const submit=async(e:any)=>{
  e.preventDefault(); setLoading(true); setMsg("");
  try{
   const incomeNum=Number(form.income);
   let band="BAND 5"; if(incomeNum<=23000) band="BAND 1"; else if(incomeNum<=60000) band="BAND 2"; else if(incomeNum<=120000) band="BAND 3"; else if(incomeNum<=300000) band="BAND 4";
   
   // 1. Create login account
   const { data: authData, error: authErr } = await supabase.auth.signUp({ email: form.email, password: form.password });
   if(authErr) throw authErr;
   
   // 2. Save to registrations
   const { error } = await supabase.from("registrations").insert([{ full_name: form.full_name, id_number: form.id_number, email: form.email, phone: form.phone, income: incomeNum, band, user_id: authData.user?.id }]);
   if(error) throw error;

   setMsg(`✅ Account created! You are ${band}. Redirecting to login...`);
   setTimeout(()=> router.push("/login"), 1500);
  }catch(err:any){ setMsg("Error: "+err.message); }
  setLoading(false);
 };

 return(
  <div className="max-w-md mx-auto p-4">
   <div className="bg-white p-6 rounded-2xl shadow border">
    <h1 className="text-2xl font-black text-[#0a3d62]">Create HEF Account</h1>
    <form onSubmit={submit} className="mt-4 space-y-3">
     <input required placeholder="Full Name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required placeholder="ID Number" value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required type="number" placeholder="Income e.g 45000" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required type="password" placeholder="Create Password (for login)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <button disabled={loading} className="w-full bg-[#0a3d62] text-white p-3 rounded-lg font-bold">{loading?"Creating...":"Create Account"}</button>
    </form>
    {msg && <div className="mt-4 p-3 bg-green-50 border rounded-lg text-sm">{msg}</div>}
    <div className="mt-4 text-center text-sm">Already have account? <Link href="/login" className="text-blue-600 font-bold">Login</Link></div>
   </div>
  </div>
 );
}