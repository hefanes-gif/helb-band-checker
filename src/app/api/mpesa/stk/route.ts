import { NextResponse } from "next/server";

export async function POST(req: Request){
 try{
  const { phone } = await req.json();
  // In test mode we just simulate success to allow download
  // When you get LIVE keys for Till 8629094, we will enable real STK
  return NextResponse.json({ 
    ResponseCode: "0", 
    message: "Test mode success - download allowed",
    phone
  });
 }catch(e:any){ 
  return NextResponse.json({ ResponseCode: "0", message: "Bypass mode" }); 
 }
}