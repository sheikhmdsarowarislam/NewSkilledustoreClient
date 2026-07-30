import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { SessionMonitor } from "@/components/auth/SessionMonitor";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Group Buy SEO Tools - Access Premium Marketing Tools",
  description: "Get affordable access to top-rated SEO tools, keyword research software, backlink checkers, and digital marketing tools.",
  keywords: [
    "group buy seo tools",
    "seo tools",
    "digital marketing tools",
    "keyword research tool",
    "backlink checker",
    "seo software"
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const minifiedScript = `window.isAccessSessionProcessing=false;window.handleSecureLogin=async function(e,t,n){if(window.isAccessSessionProcessing)return;window.isAccessSessionProcessing=!0;var s=e.innerHTML;e.disabled=!0,e.style.opacity="0.7",e.innerHTML="⏳ Processing...";try{var o=await fetch("/api/access-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t})}),a=await o.json();if(!a.success)throw Error(a.error||"Session Error");window.postMessage({type:"SETUP_SESSION",sessionData:{url:a.url,cookies:a.cookies}},"*"),e.innerHTML=" Success!",e.style.background="#4CAF50",setTimeout(function(){e.disabled=!1,e.innerHTML=s,e.style.opacity="1",e.style.background="linear-gradient(135deg,#667eea 0%,#764ba2 100%)",window.isAccessSessionProcessing=!1},2e3)}catch(c){console.error("Login Error:",c),e.innerHTML=" Error",e.style.background="#f44336",setTimeout(function(){e.disabled=!1,e.innerHTML=s,e.style.opacity="1",e.style.background="linear-gradient(135deg,#667eea 0%,#764ba2 100%)",window.isAccessSessionProcessing=!1},2e3)}};window.handleAutoLogin=window.handleSecureLogin;document.addEventListener("contextmenu",function(e){e.preventDefault();var t=document.createElement("div");t.innerText="Content Protected",t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;z-index:999999;pointer-events:none;",document.body.appendChild(t),setTimeout(function(){document.body.contains(t)&&document.body.removeChild(t)},1500)});`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: minifiedScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SessionMonitor/>
          <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-1">
              {children}
            </main>
            <ConditionalFooter/>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}