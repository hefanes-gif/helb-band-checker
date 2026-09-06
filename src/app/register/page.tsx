"use client"
import { useState } from "react"
import Link from "next/link"
export default function RegisterPage(){
  const [f,setF]=useState({id:"", email:"", full:"", pass:""});
  const handleReg=(e:any)=>{
    e.preventDefault();
    const users=JSON.parse(localStorage.getItem("hef_users")||"[]");
    if(users.find((u:any)=>u.id===f.id)){ alert("ID already registered"); return; }
    users.push(f); localStorage.setItem("hef_users", JSON.stringify(users));
    alert("Success! Login now"); window.location.href="/";
  }
  return (<div><div style={{background:"#1565c0", color:"#fff", padding:"12px 20px", fontWeight:800}}>HEF PORTAL</div>
  <div style={{display:"flex", justifyContent:"center", marginTop:40}}><form onSubmit={handleReg} style={{background:"#fff", width:420, padding:22, borderRadius:6, display:"flex", flexDirection:"column", gap:12}}>
    <h3>Create HEF Account</h3><input placeholder="National ID" value={f.id} onChange={e=>setF({...f,id:e.target.value})} style={{padding:11, border:"1px solid #ccc"}} required/>
    <input placeholder="Full Name" value={f.full} onChange={e=>setF({...f,full:e.target.value})} style={{padding:11, border:"1px solid #ccc"}} required/>
    <input placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} style={{padding:11, border:"1px solid #ccc"}} required/>
    <input type="password" placeholder="Password" value={f.pass} onChange={e=>setF({...f,pass:e.target.value})} style={{padding:11, border:"1px solid #ccc"}} required/>
    <button style={{padding:11, background:"#2e7d32", color:"#fff", border:"none", fontWeight:700}}>Register</button>
    <Link href="/" style={{textAlign:"center", color:"#1565c0"}}>Already have account? Login</Link></form></div></div>)
}