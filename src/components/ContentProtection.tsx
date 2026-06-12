'use client';

import { useEffect, useState } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Right click disable
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
    };

    // Keyboard shortcuts disable (Ctrl+U, Ctrl+S, Ctrl+Shift+I, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2500);
      }
    };

    // Text selection disable
    document.body.style.userSelect = 'none';
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {children}

      {/* Content Protected Popup */}
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
            <h2
              style={{
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 600,
                margin: '0 0 8px',
              }}
            >
              Content Protected
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              এই content copy বা download করার অনুমতি নেই।
            </p>
          </div>
        </div>
      )}
    </>
  );
}