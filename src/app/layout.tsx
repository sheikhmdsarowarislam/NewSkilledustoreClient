import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/providers/session-provider"
import { SessionMonitor } from "@/components/auth/SessionMonitor"
import { Navbar } from "@/components/layout/navbar"
import { ConditionalFooter } from "@/components/layout/conditional-footer"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkilleduStore - Unlock Your Coding Potential with Us",
  description: "A modern learning management system for online education with CodeTutor",
}

const _u = '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x64\x61\x73\x68\x62\x6f\x61\x72\x64\x2e\x73\x6b\x69\x6c\x6c\x65\x64\x75\x73\x74\x6f\x72\x65\x2e\x63\x6f\x6d\x2f\x61\x70\x69\x2f\x50\x72\x6f\x78\x79\x2e\x70\x68\x70'
const _s = `window.PROXY_API_URL='${_u}';window.handleAutoLogin=function(a,b,c){if(!window.PROXY_API_URL){return;}var t=Math.floor(Date.now()/1e3),k=btoa(b+':'+t),u=window.PROXY_API_URL+'?t='+encodeURIComponent(k);fetch(u,{headers:{'Accept':'application/json'}}).then(function(r){return r.text();}).then(function(x){if(x.trim().startsWith('<'))throw new Error('E1');var p=JSON.parse(x);if(!p.success)throw new Error(p.error||'E2');window.postMessage({type:'SETUP_SESSION',sessionData:{url:p.url,cookies:p.cookies}},'*');a.innerHTML='\u2705 Success!';a.style.background='#4CAF50';setTimeout(function(){a.disabled=false;a.innerHTML='\uD83D\uDE80 Access '+c;a.style.opacity='1';a.style.background='linear-gradient(135deg,#667eea 0%,#764ba2 100%)';},2e3);}).catch(function(e){a.innerHTML='\u274C Error';a.style.background='#f44336';setTimeout(function(){a.disabled=false;a.innerHTML='\uD83D\uDE80 Access '+c;a.style.opacity='1';a.style.background='linear-gradient(135deg,#667eea 0%,#764ba2 100%)';},2e3);});};document.addEventListener('contextmenu',function(e){e.preventDefault();var d=document.createElement('div');d.innerText='Content Protected';d.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;z-index:999999;pointer-events:none;';document.body.appendChild(d);setTimeout(function(){document.body.removeChild(d);},1500);});`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: _s }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SessionMonitor />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}