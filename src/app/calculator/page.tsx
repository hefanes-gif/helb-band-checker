"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
export default function Calculator(){
  const [income,setIncome]=useState(35000); const [result,setResult]=useState<any>(null);
  useEffect(()=>{ if(!localStorage.getItem("hef_session")) window.location.href="/"; },[]);
  const checkBand=()=>{
    let band=1, scholarship=70, loan=25, family=5, label="Vulnerable";
    if(income>15000){ band=2; scholarship=60; loan=30; family=10; label="Extremely Needy"; }
    if(income>45000){ band=3; scholarship=50; loan=30; family=20; label="Needy"; }
    if(income>80000){ band=4; scholarship=40; loan=30; family=30; label="Less Needy"; }
    if(income>120000){ band=5; scholarship=30; loan=30; family=40; label="Able"; }
    setResult({band, scholarship, loan, family, label});
  }
  return (<div><div style={{background:"#1565c0", color:"#fff", padding:"12px 20px", display:"flex", justifyContent:"space-between"}}><b>HEF BAND CHECKER</b><span style={{cursor:"pointer"}} onClick={()=>{localStorage.removeItem("hef_session"); window.location.href="/";}}>Logout</span></div>
  <div style={{display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap", marginTop:40}}>
    <div style={{background:"#fff", width:400, padding:20, borderRadius:8}}><h3>Calculate Your Band</h3><p style={{fontSize:13, color:"#666"}}>Move slider for family income</p>
      <input type="range" min="0" max="200000" step="1000" value={income} onChange={e=>setIncome(Number(e.target.value))} style={{width:"100%"}}/>
      <h2>KES {income.toLocaleString()}</h2><input type="number" value={income} onChange={e=>setIncome(Number(e.target.value))} style={{width:"100%", padding:10, border:"1px solid #ccc"}}/>
      <button onClick={checkBand} style={{width:"100%", marginTop:12, padding:12, background:"#1565c0", color:"#fff", border:"none", fontWeight:700, borderRadius:4}}>CHECK MY BAND</button></div>
    {result && <div style={{background:"#fff", width:400, padding:20, borderRadius:8, borderLeft:`6px solid ${result.band<=2?"#2e7d32":result.band==3?"#f9a825":"#c62828"}`}}><h1 style={{margin:0}}>BAND {result.band}</h1><p style={{color:"#666"}}>{result.label}</p><div style={{background:"#f5f5f5", padding:12, marginTop:10, lineHeight:1.8}}>
      <div>🎓 Scholarship: <b>{result.scholarship}%</b></div><div>💰 HELB Loan: <b>{result.loan}%</b></div><div>👨‍👩‍👧 Household: <b>{result.family}%</b></div><div style={{borderTop:"1px solid #ddd", marginTop:8, paddingTop:8}}>Total Support: <b>{result.scholarship+result.loan}%</b></div></div></div>}
  </div></div>)
}