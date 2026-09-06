import { NextResponse } from "next/server";

async function getToken(){
 const key = process.env.MPESA_CONSUMER_KEY!;
 const secret = process.env.MPESA_CONSUMER_SECRET!;
 const auth = Buffer.from(`${key}:${secret}`).toString("base64");
 const env = process.env.MPESA_ENV === "live" ? "api" : "sandbox";
 const res = await fetch(`https://${env}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,{
  headers: { Authorization: `Basic ${auth}` }
 });
 const data = await res.json();
 return data.access_token;
}

export async function POST(req: Request){
 try{
  const { phone, amount } = await req.json();
  let formattedPhone = phone.replace(/^0/,"254").replace(/[^0-9]/g,"");
  if(formattedPhone.startsWith("7")) formattedPhone = "254"+formattedPhone;

  const token = await getToken();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const env = process.env.MPESA_ENV === "live" ? "api" : "sandbox";
  const callbackUrl = `https://helb-band-checker.vercel.app/api/mpesa/callback`;

  const payload = {
   BusinessShortCode: shortcode,
   Password: password,
   Timestamp: timestamp,
   TransactionType: "CustomerPayBillOnline",
   Amount: amount || 50,
   PartyA: formattedPhone,
   PartyB: shortcode,
   PhoneNumber: formattedPhone,
   CallBackURL: callbackUrl,
   AccountReference: "HEF BAND",
   TransactionDesc: "HEF Official Letter"
  };

  const res = await fetch(`https://${env}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,{
   method:"POST",
   headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
   body: JSON.stringify(payload)
  });

  const data = await res.json();
  return NextResponse.json(data);
 } catch(e:any){
  return NextResponse.json({ error: e.message }, { status: 500 });
 }
}