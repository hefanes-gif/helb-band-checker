"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState(""); const router=useRouter();
 const login=async(e:any)=>{
  e.preventDefault(); setLoading(true); setMsg("");
  const { error } = await supabase.auth.signInWithPassword({email,password});
  if(error) setMsg(error.message); else { router.push("/dashboard"); }
  setLoading(false);
 };
 return(
  <div className="max-w-md mx-auto p-4 mt-10">
   <div className="bg-white p-6 rounded-2xl shadow border">
    <h1 className="text-2xl font-black text-[#0a3d62]">Login to HEF Portal</h1>
    <form onSubmit={login} className="mt-4 space-y-3">
     <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded-lg"/>
     <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 border rounded-lg"/>
     <button disabled={loading} className="w-full bg-[#0a3d62] text-white p-3 rounded-lg font-bold">{loading?"Logging...":"Login"}</button>
    </form>
    {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
    <div className="mt-4 text-center text-sm">No account? <Link href="/register" className="font-bold text-blue-600">Register</Link></div>
   </div>
  </div>
 );
}