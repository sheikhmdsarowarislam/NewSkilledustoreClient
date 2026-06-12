import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/providers/session-provider"
import { SessionMonitor } from "@/components/auth/SessionMonitor"
import { Navbar } from "@/components/layout/navbar"
import { ConditionalFooter } from "@/components/layout/conditional-footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SkilleduStore - Unlock Your Coding Potential with Us",
  description: "A modern learning management system for online education with CodeTutor",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.PROXY_API_URL = 'https://dashboard.skilledustore.com/api/Proxy.php';

              window.handleAutoLogin = function(buttonElement, cookieId, targetDomain) {
                if (!window.PROXY_API_URL) {
                  console.error("PROXY_API_URL is not set!");
                  return;
                }

                const ts = Math.floor(Date.now() / 1000);
                const token = btoa(cookieId + ':' + ts);
                const fullApiUrl = window.PROXY_API_URL + '?t=' + encodeURIComponent(token);

                fetch(fullApiUrl, { headers: { 'Accept': 'application/json' } })
                  .then(r => r.text())
                  .then(t => {
                    if (t.trim().startsWith('<')) throw new Error('API Error: HTML received instead of JSON.');
                    const d = JSON.parse(t);
                    if (!d.success) throw new Error(d.error || 'Login data retrieval failed.');

                    window.postMessage({
                      type: 'SETUP_SESSION',
                      sessionData: { url: d.url, cookies: d.cookies }
                    }, '*');

                    buttonElement.innerHTML = '✅ Success!';
                    buttonElement.style.background = '#4CAF50';

                    setTimeout(() => {
                      buttonElement.disabled = false;
                      buttonElement.innerHTML = '🚀 Access ' + targetDomain;
                      buttonElement.style.opacity = '1';
                      buttonElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 2000);
                  })
                  .catch(e => {
                    console.error('Auto Login Failed:', e);
                    buttonElement.innerHTML = '❌ Error';
                    buttonElement.style.background = '#f44336';

                    setTimeout(() => {
                      buttonElement.disabled = false;
                      buttonElement.innerHTML = '🚀 Access ' + targetDomain;
                      buttonElement.style.opacity = '1';
                      buttonElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 2000);
                  });
              };

              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                var d = document.createElement('div');
                d.innerText = 'Content Protected';
                d.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;z-index:999999;pointer-events:none;';
                document.body.appendChild(d);
                setTimeout(function(){ document.body.removeChild(d); }, 1500);
              });
            `,
          }}
        />
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