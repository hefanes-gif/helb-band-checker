"use client";
import { useState } from "react";
import Link from "next/link";
export default function Home() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState("");
  const checkBand = () => {
    const val = Number(income);
    if (!val) { setResult("Enter household income"); return; }
    if (val <= 23000) setResult("BAND 1: Full Scholarship + Full HELB Loan");
    else if (val <= 60000) setResult("BAND 2: 70% Scholarship + 30% Loan");
    else if (val <= 120000) setResult("BAND 3: 50% Scholarship + 50% Loan");
    else if (val <= 300000) setResult("BAND 4: 30% Scholarship + 70% Loan");
    else setResult("BAND 5: Full Loan Only");
  };
  return (
    <div style={{minHeight:"100vh", background:"#eef2f7", padding:20}}>
      <div style={{maxWidth:700, margin:"30px auto", background:"white", borderRadius:16, padding:24, boxShadow:"0 10px 30px rgba(0,0,0,0.1)"}}>
        <h1 style={{fontSize:26, fontWeight:800, color:"#0a3d62"}}>HEF Portal - Band Checker</h1>
        <p style={{color:"#666"}}>Check your Funding Band instantly</p>
        <div style={{marginTop:20, display:"flex", gap:10}}>
          <Link href="/register" style={{background:"#0a3d62", color:"white", padding:"8px 14px", borderRadius:8, textDecoration:"none"}}>Register</Link>
          <Link href="/calculator" style={{background:"#e67e22", color:"white", padding:"8px 14px", borderRadius:8, textDecoration:"none"}}>Calculator</Link>
        </div>
        <div style={{marginTop:24}}>
          <label style={{fontWeight:600}}>Household Income (KSH per month)</label>
          <input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 45000" style={{width:"100%", padding:"12px", marginTop:8, border:"1px solid #ccc", borderRadius:8}}/>
          <button onClick={checkBand} style={{width:"100%", marginTop:12, background:"#0a3d62", color:"white", padding:"12px", borderRadius:8, border:"none", fontWeight:700, cursor:"pointer"}}>CHECK MY BAND</button>
          {result && <div style={{marginTop:16, padding:14, background:"#dff9fb", borderRadius:8, fontWeight:700, color:"#0a3d62"}}>{result}</div>}
        </div>
      </div>
    </div>
  );
}
