import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './mayday-sim.module.css';

const SESSIONS = [
  { id: 1, date: '2026/07/03 (五) 19:30' },
  { id: 2, date: '2026/07/04 (六) 18:30' },
  { id: 3, date: '2026/07/05 (日) 18:30' },
  { id: 4, date: '2026/07/08 (三) 19:30' },
  { id: 5, date: '2026/07/10 (五) 19:30' },
  { id: 6, date: '2026/07/11 (六) 18:30' },
  { id: 7, date: '2026/07/12 (日) 18:30' },
];

const MaydaySim = () => {
  // Phase: 0(首頁), 1(場次), 2(區域), 3(張數), 4(結果)
  const [phase, setPhase] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaData, setCaptchaData] = useState([]);
  const [captchaInput, setCaptchaInput] = useState('');
  const [ticketQty, setTicketQty] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const captchaInputRef = useRef(null);

  // 驗證碼字體產生
  const generateCaptcha = () => {
    const chars = "abcdefhjkmnpqrstuvwxyz";
    let captchaStr = "";
    const result = [];
    for (let i = 0; i < 4; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      captchaStr += char;
      result.push({
        char,
        rotate: Math.floor(Math.random() * 20) - 10,
        offset: Math.floor(Math.random() * 10) - 5,
      });
    }
    setCaptcha(captchaStr);
    setCaptchaData(result);
    setCaptchaInput('');
  };

  // 倒數與計時邏輯
  useEffect(() => {
    let interval;
    if (isTimerRunning && countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isTimerRunning) {
      setCanBuy(true);
      setStartTime(performance.now()); // 從這裡開始計算搶票秒數
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, countdown]);

  const handleGoToSessions = () => {
    setPhase(1);
    setIsTimerRunning(true);
    window.scrollTo(0, 0);
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    generateCaptcha();
    setPhase(3);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (ticketQty === 0) return;
    if (captchaInput.toLowerCase().trim() !== captcha) {
      alert("驗證碼錯誤，請重新輸入");
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    setTimeout(() => {
      setIsLoading(false);
      setFinalResult({
        time: timeTaken,
        area: selectedArea,
        qty: ticketQty,
        session: selectedSession.date
      });
      setPhase(4);
    }, 1500);
  };

  const resetAll = () => {
    setPhase(0);
    setCountdown(3);
    setCanBuy(false);
    setTicketQty(0);
    setCaptchaInput('');
    setFinalResult(null);
    window.scrollTo(0, 0);
  };

  return (
    <Layout title="拓元搶票練習器">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.mainWrapper}>
        
        {/* Step Progress */}
        {phase > 0 && phase < 4 && (
          <div className={styles.navProgress}>
            <div className={phase === 1 ? styles.activeStep : ''}>1. 選擇場次</div>
            <div className={phase === 2 ? styles.activeStep : ''}>2. 選擇區域</div>
            <div className={phase === 3 ? styles.activeStep : ''}>3. 填寫資料</div>
          </div>
        )}

        <div className={styles.container}>
          
          {/* Phase 0: 購票首頁 */}
          {phase === 0 && (
            <div className={styles.introPage}>
              <img className={styles.poster} src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_825_413.jpg" alt="Poster" />
              <div className={styles.introContent}>
                <h2>MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會</h2>
                <p>演出地點：臺北大巨蛋</p>
                <button className={styles.btnMainBlue} onClick={handleGoToSessions}>立即購票</button>
              </div>
            </div>
          )}

          {/* Phase 1: 場次列表 */}
          {phase === 1 && (
            <div className={styles.sessionPage}>
              <div className={styles.topInfo}>
                {canBuy ? <span className={styles.timerRun}>計時中...</span> : <span className={styles.timerWait}>倒數 {countdown} 秒後開啟</span>}
              </div>
              <table className={styles.sessionTable}>
                <thead>
                  <tr>
                    <th>演出日期</th>
                    <th>場地</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {SESSIONS.map(s => (
                    <tr key={s.id}>
                      <td>{s.date}</td>
                      <td>臺北大巨蛋</td>
                      <td>
                        <button 
                          className={canBuy ? styles.btnGreen : styles.btnDisabled}
                          disabled={!canBuy}
                          onClick={() => { setSelectedSession(s); setPhase(2); }}
                        >
                          立即訂購
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phase 2: 區域選擇 */}
          {phase === 2 && (
            <div className={styles.areaPage}>
              <div className={styles.areaHeader}>{selectedSession.date}</div>
              <div className={styles.areaContent}>
                <div className={styles.mapContainer}>
                   <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_area_0905.png" alt="Seat Map" />
                </div>
                <div className={styles.areaList}>
                  <h3>請選擇區域</h3>
                  {['搖滾 A1 區', '搖滾 A2 區', '東下 K 區', '西下 J 區', '南下 G 區', '南上 D 區'].map(name => (
                    <div key={name} className={styles.areaItem} onClick={() => handleSelectArea(name)}>
                      <span>{name}</span>
                      <span className={styles.priceTag}>$3,880</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: 張數驗證碼 */}
          {phase === 3 && (
            <div className={styles.formPage}>
              <div className={styles.formHeader}>
                您選擇的是：{selectedSession.date} <br/> <strong>{selectedArea}</strong>
              </div>
              
              <div className={styles.qtySection}>
                <label>選擇張數</label>
                <select className={styles.qtySelect} value={ticketQty} onChange={(e) => setTicketQty(parseInt(e.target.value))}>
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} 張</option>)}
                </select>
              </div>

              <div className={styles.captchaSection}>
                <div className={styles.captchaBox} onClick={generateCaptcha}>
                  {captchaData.map((c, i) => (
                    <span key={i} style={{ transform: `rotate(${c.rotate}deg) translateY(${c.offset}px)` }}>
                      {c.char}
                    </span>
                  ))}
                </div>
                <input 
                  ref={captchaInputRef}
                  className={styles.captchaInput}
                  type="text"
                  placeholder="不分大小寫"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />
                <p className={styles.hint}>請輸入驗證碼</p>
              </div>

              <button className={styles.btnSubmit} onClick={handleSubmit}>確認張數</button>
            </div>
          )}

          {/* Phase 4: 結果顯示 */}
          {phase === 4 && finalResult && (
            <div className={styles.resultPage}>
              <div className={styles.successIcon}>🎉</div>
              <h2>恭喜您搶票成功！</h2>
              <div className={styles.resultInfo}>
                <p><span>耗費時間</span> <strong>{finalResult.time} 秒</strong></p>
                <p><span>場次日期</span> {finalResult.session}</p>
                <p><span>選擇區域</span> {finalResult.area}</p>
                <p><span>購票張數</span> {finalResult.qty} 張</p>
              </div>
              <button className={styles.btnAgain} onClick={resetAll}>再試一次</button>
            </div>
          )}

        </div>

        {isLoading && (
          <div className={styles.overlay}>
            <div className={styles.spinner}></div>
            <p>正在通訊中，請稍候...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaydaySim;
