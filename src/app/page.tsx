"use client";
import { useState } from "react";
import Link from "next/link";

const bands = [
 { max: 23000, name: "BAND 1", sch: 70, loan: 25, family: 5, desc: "Most Vulnerable" },
 { max: 60000, name: "BAND 2", sch: 60, loan: 30, family: 10, desc: "Very Needy" },
 { max: 120000, name: "BAND 3", sch: 50, loan: 30, family: 20, desc: "Needy" },
 { max: 300000, name: "BAND 4", sch: 40, loan: 30, family: 30, desc: "Less Needy" },
 { max: Infinity, name: "BAND 5", sch: 30, loan: 30, family: 40, desc: "Able" },
];

export default function Home() {
 const [income, setIncome] = useState("");
 const [band, setBand] = useState<any>(null);

 const check = () => {
  const v = Number(income);
  if (!v) return;
  const b = bands.find(b => v <= b.max);
  setBand({ ...b, income: v });
 };

 return (
  <div className="max-w-4xl mx-auto p-4 md:p-8">
   <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border">
    <h2 className="text-3xl font-extrabold text-[#0a3d62]">HEF Portal - Band Checker</h2>
    <p className="text-gray-500 mt-2">Enter your family income to know your funding band instantly.</p>
    
    <div className="flex gap-2 mt-5">
     <Link href="/register" className="bg-[#0a3d62] text-white px-5 py-2 rounded-lg font-bold text-sm">Register</Link>
     <Link href="/calculator" className="bg-[#e67e22] text-white px-5 py-2 rounded-lg font-bold text-sm">Calculator</Link>
     <Link href="/login" className="bg-white border px-5 py-2 rounded-lg font-bold text-sm">Login</Link>
    </div>

    <div className="mt-8 bg-slate-50 p-4 rounded-xl border">
     <label className="font-bold text-sm">Household Income per Month (KSH)</label>
     <div className="flex gap-2 mt-2">
      <input value={income} onChange={e=>setIncome(e.target.value)} type="number" placeholder="e.g 45000" className="flex-1 p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[#0a3d62]"/>
      <button onClick={check} className="bg-[#0a3d62] text-white px-8 rounded-lg font-black">CHECK</button>
     </div>
    </div>

    {band && (
     <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-[#0a3d62] to-[#1e6fa8] text-white">
      <div className="text-sm opacity-80">{band.desc}</div>
      <div className="text-3xl font-black mt-1">{band.name}</div>
      <div className="grid grid-cols-3 gap-3 mt-4">
       <div className="bg-white/15 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.sch}%</div><div className="text-xs">Scholarship</div></div>
       <div className="bg-white/15 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.loan}%</div><div className="text-xs">HELB Loan</div></div>
       <div className="bg-white/15 p-3 rounded-lg text-center"><div className="text-2xl font-black">{band.family}%</div><div className="text-xs">Family Pays</div></div>
      </div>
      <div className="mt-4 text-xs opacity-80">For income KSH {band.income.toLocaleString()}</div>
     </div>
    )}
   </div>

   <div className="grid md:grid-cols-2 gap-4 mt-6">
    <div className="bg-white p-5 rounded-xl border"><h3 className="font-bold">How Bands Work</h3><p className="text-sm text-gray-500 mt-2">Government uses Means Testing Instrument (MTI) to place you in Band 1-5 based on family income, education level of parents, and family size.</p></div>
    <div className="bg-white p-5 rounded-xl border"><h3 className="font-bold">What You Get</h3><p className="text-sm text-gray-500 mt-2">Band 1 gets 100% funding, Band 5 gets 60% funding. The rest is paid by family. All bands get upkeep allowance.</p></div>
   </div>
  </div>
 );
}