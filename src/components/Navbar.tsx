import Link from "next/link";
export default function Navbar(){
 return(
  <header className="sticky top-0 z-50 bg-[#0a3d62] text-white border-b-4 border-[#f5a623]">
   <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    <Link href="/" className="flex items-center gap-2">
     <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#0a3d62] font-black">H</div>
     <div><div className="font-black leading-none">HEF PORTAL</div><div className="text-[10px] opacity-70 tracking-widest">KENYA • 2026</div></div>
    </Link>
    <nav className="flex gap-3 text-xs font-bold">
     <Link href="/" className="opacity-80 hover:opacity-100">BAND CHECKER</Link>
     <Link href="/calculator" className="opacity-80 hover:opacity-100">CALCULATOR</Link>
     <Link href="/login" className="bg-white text-[#0a3d62] px-4 py-1.5 rounded-full">LOGIN</Link>
    </nav>
   </div>
  </header>
 );
}