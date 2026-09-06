import { NextResponse } from "next/server";

async function getToken(){
 const key = (process.env.MPESA_CONSUMER_KEY || "").trim().replace(/\s/g,"");
 const secret = (process.env.MPESA_CONSUMER_SECRET || "").trim().replace(/\s/g,"");
 const auth = Buffer.from(`${key}:${secret}`).toString("base64");
 const env = process.env.MPESA_ENV === "live" ? "api" : "sandbox";
 const res = await fetch(`https://${env}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,{
  headers: { Authorization: `Basic ${auth}` },
  cache: "no-store"
 });
 const text = await res.text();
 try { return JSON.parse(text).access_token; }
 catch { throw new Error("Token failed: "+text.slice(0,200)); }
}

export async function POST(req: Request){
 try{
  const { phone } = await req.json();
  let f = (phone || "").replace(/^0/,"254").replace(/\D/g,"");
  if(f.startsWith("7")) f="254"+f;

  const token = await getToken();
  const shortcode = (process.env.MPESA_SHORTCODE || "").trim();
  const passkey = (process.env.MPESA_PASSKEY || "").trim();
  const ts = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);
  const pwd = Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");

  const env = process.env.MPESA_ENV === "live" ? "api" : "sandbox";

  const res = await fetch(`https://${env}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,{
   method:"POST",
   headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
   body: JSON.stringify({
    BusinessShortCode: shortcode,
    Password: pwd,
    Timestamp: ts,
    TransactionType: "CustomerBuyGoodsOnline",
    Amount: 1,
    PartyA: f,
    PartyB: shortcode,
    PhoneNumber: f,
    CallBackURL: "https://helb-band-checker.vercel.app/api/mpesa/callback",
    AccountReference: "HEF",
    TransactionDesc: "HEF Letter"
   })
  });

  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = { raw, error: "Safaricom returned non-JSON", details: raw.slice(0,500) }; }

  return NextResponse.json(data);
 }catch(e:any){ 
  return NextResponse.json({ error: e.message }, { status: 500 }); 
 }
}