import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './mayday-sim.module.css';

const SESSIONS = [
  { id: 1, date: '2026/07/24 (五) 19:30', name: 'MAYDAY #5525 [ 回到那一天 ] 7月場次' },
  { id: 2, date: '2026/07/25 (六) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 7月場次' },
  { id: 3, date: '2026/07/26 (日) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 7月場次' },
];

const MaydaySim = () => {
  const [phase, setPhase] = useState(1);
  const [selectedSession, setSelectedSession] = useState(SESSIONS[0]);
  const [countdown, setCountdown] = useState(3); // 設定為 3 秒倒數
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [captchaData, setCaptchaData] = useState([]);
  const [captchaInput, setCaptchaInput] = useState('');
  const [ticketQty, setTicketQty] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bestTime, setBestTime] = useState(null);

  const captchaInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('mayday_best_time');
    if (saved) setBestTime(parseFloat(saved));
  }, []);

  // 驗證碼產生器
  const generateCaptcha = () => {
    const chars = "abcdefhjkmnpqrstuvwxyz";
    let captchaStr = "";
    const result = [];
    for (let i = 0; i < 4; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      captchaStr += char;
      result.push({
        char,
        rotate: Math.floor(Math.random() * 30) - 15,
        offset: Math.floor(Math.random() * 8) - 4,
      });
    }
    setCaptcha(captchaStr);
    setCaptchaData(result);
    setCaptchaInput('');
  };

  // 倒數計時器
  useEffect(() => {
    let interval;
    if (isTimerRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanBuy(true);
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, countdown]);

  const handleStartPractice = () => {
    setCanBuy(false);
    setCountdown(3);
    setIsTimerRunning(true);
  };

  const handleBuyClick = (session) => {
    if (canBuy) {
      setSelectedSession(session);
      setPhase(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAreaSelect = (area, price) => {
    setSelectedArea(area);
    setSelectedPrice(price);
    setPhase(3);
    setStartTime(performance.now());
    generateCaptcha();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (ticketQty === 0) return alert("請選擇張數");
    if (!isAgreed) return alert("請勾選同意條款");
    
    if (captchaInput.toLowerCase().trim() === captcha) {
      setIsLoading(true);
      const timeTaken = ((performance.now() - startTime) / 1000).toFixed(2);
      setTimeout(() => {
        setIsLoading(false);
        alert(`🎉 搶票成功！\n花費時間：${timeTaken} 秒\n場次：${selectedSession.date}\n區域：${selectedArea}`);
        if (!bestTime || timeTaken < bestTime) {
          localStorage.setItem('mayday_best_time', timeTaken);
        }
        window.location.reload();
      }, 1500);
    } else {
      alert("驗證碼錯誤！");
      generateCaptcha();
    }
  };

  return (
    <Layout title="五月天搶票練習器" description="模擬拓元售票系統">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          
          {/* Header */}
          <div className={styles.headerBox}>
            <div className={styles.eventImage}>
              <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_825_413.jpg" alt="Mayday" />
            </div>
            <div className={styles.eventInfoText}>
              <h1>MAYDAY #5525 [ 回到那一天 ] 25週年巡迴</h1>
              <span className={styles.locationTag}>臺北大巨蛋 (Taipei Dome)</span>
              {bestTime && <div className={styles.bestRecord}>🏆 最佳紀錄：{bestTime}s</div>}
            </div>
          </div>

          {/* Phase 1: 場次選擇 */}
          {phase === 1 && (
            <div className={styles.phase1}>
              <div className={styles.timerSection}>
                {!isTimerRunning && !canBuy ? (
                  <button className={styles.btnStart} onClick={handleStartPractice}>開啟搶票專區 (3秒倒數)</button>
                ) : (
                  <div className={styles.countdownValue}>
                    {countdown > 0 ? `距離開賣還有：${countdown} 秒` : '🔥 搶票專區已開啟'}
                  </div>
                )}
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.sessionTable}>
                  <thead>
                    <tr>
                      <th>演出日期</th>
                      <th>場次名稱</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SESSIONS.map((s) => (
                      <tr key={s.id}>
                        <td>{s.date}</td>
                        <td className={styles.mobileHide}>{s.name}</td>
                        <td>
                          <button
                            className={canBuy ? styles.btnBuyNow : styles.btnDisabled}
                            disabled={!canBuy}
                            onClick={() => handleBuyClick(s)}
                          >
                            立即訂購
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Phase 2: 區域選擇 */}
          {phase === 2 && (
            <div className={styles.phase2}>
              <div className={styles.areaLayout}>
                <div className={styles.mapSide}>
                  <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_area_0905.png" alt="Map" />
                </div>
                <div className={styles.listSide}>
                  <h3>請選擇區域 (Session: {selectedSession.date})</h3>
                  {['搖滾 A1 區', '搖滾 A2 區', '東下 K 區', '西下 J 區'].map(name => (
                    <div key={name} className={styles.areaRow} onClick={() => handleAreaSelect(name, 3880)}>
                      <span>{name}</span>
                      <span className={styles.statusHot}>NT$3880 - 熱賣中</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: 驗證碼與張數 */}
          {phase === 3 && (
            <div className={styles.phase3}>
              <div className={styles.selectionSummary}>
                區域：<span className={styles.blueTag}>{selectedArea}</span> | 場次：{selectedSession.date}
              </div>

              <div className={styles.qtyBox}>
                <label>張數：</label>
                <select value={ticketQty} onChange={(e) => setTicketQty(parseInt(e.target.value))}>
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} 張</option>)}
                </select>
              </div>

              <div className={styles.captchaContainer}>
                {/* 驗證碼：藍底白字設計 */}
                <div className={styles.captchaDisplay} onClick={generateCaptcha}>
                  {captchaData.map((item, idx) => (
                    <span key={idx} style={{
                      transform: `rotate(${item.rotate}deg) translateY(${item.offset}px)`,
                    }}>
                      {item.char}
                    </span>
                  ))}
                </div>
                <div className={styles.captchaInputWrapper}>
                  <input
                    ref={captchaInputRef}
                    className={styles.captchaInput}
                    type="text"
                    placeholder="不分大小寫"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    autoComplete="off"
                  />
                  <p className={styles.captchaHint}>請輸入上方驗證碼 (點擊圖片可換圖)</p>
                </div>
              </div>

              <div className={styles.agreement}>
                <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} id="ag" />
                <label htmlFor="ag"> 我已閱讀並同意會員條款及購票須知</label>
              </div>

              <div className={styles.actionBtns}>
                <button className={styles.btnBack} onClick={() => setPhase(2)}>重新選擇區域</button>
                <button className={styles.btnConfirm} onClick={handleSubmit}>確認張數</button>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>通訊中，請稍候...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaydaySim;
