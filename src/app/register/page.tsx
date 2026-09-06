"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Register(){
 const [form,setForm]=useState({full_name:"",id_number:"",email:"",phone:"",income:""});
 const [loading,setLoading]=useState(false);
 const [msg,setMsg]=useState("");

 const submit=async(e:any)=>{
  e.preventDefault(); setLoading(true); setMsg("");
  const incomeNum=Number(form.income);
  let band="BAND 5"; if(incomeNum<=23000) band="BAND 1"; else if(incomeNum<=60000) band="BAND 2"; else if(incomeNum<=120000) band="BAND 3"; else if(incomeNum<=300000) band="BAND 4";
  const {error}=await supabase.from("registrations").insert([{...form,income:incomeNum,band}]);
  if(error){ setMsg("Error: "+error.message); } else { setMsg(`✅ Saved! You are ${band}. We will contact you.`); setForm({full_name:"",id_number:"",email:"",phone:"",income:""}); }
  setLoading(false);
 };

 return(
  <div className="max-w-md mx-auto p-4">
   <div className="bg-white p-6 rounded-2xl shadow border">
    <h1 className="text-2xl font-black text-[#0a3d62]">Create HEF Account</h1><p className="text-sm text-gray-500">Save your band & get updates</p>
    <form onSubmit={submit} className="mt-4 space-y-3">
     <input required placeholder="Full Name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required placeholder="ID Number" value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required placeholder="Phone (07...)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <input required type="number" placeholder="Monthly Income e.g 45000" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} className="w-full p-3 border rounded-lg"/>
     <button disabled={loading} className="w-full bg-[#0a3d62] text-white p-3 rounded-lg font-bold">{loading?"Saving...":"Save & Check My Band"}</button>
    </form>
    {msg && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">{msg}</div>}
   </div>
  </div>
 );
}