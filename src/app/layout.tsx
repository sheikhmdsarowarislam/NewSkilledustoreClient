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

const injectedScript = `
  // গ্লোবাল ফ্ল্যাগ যা ডুপ্লিকেট ক্লিক বা একই সাথে দুটি ট্যাব ওপেন আটকাবে
  window.isAccessSessionProcessing = false;

  window.handleSecureLogin = async function (buttonElement, cookieId, serviceName) {
    // ১. যদি ইতোমধ্যে কাজ চালু থাকে, তবে ২য় ক্লিক ব্লক করে দেবে
    if (window.isAccessSessionProcessing) return;
    window.isAccessSessionProcessing = true;

    var originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.style.opacity = '0.7';
    buttonElement.innerHTML = '⏳ Processing...';

    try {
      var res = await fetch('/api/access-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cookieId })
      });

      var sessionData = await res.json();

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Session Error');
      }

      // এক্সটেনশনে তথ্য পাঠানো
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
        window.isAccessSessionProcessing = false; // লক খুলে দেওয়া হলো
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
        window.isAccessSessionProcessing = false; // লক খুলে দেওয়া হলো
      }, 2000);
    }
  };

  // ডুপ্লিকেট ফাংশন হ্যান্ডলার
  window.handleAutoLogin = window.handleSecureLogin;

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