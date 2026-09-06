import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request){
 try{
  const body = await req.json().catch(()=> ({}));
  const phone = body.phone || "0758973109";
  const amount = body.amount || 50;

  const key = (process.env.MPESA_CONSUMER_KEY || "").trim();
  const secret = (process.env.MPESA_CONSUMER_SECRET || "").trim();
  const shortcode = (process.env.MPESA_SHORTCODE || "174379").trim();
  const passkey = (process.env.MPESA_PASSKEY || "").trim();
  const env = (process.env.MPESA_ENV || "sandbox").trim();

  if(!key || !secret || !passkey){
    return NextResponse.json({ error: "ENV missing in Vercel - Use Bypass for now", ResponseCode: 1 }, { status: 200 });
  }

  const baseUrl = env==="live"? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

  // Get token
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,{ headers:{ Authorization:`Basic ${auth}` } });
  const tokenText = await tokenRes.text();
  let tokenData: any;
  try{ tokenData = JSON.parse(tokenText); } catch{ tokenData = {}; }
  
  if(!tokenData.access_token){
    return NextResponse.json({ error: `Token failed: ${tokenText.slice(0,250)}`, ResponseCode: 1 }, { status: 200 });
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  let formattedPhone = phone.toString().replace(/^0/,"254").replace(/\+/,"");
  if(formattedPhone.startsWith("7")) formattedPhone="254"+formattedPhone;
  if(!formattedPhone.startsWith("254")) formattedPhone="254"+formattedPhone.replace(/^0+/,"");

  const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`,{
    method:"POST",
    headers:{ Authorization:`Bearer ${tokenData.access_token}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: shortcode==="174379" ? "CustomerPayBillOnline" : "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: "https://helb-band-checker.vercel.app/api/mpesa/callback",
      AccountReference: "HEF Band",
      TransactionDesc: "HEF Letter 50"
    })
  });
  const stkText = await stkRes.text();
  let stkData: any;
  try{ stkData = JSON.parse(stkText); } catch{ stkData = { ResponseCode:1, error: stkText.slice(0,300) }; }
  
  return NextResponse.json(stkData, { status: 200 });
 }catch(e:any){
  // NEVER return 500 - always return JSON so frontend doesn't get "Unexpected end of JSON"
  return NextResponse.json({ error: e.message || "Server error", ResponseCode: 1 }, { status: 200 });
 }
}