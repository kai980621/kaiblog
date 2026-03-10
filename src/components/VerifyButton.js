import React, { useState } from 'react';

export default function VerifyButton() {
  const [isClaimed, setIsClaimed] = useState(false);

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <button 
        onClick={() => setIsClaimed(true)}
        disabled={isClaimed}
        style={{
          padding: '14px 40px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: 'white',
          background: isClaimed 
            ? '#6c757d' 
            : 'linear-gradient(45deg, #007bff, #00d2ff)',
          border: 'none',
          borderRadius: '50px',
          cursor: isClaimed ? 'not-allowed' : 'pointer',
          transition: 'all 0.4s ease',
          boxShadow: isClaimed ? 'none' : '0 4px 15px rgba(0, 123, 255, 0.4)',
          transform: isClaimed ? 'scale(0.95)' : 'scale(1)',
          opacity: isClaimed ? 0.7 : 1
        }}
      >
        {isClaimed ? '✓ 認證申請已送出' : '提交認證並領取身分組'}
      </button>
      {isClaimed && <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#6c757d' }}>管理員將於 24 小時內核對 OpenForms 資料。</p>}
    </div>
  );
}
