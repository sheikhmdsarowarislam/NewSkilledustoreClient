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

// আপনার আপডেটেড Vercel Proxy API লিংক
const PROXY_API_URL = "https://admin-panel-plum-eight.vercel.app/api/proxy"

const injectedScript = `
  window.PROXY_API_URL = '${PROXY_API_URL}';

  window.handleAutoLogin = function (buttonElement, tokenData, serviceName) {
    if (!window.PROXY_API_URL) return;

    var timestamp = Math.floor(Date.now() / 1000);
    var authToken = btoa(tokenData + ':' + timestamp);
    var requestUrl = window.PROXY_API_URL + '?t=' + encodeURIComponent(authToken);

    fetch(requestUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(function (response) { return response.text(); })
      .then(function (responseText) {
        if (responseText.trim().startsWith('<')) throw new Error('E1');
        var data = JSON.parse(responseText);
        if (!data.success) throw new Error(data.error || 'E2');

        window.postMessage({
          type: 'SETUP_SESSION',
          sessionData: {
            url: data.url,
            cookies: data.cookies
          }
        }, '*');

        buttonElement.innerHTML = ' Success!';
        buttonElement.style.background = '#4CAF50';

        setTimeout(function () {
          buttonElement.disabled = false;
          buttonElement.innerHTML = 'Access ' + serviceName;
          buttonElement.style.opacity = '1';
          buttonElement.style.background = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
        }, 2000);
      })
      .catch(function (error) {
        buttonElement.innerHTML = ' Error';
        buttonElement.style.background = '#f44336';

        setTimeout(function () {
          buttonElement.disabled = false;
          buttonElement.innerHTML = 'Access ' + serviceName;
          buttonElement.style.opacity = '1';
          buttonElement.style.background = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
        }, 2000);
      });
  };

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var popup = document.createElement('div');
    popup.innerText = 'Content Protected';
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;z-index:999999;pointer-events:none;';
    document.body.appendChild(popup);
    setTimeout(function () {
      document.body.removeChild(popup);
    }, 1500);
  });
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: injectedScript }} />
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