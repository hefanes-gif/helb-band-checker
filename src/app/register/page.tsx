"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register(){
 const [form,setForm]=useState({full_name:"EVANS KIPLAA",id_number:"40553680",email:"kiplaaevoo@gmail.com",phone:"0758973109",income:"10000",password:"123456"});
 const [loading,setLoading]=useState(false);
 const [errorMsg,setErrorMsg]=useState("");
 const router=useRouter();

 const submit=async(e:any)=>{
  e.preventDefault(); setLoading(true); setErrorMsg("");
  try{
   console.log("Env URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
   if(!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("ENV VARS MISSING ON VERCEL! Add them in Vercel Settings");

   const v=Number(form.income);
   let band="BAND 5"; if(v<=23000) band="BAND 1"; else if(v<=60000) band="BAND 2"; else if(v<=120000) band="BAND 3"; else if(v<=300000) band="BAND 4";

   const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
   if(error) throw error;

   const { error: insertError } = await supabase.from("registrations").insert([{ full_name: form.full_name, id_number: form.id_number, email: form.email, phone: form.phone, income: v, band }]);
   if(insertError) throw insertError;

   router.push("/login");
  }catch(err:any){
   setErrorMsg(err.message || JSON.stringify(err));
   console.error(err);
  }finally{ setLoading(false); }
 };

 return (
  <div className="max-w-md mx-auto bg-white rounded-[28px] border shadow-sm p-8">
   <h1 className="text-3xl font-black">Create Account</h1>
   {errorMsg && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl break-all">{errorMsg}</div>}
   <form onSubmit={submit} className="mt-8 space-y-3">
    <input required value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="w-full p-4 bg-gray-50 border-2 rounded-xl text-sm font-bold"/>
    <div className="grid grid-cols-2 gap-3"><input required value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} className="p-4 bg-gray-50 border-2 rounded-xl text-sm font-bold"/><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="p-4 bg-gray-50 border-2 rounded-xl text-sm font-bold"/></div>
    <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-4 bg-gray-50 border-2 rounded-xl text-sm font-bold"/>
    <input required type="number" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} className="w-full p-4 bg-gray-50 border-2 rounded-xl text-sm font-bold"/>
    <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full p-4 bg-blue-50 border-2 rounded-xl text-sm font-bold"/>
    <button disabled={loading} className="w-full bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm">{loading?"Creating...":"Create Account →"}</button>
   </form>
   <div className="text-center text-xs mt-4 text-gray-500">Already have account? <Link href="/login" className="font-bold text-[#0a3d62]">Login</Link></div>
  </div>
 );
}