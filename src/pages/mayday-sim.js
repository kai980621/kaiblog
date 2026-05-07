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

const AREAS = [
  { name: '搖滾 A1 區', price: 6880, status: '熱賣中' },
  { name: '搖滾 A2 區', price: 6880, status: '熱賣中' },
  { name: '搖滾 B1 區', price: 4880, status: '熱賣中' },
  { name: '搖滾 B2 區', price: 4880, status: '剩餘極少' },
  { name: '東下 K 區', price: 3880, status: '熱賣中' },
  { name: '西下 J 區', price: 3880, status: '熱賣中' },
  { name: '南下 G 區', price: 3280, status: '熱賣中' },
  { name: '東上 E 區', price: 2280, status: '剩餘極少' },
  { name: '西上 F 區', price: 2280, status: '熱賣中' },
  { name: '南上 D 區', price: 1880, status: '熱賣中' },
];

const MaydaySim = () => {
  const [phase, setPhase] = useState(0); // 0:Info, 1:Sessions, 2:Areas, 3:Form, 4:Result
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [ticketQty, setTicketQty] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = "abcdefhjkmnpqrstuvwxyz";
    let str = "";
    for (let i = 0; i < 4; i++) str += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(str);
    setCaptchaInput('');
  };

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setCanBuy(true);
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  const startPractice = () => {
    setPhase(1);
    setIsCounting(true);
    window.scrollTo(0, 0);
  };

  const selectSession = (session) => {
    setStartTime(performance.now()); // 從點擊訂購這秒正式開始計時
    setSelectedSession(session);
    setPhase(2);
    window.scrollTo(0, 0);
  };

  const selectArea = (area) => {
    setSelectedArea(area);
    generateCaptcha();
    setPhase(3);
    window.scrollTo(0, 0);
  };

  const submitForm = () => {
    if (ticketQty === 0) return alert("請選擇張數");
    if (captchaInput.toLowerCase() !== captcha) {
      alert("驗證碼錯誤");
      generateCaptcha();
      return;
    }
    setIsLoading(true);
    const timeTaken = ((performance.now() - startTime) / 1000).toFixed(2);
    setTimeout(() => {
      setIsLoading(false);
      setFinalResult({ time: timeTaken, session: selectedSession.date, area: selectedArea.name, qty: ticketQty });
      setPhase(4);
    }, 1200);
  };

  return (
    <Layout title="拓元搶票模擬器">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.tixContainer}>
          
          {/* Phase 0: 節目介紹 */}
          {phase === 0 && (
            <div className={styles.introPage}>
              <div className={styles.posterContainer}>
                <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_825_413.jpg" alt="Poster" />
              </div>
              <div className={styles.introBody}>
                <h1>MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會</h1>
                <p>演出場地：臺北大巨蛋</p>
                <button className={styles.btnTixBlue} onClick={startPractice}>立即購票</button>
              </div>
            </div>
          )}

          {/* Phase 1: 場次表 */}
          {phase === 1 && (
            <div className={styles.sessionPage}>
              <div className={styles.tixHeader}>場次選擇</div>
              <div className={styles.countdownBar}>
                {canBuy ? "🔥 搶票進行中" : `倒數 ${countdown} 秒後開啟訂購按鈕`}
              </div>
              <table className={styles.sessionTable}>
                <thead>
                  <tr><th>演出日期</th><th className={styles.pcOnly}>場次名稱</th><th>狀態</th></tr>
                </thead>
                <tbody>
                  {SESSIONS.map(s => (
                    <tr key={s.id}>
                      <td className={styles.blueText}>{s.date}</td>
                      <td className={styles.pcOnly}>MAYDAY #5525 [ 回到那一天 ]</td>
                      <td>
                        <button 
                          className={canBuy ? styles.btnGreen : styles.btnDisabled}
                          disabled={!canBuy}
                          onClick={() => selectSession(s)}
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
              <div className={styles.tixHeader}>{selectedSession.date}</div>
              <div className={styles.areaFlex}>
                <div className={styles.mapSide}>
                  <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_area_0905.png" alt="Map" />
                </div>
                <div className={styles.listSide}>
                  <div className={styles.listHeader}>請選擇區域</div>
                  {AREAS.map(a => (
                    <div key={a.name} className={styles.areaRow} onClick={() => selectArea(a)}>
                      <span>{a.name}</span>
                      <span className={styles.priceText}>${a.price.toLocaleString()} <span className={styles.hot}>熱賣中</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: 表單驗證 */}
          {phase === 3 && (
            <div className={styles.formPage}>
              <div className={styles.formSummary}>
                <p>{selectedSession.date} | <strong>{selectedArea.name}</strong></p>
              </div>
              
              <div className={styles.qtyBox}>
                <div className={styles.qtyLabel}>全票 ${selectedArea.price.toLocaleString()}</div>
                <select className={styles.qtySelect} value={ticketQty} onChange={(e) => setTicketQty(parseInt(e.target.value))}>
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className={styles.captchaWrap}>
                <div className={styles.captchaImage} onClick={generateCaptcha}>
                   {captcha.split('').map((char, i) => (
                     <span key={i} style={{ transform: `rotate(${Math.random()*20-10}deg) translateY(${Math.random()*10-5}px)` }}>
                       {char}
                     </span>
                   ))}
                </div>
                <input 
                  className={styles.tixInput}
                  type="text"
                  placeholder="不分大小寫"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />
                <p className={styles.hint}>請輸入上方 4 位英文字母</p>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnBack} onClick={() => setPhase(2)}>重新選區</button>
                <button className={styles.btnNext} onClick={submitForm}>確認張數</button>
              </div>
            </div>
          )}

          {/* Phase 4: 結果頁 */}
          {phase === 4 && finalResult && (
            <div className={styles.resultPage}>
              <div className={styles.successTitle}>🎉 訂單已成功送出</div>
              <div className={styles.resultList}>
                <div className={styles.resRow}><span>搶票花費時間</span> <strong>{finalResult.time}s</strong></div>
                <div className={styles.resRow}><span>演出場次</span> {finalResult.session}</div>
                <div className={styles.resRow}><span>選擇區域</span> {finalResult.area}</div>
                <div className={styles.resRow}><span>購買張數</span> {finalResult.qty}</div>
              </div>
              <button className={styles.btnRestart} onClick={() => window.location.reload()}>返回首頁</button>
            </div>
          )}

        </div>

        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>通訊中，請稍候...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaydaySim;
