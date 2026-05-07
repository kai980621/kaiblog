import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './mayday-sim.module.css';

const SESSIONS = [
  { id: 1, date: '2026/07/03 (五) 19:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 2, date: '2026/07/04 (六) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 3, date: '2026/07/05 (日) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 4, date: '2026/07/08 (三) 19:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 5, date: '2026/07/10 (五) 19:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 6, date: '2026/07/11 (六) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
  { id: 7, date: '2026/07/12 (日) 18:30', name: 'MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會' },
];

const AREAS = [
  { group: '搖滾站區', list: [
    { name: '搖滾 A1 區', price: 6880 }, { name: '搖滾 A2 區', price: 6880 },
    { name: '搖滾 B1 區', price: 5880 }, { name: '搖滾 B2 區', price: 5880 }
  ]},
  { group: '看台座位區', list: [
    { name: '東下 K 區', price: 3880 }, { name: '西下 J 區', price: 3880 },
    { name: '南下 G 區', price: 3280 }, { name: '東上 E 區', price: 2880 },
    { name: '西上 F 區', price: 2880 }, { name: '頂層 H 區', price: 800 }
  ]}
];

const MaydaySim = () => {
  // Phase: 0(倒數頁), 1(場次列表), 2(區域圖), 3(張數驗證), 4(結果)
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [ticketQty, setTicketQty] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [captchaData, setCaptchaData] = useState([]);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 驗證碼邏輯
  const generateCaptcha = () => {
    const chars = "abcdefhjkmnpqrstuvwxyz";
    let str = "";
    const data = [];
    for (let i = 0; i < 4; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      str += char;
      data.push({
        char,
        rotate: Math.floor(Math.random() * 20) - 10,
        y: Math.floor(Math.random() * 10) - 5
      });
    }
    setCaptcha(str);
    setCaptchaData(data);
    setCaptchaInput('');
  };

  // 初始倒數
  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  // 按下「立即購票」才開始正式計時 (搶票行為開始)
  const startBuying = () => {
    if (countdown > 0) return;
    setStartTime(performance.now());
    setPhase(1);
    window.scrollTo(0, 0);
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    generateCaptcha();
    setPhase(3);
    window.scrollTo(0, 0);
  };

  const submitOrder = () => {
    if (ticketQty === 0) { alert("請選擇張數"); return; }
    if (captchaInput.toLowerCase().trim() !== captcha) {
      alert("驗證碼錯誤");
      generateCaptcha();
      return;
    }
    setIsLoading(true);
    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    setTimeout(() => {
      setIsLoading(false);
      setResult({
        time: timeTaken,
        session: selectedSession.date,
        area: selectedArea.name,
        qty: ticketQty
      });
      setPhase(4);
    }, 1200);
  };

  return (
    <Layout title="拓元模擬搶票">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.appContainer}>
          
          {/* Phase 0: 倒數與啟動頁 */}
          {phase === 0 && (
            <div className={styles.landing}>
              <div className={styles.posterContainer}>
                <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_825_413.jpg" alt="Poster" />
              </div>
              <div className={styles.introContent}>
                <h1>MAYDAY #5525 [ 回到那一天 ]</h1>
                <p>地點：臺北大巨蛋</p>
                <div className={styles.startZone}>
                  {countdown > 0 ? (
                    <button className={styles.btnDisabled}>開賣倒數 {countdown} 秒</button>
                  ) : (
                    <button className={styles.btnBuyNow} onClick={startBuying}>立即購票</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Phase 1: 場次選擇 */}
          {phase === 1 && (
            <div className={styles.sessionList}>
              <div className={styles.sectionTitle}>請選擇場次</div>
              <table className={styles.tixTable}>
                <thead>
                  <tr>
                    <th>演出日期</th>
                    <th className={styles.mobileHide}>演出名稱</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {SESSIONS.map(s => (
                    <tr key={s.id}>
                      <td className={styles.sessionDate}>{s.date}</td>
                      <td className={styles.mobileHide}>{s.name}</td>
                      <td>
                        <button className={styles.btnSelect} onClick={() => { setSelectedSession(s); setPhase(2); }}>立即訂購</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phase 2: 區域選擇 */}
          {phase === 2 && (
            <div className={styles.areaSelection}>
              <div className={styles.blueHeader}>{selectedSession.date}</div>
              <div className={styles.areaContent}>
                <div className={styles.mapBox}>
                  <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_area_0905.png" alt="Map" />
                </div>
                <div className={styles.areaList}>
                  <div className={styles.listHead}>請選擇區域</div>
                  {AREAS.map(group => (
                    <div key={group.group} className={styles.areaGroup}>
                      <div className={styles.groupLabel}>{group.group}</div>
                      {group.list.map(a => (
                        <div key={a.name} className={styles.areaItem} onClick={() => handleSelectArea(a)}>
                          <span>{a.name}</span>
                          <span className={styles.areaInfo}>${a.price} <small className={styles.statusHot}>熱賣中</small></span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: 表單驗證 */}
          {phase === 3 && (
            <div className={styles.formPage}>
              <div className={styles.selectionSummary}>
                <strong>{selectedSession.date}</strong> | <span className={styles.blueTag}>{selectedArea.name}</span>
              </div>
              
              <div className={styles.qtyBox}>
                <div className={styles.qtyRow}>
                  <label>全票 ${selectedArea.price}</label>
                  <select value={ticketQty} onChange={(e) => setTicketQty(parseInt(e.target.value))}>
                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.captchaZone}>
                <div className={styles.captchaDisplay} onClick={generateCaptcha}>
                  {captchaData.map((c, i) => (
                    <span key={i} style={{ transform: `rotate(${c.rotate}deg) translateY(${c.y}px)` }}>
                      {c.char}
                    </span>
                  ))}
                </div>
                <input 
                  className={styles.captchaInput}
                  type="text"
                  placeholder="不分大小寫"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  autoComplete="off"
                />
                <p className={styles.hint}>請輸入驗證碼</p>
              </div>

              <div className={styles.agreementBox}>
                <input type="checkbox" id="ag" />
                <label htmlFor="ag">我已詳細閱讀並同意服務條款</label>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnBack} onClick={() => setPhase(2)}>重新選區</button>
                <button className={styles.btnConfirm} onClick={submitOrder}>確認張數</button>
              </div>
            </div>
          )}

          {/* Phase 4: 結果 */}
          {phase === 4 && result && (
            <div className={styles.resultPage}>
              <div className={styles.resultCard}>
                <div className={styles.successIcon}>✓</div>
                <h2>搶票練習完成</h2>
                <div className={styles.resultGrid}>
                  <div className={styles.resRow}><span>搶票花費時間</span> <strong>{result.time} 秒</strong></div>
                  <div className={styles.resRow}><span>選擇場次</span> {result.session}</div>
                  <div className={styles.resRow}><span>選擇區域</span> {result.area}</div>
                  <div className={styles.resRow}><span>訂購張數</span> {result.qty} 張</div>
                </div>
                <button className={styles.btnRestart} onClick={() => window.location.reload()}>再試一次</button>
              </div>
            </div>
          )}

        </div>

        {isLoading && (
          <div className={styles.overlay}>
            <div className={styles.loader}></div>
            <p>通訊中，請稍候...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaydaySim;
