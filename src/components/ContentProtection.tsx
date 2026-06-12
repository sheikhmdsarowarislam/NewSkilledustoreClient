'use client';

import { useEffect, useState } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const [showAlert, setShowAlert] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const trigger = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  useEffect(() => {
    // Right click block
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      trigger();
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('contextmenu', handleContextMenu);

    // ─── DevTools Detection ───────────────────────────────────────
    // Method 1: window size diff
    const checkBySize = () => {
      const w = window.outerWidth - window.innerWidth > 160;
      const h = window.outerHeight - window.innerHeight > 160;
      return w || h;
    };

    // Method 2: devtools-detect via toString trick
    let devToolsViaToString = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        devToolsViaToString = true;
        return 'detected';
      },
    });

    // Method 3: debugger timing
    const checkByDebugger = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      return performance.now() - start > 100;
    };

    const interval = setInterval(() => {
      // eslint-disable-next-line no-console
      console.log('%c', element); // triggers Method 2

      const detected = checkBySize() || devToolsViaToString || checkByDebugger();
      devToolsViaToString = false; // reset

      if (detected) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    }, 500);

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(interval);
    };
  }, []);

  // DevTools খোলা থাকলে পুরো page block
  if (devToolsOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '48px' }}>🔒</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
          Content Protected
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
          Developer Tools বন্ধ করুন।
        </p>
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