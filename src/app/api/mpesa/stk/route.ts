import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
 try{
  const { phone, amount } = await req.json();
  const key = (process.env.MPESA_CONSUMER_KEY || "").trim();
  const secret = (process.env.MPESA_CONSUMER_SECRET || "").trim();
  const shortcode = (process.env.MPESA_SHORTCODE || "174379").trim();
  const passkey = (process.env.MPESA_PASSKEY || "").trim();
  const env = (process.env.MPESA_ENV || "sandbox").trim().toLowerCase();

  if(!key || !secret || !passkey){
    return NextResponse.json({ ResponseCode:"1", error:`ENV missing in Vercel - Use Bypass for now. key=${!!key} secret=${!!secret} passkey=${!!passkey}` }, {status:200});
  }

  const base = env==="live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  // 1. TOKEN
  const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`,{
    headers:{ Authorization:`Basic ${auth}` }, cache:"no-store"
  });
  const tokenText = await tokenRes.text();
  let tokenJson:any={}; try{ tokenJson=JSON.parse(tokenText); }catch{ tokenJson={}; }

  if(!tokenJson.access_token){
    return NextResponse.json({ ResponseCode:"1", error:`Token failed: ${tokenText.slice(0,500)}` }, {status:200});
  }

  // 2. STK
  const timestamp = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  let cleanPhone = phone.toString().replace(/\D/g,""); if(cleanPhone.startsWith("0")) cleanPhone="254"+cleanPhone.slice(1); if(!cleanPhone.startsWith("254")) cleanPhone="254"+cleanPhone;

  const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`,{
    method:"POST",
    headers:{ Authorization:`Bearer ${tokenJson.access_token}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount || 50,
      PartyA: cleanPhone,
      PartyB: shortcode,
      PhoneNumber: cleanPhone,
      CallBackURL: `https://helb-band-checker.vercel.app/api/mpesa/callback`,
      AccountReference: `HEF-${Date.now()}`,
      TransactionDesc: "HEF Band Letter"
    })
  });
  const stkText = await stkRes.text();
  let stkJson:any={}; try{ stkJson=JSON.parse(stkText); }catch{ stkJson={ ResponseCode:"1", error: stkText.slice(0,500)}; }
  return NextResponse.json(stkJson, {status:200});

 }catch(e:any){
  return NextResponse.json({ ResponseCode:"1", error:`Server error: ${e.message}` }, {status:200});
 }
}