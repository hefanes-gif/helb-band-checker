"use client";
import { useState } from "react";
export default function Calc(){
 const [cost,setCost]=useState(120000);
 const [income,setIncome]=useState("");
 const [res,setRes]=useState<any>(null);
 const calc=()=>{
  const v=Number(income); if(!v) return;
  let b={sch:30,loan:30,fam:40,name:"BAND 5"};
  if(v<=23000) b={sch:70,loan:25,fam:5,name:"BAND 1"};
  else if(v<=60000) b={sch:60,loan:30,fam:10,name:"BAND 2"};
  else if(v<=120000) b={sch:50,loan:30,fam:20,name:"BAND 3"};
  else if(v<=300000) b={sch:40,loan:30,fam:30,name:"BAND 4"};
  setRes({...b, schAmt: cost*b.sch/100, loanAmt: cost*b.loan/100, famAmt: cost*b.fam/100});
 };
 return(
  <div className="max-w-2xl mx-auto p-6">
   <div className="bg-white p-6 rounded-2xl shadow border">
    <h1 className="text-2xl font-black text-[#0a3d62]">Loan & Scholarship Calculator</h1>
    <label className="block mt-4 text-sm font-bold">Annual Program Cost (KSH)</label>
    <input type="number" value={cost} onChange={e=>setCost(Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1"/>
    <label className="block mt-4 text-sm font-bold">Monthly Household Income</label>
    <input type="number" value={income} onChange={e=>setIncome(e.target.value)} placeholder="45000" className="w-full p-3 border rounded-lg mt-1"/>
    <button onClick={calc} className="w-full mt-4 bg-[#0a3d62] text-white p-3 rounded-lg font-bold">CALCULATE</button>
    {res && (
     <div className="mt-6 border-t pt-4">
      <div className="font-black text-lg">{res.name}</div>
      <div className="mt-3 space-y-2 text-sm">
       <div className="flex justify-between"><span>Scholarship ({res.sch}%)</span><span className="font-bold">KSH {res.schAmt.toLocaleString()}</span></div>
       <div className="flex justify-between"><span>HELB Loan ({res.loan}%)</span><span className="font-bold">KSH {res.loanAmt.toLocaleString()}</span></div>
       <div className="flex justify-between"><span>Family Contribution ({res.fam}%)</span><span className="font-bold text-orange-600">KSH {res.famAmt.toLocaleString()}</span></div>
      </div>
     </div>
    )}
   </div>
  </div>
 );
}