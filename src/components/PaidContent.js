import React, { useState, useEffect, useRef } from 'react';

export default function PaidContent({ children, id = 'default' }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const contentRef = useRef(null);
  const localStorageKey = `kai_blog_unlocked_${id}`;
  const CORRECT_PASSCODE = '0621';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(localStorageKey);
      if (savedState === 'true') {
        setIsUnlocked(true);
      }
    }
  }, [localStorageKey]);

  // Handle TOC visibility via CSS class on html element
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (!isUnlocked) {
      document.documentElement.classList.add('lock-paid-content');
    } else {
      document.documentElement.classList.remove('lock-paid-content');
    }

    return () => {
      document.documentElement.classList.remove('lock-paid-content');
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
    if (passcode === CORRECT_PASSCODE) {
      setIsUnlocked(true);
      localStorage.setItem(localStorageKey, 'true');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      margin: '2rem 0', 
      borderRadius: '24px', 
      overflow: isUnlocked ? 'visible' : 'hidden',
      minHeight: isUnlocked ? '0' : '450px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {!isUnlocked && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          padding: '1.5rem',
          textAlign: 'center',
          borderRadius: '24px'
        }}>
          <div style={{
            background: 'var(--glass-bg)',
            padding: '2.5rem 2rem',
            borderRadius: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--glass-border)',
            maxWidth: '400px',
            width: '100%',
            animation: 'fadeInUp 0.6s ease-out',
            transform: error ? 'translateX(10px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            borderColor: error ? '#ff4d4f' : isInputFocused ? 'var(--ifm-color-primary)' : 'var(--glass-border)'
          }}>
            <div style={{
              fontSize: '3.5rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🔏
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '900',
              marginBottom: '0.8rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(to right, var(--ifm-color-primary), #6CC8FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              付費內容已鎖定
            </h3>
            <p style={{
              fontSize: '1rem',
              opacity: 0.8,
              marginBottom: '2rem',
              fontWeight: '500',
              lineHeight: '1.5'
            }}>
              輸入專屬解鎖碼以閱覽完整內容<br/>
              <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-primary)', fontWeight: 'bold' }}>
                💡 提示：我的生日
              </span>
            </p>

            <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
              <input
                type="password"
                placeholder="4 位數字密碼"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '2px solid transparent',
                  background: 'rgba(0,0,0,0.08)',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxShadow: isInputFocused ? '0 0 0 4px rgba(66, 158, 238, 0.2)' : 'none',
                  color: 'inherit'
                }}
              />
              {error && (
                <p style={{
                  color: '#ff4d4f',
                  fontSize: '0.9rem',
                  marginTop: '10px',
                  fontWeight: '700',
                  animation: 'shake 0.4s ease-in-out'
                }}>
                  ❌ 密碼錯誤，請再試一次
                </p>
              )}
            </div>

            <button
              onClick={handleUnlock}
              style={{
                width: '100%',
                padding: '16px 28px',
                fontSize: '1.1rem',
                fontWeight: '800',
                color: 'white',
                background: error ? '#ff4d4f' : 'var(--hero-gradient)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 20px -5px rgba(66, 158, 238, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(66, 158, 238, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(66, 158, 238, 0.4)';
              }}
            >
              🚀 立即解鎖
            </button>
          </div>
        </div>
      )}

      <div
        ref={contentRef}
        style={{
          filter: isUnlocked ? 'none' : 'blur(20px)',
          opacity: isUnlocked ? 1 : 0.2,
          maxHeight: isUnlocked ? 'none' : '400px',
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isUnlocked ? 'auto' : 'none',
          userSelect: isUnlocked ? 'auto' : 'none',
          overflow: 'hidden',
          flex: 1
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
