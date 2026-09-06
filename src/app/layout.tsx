import "./globals.css";
export const metadata = { title: "HEF Portal - Band Checker", description: "Check your HEF Band" };
export default function RootLayout({children}:{children:React.ReactNode}){
 return(
  <html lang="en">
   <body className="bg-[#f1f5f9] min-h-screen">
    <header className="bg-[#0a3d62] text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
     <h1 className="font-black text-lg tracking-wide">HEF PORTAL</h1>
     <div className="text-xs opacity-80">Higher Education Financing</div>
    </header>
    {children}
    <footer className="text-center text-xs text-gray-500 py-6 mt-10">© 2026 HEF Band Checker • Not affiliated with Government</footer>
   </body>
  </html>
 );
}