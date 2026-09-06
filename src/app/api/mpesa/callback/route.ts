import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request){
 const body = await req.json();
 console.log("MPESA CALLBACK", JSON.stringify(body));

 const result = body?.Body?.stkCallback;
 if(result?.ResultCode === 0){
  // Payment success - you can save to DB
  const metadata = result.CallbackMetadata?.Item;
  const amount = metadata?.find((x:any)=>x.Name==="Amount")?.Value;
  const phone = metadata?.find((x:any)=>x.Name==="PhoneNumber")?.Value;
  // Optional: save payment
  await supabase.from("payments").insert([{ phone, amount, status:"paid", raw: body }]);
 }
 return NextResponse.json({ ok:true });
}