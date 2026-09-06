import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata = { title: "HEF Portal - Band Checker 2026", description: "Check your HEF Funding Band" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en"><body className="bg-[#f4f6f8] min-h-screen">
   <Navbar/>
   <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
   <footer className="mt-20 border-t bg-white py-6 text-center text-[11px] text-gray-500">
    © 2026 HEF Band Checker • Independent tool to help students • Not affiliated with Ministry of Education • Your data is secured by Supabase
   </footer>
  </body></html>
 );
}