"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const router=useRouter();
 const login=async(e:any)=>{ e.preventDefault(); setLoading(true); const {error}=await supabase.auth.signInWithPassword({email,password}); if(!error) router.push("/dashboard"); else alert(error.message); setLoading(false); };
 return (
  <div className="max-w-md mx-auto bg-white rounded-[28px] border shadow-sm p-8">
   <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1><p className="text-sm text-gray-500 mt-2">Login to access your funding band.</p>
   <form onSubmit={login} className="mt-8 space-y-3">
    <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-[#0a3d62] text-sm font-bold"/>
    <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-[#0a3d62] text-sm font-bold"/>
    <button disabled={loading} className="w-full bg-[#0a3d62] text-white py-4 rounded-xl font-black text-sm mt-2 hover:bg-black">{loading?"Logging in...":"Login →"}</button>
   </form>
   <div className="text-center text-xs mt-4 text-gray-500">No account? <Link href="/register" className="font-bold text-[#0a3d62]">Register Free</Link></div>
  </div>
 );
}