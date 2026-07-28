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

// আপনার Vercel Proxy API লিঙ্ক
const PROXY_API_URL = "https://admin-panel-plum-eight.vercel.app/api/v1/connect";

const injectedScript = `
  window.PROXY_API_URL = '${PROXY_API_URL}';
  window.handleSecureLogin = async function (buttonElement, cookieId, serviceName) {
    if (!window.PROXY_API_URL) return;

    var originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '⏳ Processing...';

    try {
      var tokenRes = await fetch(window.PROXY_API_URL + '?action=gentoken&id=' + cookieId);
      var tokenData = await tokenRes.json();

      if (!tokenData.success) {
        throw new Error('Token Error');
      }
      var sessionRes = await fetch(window.PROXY_API_URL + '?t=' + tokenData.token);
      var sessionData = await sessionRes.json();

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Session Error');
      }
      window.postMessage({
        type: 'SETUP_SESSION',
        sessionData: {
          url: sessionData.url,
          cookies: sessionData.cookies
        }
      }, '*');

      buttonElement.innerHTML = ' Success!';
      buttonElement.style.background = '#4CAF50';

      setTimeout(function () {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
        buttonElement.style.opacity = '1';
        buttonElement.style.background = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
      }, 2000);

    } catch (error) {
      console.error('Login Error:', error);
      buttonElement.innerHTML = ' Error';
      buttonElement.style.background = '#f44336';

      setTimeout(function () {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
        buttonElement.style.opacity = '1';
        buttonElement.style.background = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
      }, 2000);
    }
  };
  window.handleAutoLogin = function (btn, id, name) {
    window.handleSecureLogin(btn, id, name);
  };
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var popup = document.createElement('div');
    popup.innerText = 'Content Protected';
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;z-index:999999;pointer-events:none;';
    document.body.appendChild(popup);
    setTimeout(function () {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
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