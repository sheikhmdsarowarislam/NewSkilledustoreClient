'use client';

import { useEffect, useState, useRef } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const detectionRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  useEffect(() => {
    // ── Right click block ──
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerAlert();
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('contextmenu', handleContextMenu);

    // ── DevTools Detection: 3 methods combined ──

    // Method 1: window size difference (docked devtools)
    const sizeCheck = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      return widthDiff > 100 || heightDiff > 100;
    };

    // Method 2: firebug / console object check
    const consoleCheck = () => {
      let opened = false;
      const check = /./;
      check.toString = () => {
        opened = true;
        return 'detected';
      };
      // eslint-disable-next-line no-console
      console.log('%c', check);
      // eslint-disable-next-line no-console
      console.clear();
      return opened;
    };

    // Method 3: Element toString trick (Chrome, Firefox, Safari)
    const elementCheck = () => {
      let opened = false;
      const el = document.createElement('div');
      Object.defineProperty(el, 'id', {
        get() {
          opened = true;
          return '';
        },
        configurable: true,
      });
      // eslint-disable-next-line no-console
      console.log(el);
      // eslint-disable-next-line no-console
      console.clear();
      return opened;
    };

    // Method 4: performance.now + debugger timing (undocked devtools)
    const timingCheck = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      return performance.now() - start > 100;
    };

    let consecutiveDetections = 0;

    detectionRef.current = setInterval(() => {
      const detected =
        sizeCheck() || consoleCheck() || elementCheck() || timingCheck();

      if (detected) {
        consecutiveDetections++;
        // 2 consecutive detection এ confirm করো (false positive এড়াতে)
        if (consecutiveDetections >= 2) {
          setDevToolsOpen(true);
        }
      } else {
        consecutiveDetections = 0;
        setDevToolsOpen(false);
      }
    }, 300);

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('contextmenu', handleContextMenu);
      if (detectionRef.current) clearInterval(detectionRef.current);
    };
  }, []);

  // ── DevTools খোলা থাকলে পুরো page replace ──
  if (devToolsOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '38px',
          }}
        >
          🔒
        </div>
        <h1
          style={{
            color: '#ffffff',
            fontSize: '26px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '0.5px',
          }}
        >
          Content Protected
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '15px',
            margin: 0,
            textAlign: 'center',
            maxWidth: '320px',
            lineHeight: 1.6,
          }}
        >
          Please close Developer Tools and continue.
        </p>
        <div
          style={{
            width: '48px',
            height: '2px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: '2px',
            marginTop: '4px',
          }}
        />
      </div>
    );
  }

  return (
    <>
      {children}

      {showAlert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setShowAlert(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '16px',
              padding: '2.5rem 3rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
                fontSize: '32px',
              }}
            >
              🔒
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 600, margin: '0 0 8px' }}>
              Content Protected
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: 0 }}>
              এই content copy বা download করার অনুমতি নেই।
            </p>
          </div>
        </div>
      )}
    </>
  );
}