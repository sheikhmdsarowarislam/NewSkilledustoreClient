'use client';

import { useEffect, useState } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const [showAlert, setShowAlert] = useState(false);

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

    // Keyboard shortcuts block
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (
        e.key === 'F12' ||
        (ctrl && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) ||
        (ctrl && ['u', 'U'].includes(e.key)) ||
        (ctrl && ['s', 'S'].includes(e.key)) ||
        (ctrl && ['p', 'P'].includes(e.key)) ||
        (ctrl && ['f', 'F'].includes(e.key)) ||
        (ctrl && ['a', 'A'].includes(e.key)) ||
        (ctrl && ['c', 'C', 'x', 'X'].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && e.key === 'Delete') ||
        (e.metaKey && e.altKey && ['i', 'I', 'j', 'J', 'c', 'C', 'u', 'U'].includes(e.key))
      ) {
        e.preventDefault();
        trigger();
      }
    };

    // DevTools open detection — window size vs screen size compare
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        trigger();
        // DevTools খোলা থাকলে page blank করে দাও
        document.body.style.display = 'none';
      } else {
        document.body.style.display = '';
      }
    };

    // প্রতি ১ সেকেন্ডে check করবে
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // debugger trap — DevTools console খুললে freeze করবে
    const debuggerTrap = setInterval(() => {
      // eslint-disable-next-line no-debugger
      (function() { /* @cc_on return; */ const start = +new Date(); debugger; const end = +new Date(); if (end - start > 100) { document.body.style.display = 'none'; } })();
    }, 3000);

    document.body.style.userSelect = 'none';
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.display = '';
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
      clearInterval(debuggerTrap);
    };
  }, []);

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