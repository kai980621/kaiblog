import React, { useState, useEffect } from 'react';

export default function PaidContent({ children, id = 'default' }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const localStorageKey = `kai_blog_unlocked_${id}`;
  const CORRECT_PASSCODE = '0809';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(localStorageKey);
      if (savedState === 'true') {
        setIsUnlocked(true);
      }
    }
  }, [localStorageKey]);

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
    <div style={{ position: 'relative', margin: '2rem 0', borderRadius: '20px', overflow: 'hidden' }}>
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
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'var(--glass-bg)',
            padding: '2.5rem 2rem',
            borderRadius: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--glass-border)',
            maxWidth: '380px',
            width: '100%',
            animation: 'fadeInUp 0.6s ease-out',
            transform: error ? 'translateX(10px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            borderColor: error ? '#ff4d4f' : isInputFocused ? 'var(--ifm-color-primary)' : 'var(--glass-border)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🔏
            </div>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: '900',
              marginBottom: '0.5rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(to right, var(--ifm-color-primary), #6CC8FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              付費解鎖更多
            </h3>
            <p style={{
              fontSize: '0.95rem',
              opacity: 0.7,
              marginBottom: '1.8rem',
              fontWeight: '500'
            }}>
              輸入專屬解鎖碼以閱覽完整篇幅
            </p>

            <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
              <input
                type="password"
                placeholder="密碼：08XX"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid transparent',
                  background: 'rgba(0,0,0,0.05)',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxShadow: isInputFocused ? '0 0 0 3px rgba(66, 158, 238, 0.15)' : 'none'
                }}
              />
              {error && (
                <p style={{
                  color: '#ff4d4f',
                  fontSize: '0.85rem',
                  marginTop: '8px',
                  fontWeight: '700',
                  animation: 'shake 0.4s ease-in-out'
                }}>
                  ❌ 密碼錯誤，請檢查後再試一次
                </p>
              )}
            </div>

            <button
              onClick={handleUnlock}
              style={{
                width: '100%',
                padding: '14px 28px',
                fontSize: '1.1rem',
                fontWeight: '800',
                color: 'white',
                background: error ? '#ff4d4f' : 'var(--hero-gradient)',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 15px -3px rgba(66, 158, 238, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(66, 158, 238, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(66, 158, 238, 0.3)';
              }}
            >
              🚀 驗證解鎖
            </button>
          </div>
        </div>
      )}

      <div style={{
        filter: isUnlocked ? 'none' : 'blur(15px)',
        opacity: isUnlocked ? 1 : 0.3,
        maxHeight: isUnlocked ? 'none' : '400px',
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isUnlocked ? 'auto' : 'none',
        userSelect: isUnlocked ? 'auto' : 'none',
        overflow: 'hidden'
      }}>
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
