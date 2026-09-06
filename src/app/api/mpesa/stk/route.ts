import { NextResponse } from "next/server";

export async function POST(req: Request){
 try{
  const { phone, amount } = await req.json();
  const key = process.env.MPESA_CONSUMER_KEY!.trim();
  const secret = process.env.MPESA_CONSUMER_SECRET!.trim();
  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const passkey = process.env.MPESA_PASSKEY!.trim();
  const env = process.env.MPESA_ENV || "sandbox";

  const baseUrl = env==="live"? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

  // Get token
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,{ headers:{ Authorization:`Basic ${auth}` } });
  const tokenData = await tokenRes.json();
  if(!tokenData.access_token){
    return NextResponse.json({ error:`Token failed: ${JSON.stringify(tokenData).slice(0,200)}` }, {status:500});
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  let formattedPhone = phone.replace(/^0/,"254").replace(/\+/,"");
  if(formattedPhone.startsWith("7")) formattedPhone="254"+formattedPhone;

  const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`,{
    method:"POST",
    headers:{ Authorization:`Bearer ${tokenData.access_token}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: env==="live"? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: "https://helb-band-checker.vercel.app/api/mpesa/callback",
      AccountReference: "HEF Band",
      TransactionDesc: "HEF Letter"
    })
  });
  const stkData = await stkRes.json();
  return NextResponse.json(stkData);
 }catch(e:any){
  return NextResponse.json({ error:e.message }, {status:500});
 }
}