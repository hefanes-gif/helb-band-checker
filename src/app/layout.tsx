import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "HEF Band Checker 2026 | Official MTI Calculator",
 description: "Check your HEF Funding Band in 5 seconds. Official 2026 MTI Model.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en">
   <body className="bg-[#f6f8fb] text-[#0a3d62] antialiased">
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
     <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between">
      <div className="flex items-center gap-2.5"><div className="w-9 h-9 bg-[#0a3d62] rounded-xl flex items-center justify-center text-white font-black text-sm">H</div><span className="font-black tracking-tighter text-[18px]">HEF <span className="font-light opacity-60">BANDS</span></span><span className="ml-2 hidden md:inline-flex text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">● LIVE 2026</span></div>
      <div className="flex items-center gap-2"><a href="/calculator" className="text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100">Calculator</a><a href="/login" className="text-xs font-bold bg-[#0a3d62] text-white px-5 py-2.5 rounded-full hover:bg-black transition">Dashboard</a></div>
     </div>
    </nav>
    <main className="max-w-6xl mx-auto px-6 py-8 md:py-12">{children}</main>
    <footer className="mt-10 border-t bg-white"><div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-3 text-[11px] text-gray-500"><span>© 2026 HEF Bands — Not affiliated with Government. For information only.</span><span>helb-band-checker.vercel.app • Built by Evans</span></div></footer>
   </body>
  </html>
 );
}