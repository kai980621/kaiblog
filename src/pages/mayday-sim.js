import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './mayday-sim.module.css';

const MaydaySim = () => {
  const [phase, setPhase] = useState(1);
  const [countdown, setCountdown] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026/11/27 (五) 20:00');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [ticketQty, setTicketQty] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bestTime, setBestTime] = useState(null);

  const captchaInputRef = useRef(null);

  // Load Best Time
  useEffect(() => {
    const saved = localStorage.getItem('mayday_best_time');
    if (saved) setBestTime(parseFloat(saved));
  }, []);

  // Captcha Generator
  const generateCaptcha = () => {
    const chars = "abcdefhjkmnpqrstuvwxyz";
    const result = [];
    let captchaStr = "";
    for (let i = 0; i < 4; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      captchaStr += char;
      result.push({
        char,
        rotate: Math.floor(Math.random() * 40) - 20, // -20 to 20 deg
        offset: Math.floor(Math.random() * 10) - 5, // -5 to 5 px
        scale: 0.8 + Math.random() * 0.4 // 0.8 to 1.2
      });
    }
    setCaptcha(captchaStr);
    setCaptchaData(result);
    setCaptchaInput('');
  };

  const [captchaData, setCaptchaData] = useState([]);

  // Timer Logic
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

  // Focus management
  useEffect(() => {
    if (phase === 3 && captchaInputRef.current) {
      captchaInputRef.current.focus();
    }
  }, [phase]);

  const handleStartPractice = () => {
    setIsTimerRunning(true);
  };

  const handleBuyClick = () => {
    if (canBuy) {
      setPhase(2);
      window.scrollTo(0, 0);
    }
  };

  const handleAreaSelect = (area, price) => {
    setSelectedArea(area);
    setSelectedPrice(price);
    setPhase(3);
    setStartTime(performance.now());
    generateCaptcha();
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (ticketQty == 0) {
      alert("請選擇張數");
      return;
    }
    if (!isAgreed) {
      alert("請勾選「我已詳細閱讀且同意...」");
      return;
    }
    if (captchaInput.toLowerCase().trim() === captcha) {
      setIsLoading(true);
      const endTime = performance.now();
      const timeTaken = parseFloat(((endTime - startTime) / 1000).toFixed(2));

      // Simulate "spinning" for a while
      setTimeout(() => {
        setIsLoading(false);
        alert(`🎉 搶票成功！\n\n花費時間：${timeTaken} 秒\n區域：${selectedArea}\n數量：${ticketQty} 張`);

        // Update Best Time (Highest speed = lowest seconds)
        if (!bestTime || timeTaken < bestTime) {
          setBestTime(timeTaken);
          localStorage.setItem('mayday_best_time', timeTaken.toString());
        }

        // Reset
        window.location.reload();
      }, 1500); // 1.5s spinning delay
    } else {
      alert("驗證碼錯誤！");
      generateCaptcha();
      captchaInputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (phase === 1 && canBuy) handleBuyClick();
      else if (phase === 3) handleSubmit();
    }
  };

  return (
    <Layout title="五月天搶票練習器" description="模擬拓元售票系統的購票流程">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.mainWrapper} onKeyDown={handleKeyDown} tabIndex="0">

        {/* Progress Bar (Visible in Phase 2 & 3) */}
        {phase > 1 && (
          <div className={styles.navProgress}>
            <div className={`${styles.progStep} ${phase >= 2 ? styles.progActive : ''}`}>
              <div className={styles.progCircle}>1</div>
              <span>選擇區域</span>
            </div>
            <div className={styles.progLine}></div>
            <div className={`${styles.progStep} ${phase >= 3 ? styles.progActive : ''}`}>
              <div className={styles.progCircle}>2</div>
              <span>選擇張數</span>
            </div>
            <div className={styles.progLine}></div>
            <div className={styles.progStep}>
              <div className={styles.progCircle}>3</div>
              <span>購票確認</span>
            </div>
            <div className={styles.progLine}></div>
            <div className={styles.progStep}>
              <div className={styles.progCircle}>4</div>
              <span>付款</span>
            </div>
            <div className={styles.progLine}></div>
            <div className={styles.progStep}>
              <div className={styles.progCircle}>5</div>
              <span>完成訂購</span>
            </div>
          </div>
        )}

        <div className={styles.container}>

          {/* Header Info */}
          <div className={styles.headerBox}>
            <div className={styles.eventImage}>
              <img src="https://bin.static.tixcraft.com/images/activity/24_mayday_c_825_413.jpg" alt="Event" onError={(e) => {e.target.src="https://via.placeholder.com/180x90?text=MAYDAY+5525"}} />
            </div>
            <div className={styles.eventInfoText}>
              <h1>MAYDAY #5525 [ 回到那一天 ] 25週年巡迴演唱會</h1>
              <p>2026/12/31 (四) 21:00 <span className={styles.locationTag}>臺北體育園區 (臺北大巨蛋)</span></p>
              {bestTime && (
                <div className={styles.bestRecord}>🏆 個人最佳紀錄：{bestTime} 秒</div>
              )}
            </div>
          </div>

          {/* Phase 1: Event List */}
          {phase === 1 && (
            <div className={styles.phase1}>
              <div className={styles.topBtns}>
                <button className={styles.btnNavActive}>立即購票</button>
                <button className={styles.btnNav}>購票流程</button>
                <button className={styles.btnNav}>取票流程</button>
              </div>

              <div className={styles.countdownPanel}>
                {!isTimerRunning && !canBuy ? (
                  <div className={styles.settingRow}>
                    <label>模擬倒數：</label>
                    <input
                      type="number"
                      value={countdown}
                      onChange={(e) => setCountdown(parseInt(e.target.value) || 5)}
                    />
                    <button onClick={handleStartPractice}>開始練習</button>
                  </div>
                ) : (
                  <div className={styles.countdownValue}>
                    {countdown > 0 ? `開賣倒數：00:0${countdown}` : '已開賣！'}
                  </div>
                )}
              </div>

              <table className={styles.tixTable}>
                <thead>
                  <tr>
                    <th>演出時間</th>
                    <th>場次名稱</th>
                    <th>場地</th>
                    <th>購買狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2026/12/31 (四) 21:00</td>
                    <td>MAYDAY #5525 [ 回到那一天 ] </td>
                    <td>臺北大巨蛋</td>
                    <td>
                      <button
                        className={canBuy ? styles.btnBuyNow : styles.btnDisabled}
                        disabled={!canBuy}
                        onClick={handleBuyClick}
                      >
                        立即訂購
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.noticeBox}>
                <p>▶ 欲購票者，需先完成加入會員及手機號碼驗證...</p>
                <p>Please note, if you are a new fan...</p>
              </div>
            </div>
          )}

          {/* Phase 2: Area Selection */}
          {phase === 2 && (
            <div className={styles.phase2}>
              <div className={styles.areaLayout}>
                <div className={styles.mapSide}>
                  <img src="/img/mayday_map.png" alt="Seat Map" />
                </div>
                <div className={styles.listSide}>
                  <h3>請選擇區域</h3>
                  <div className={styles.areaGroup}>
                    <div className={styles.groupHeader}>瘋狂世界 搖滾站區 (NTD 3880~6880)</div>
                    <div className={styles.areaRow} onClick={() => handleAreaSelect('搖滾 A1 區', 6880)}>
                      <span>搖滾 A1 區</span>
                      <span className={styles.statusHot}>熱賣中</span>
                    </div>
                    <div className={styles.areaRow} onClick={() => handleAreaSelect('搖滾 A2 區', 6880)}>
                      <span>搖滾 A2 區</span>
                      <span className={styles.statusHot}>熱賣中</span>
                    </div>
                    <div className={styles.areaRow} onClick={() => handleAreaSelect('搖滾 B1 區', 4880)}>
                      <span>搖滾 B1 區</span>
                      <span className={styles.statusHot}>熱賣中</span>
                    </div>
                  </div>
                  <div className={styles.areaGroup}>
                    <div className={styles.groupHeader}>看台座位區 (NTD 800~3880)</div>
                    {['東下 K 區', '西下 J 區', '南下 G 區'].map(z => (
                      <div key={z} className={styles.areaRow} onClick={() => handleAreaSelect(z, 3280)}>
                        <span>{z}</span>
                        <span className={styles.statusCount}>剩餘 {Math.floor(Math.random() * 50) + 1}</span>
                      </div>
                    ))}
                    <div className={styles.areaRowDisabled}>
                      <span>東上 E 區</span>
                      <span className={styles.statusSold}>已售完</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Captcha & Qty */}
          {phase === 3 && (
            <div className={styles.phase3}>
              <div className={styles.selectionSummary}>
                所選區域：<span className={styles.blueBox}>{selectedArea}</span> | 最多可選 4 張
              </div>

              <table className={styles.qtyTable}>
                <thead>
                  <tr>
                    <th>票種 / 票價(元)</th>
                    <th>數量選擇</th>
                    <th>備註</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.blueText}>全票 ${selectedPrice}</td>
                    <td>
                      <select value={ticketQty} onChange={(e) => setTicketQty(parseInt(e.target.value))}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.captchaSection}>
                <div className={styles.captchaWrapper}>
                  <div className={styles.captchaDisplay} onClick={generateCaptcha}>
                    {captchaData.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
                          translate: `0 ${item.offset}px`,
                          margin: '0 5px'
                        }}
                      >
                        {item.char}
                      </span>
                    ))}
                  </div>
                  <div className={styles.captchaInputBox}>
                    <input
                      ref={captchaInputRef}
                      type="text"
                      placeholder="請輸入驗證碼"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      autoComplete="off"
                    />
                    <p className={styles.captchaHint}>※驗證碼請輸入英文，可點圖片刷新驗證碼</p>
                  </div>
                </div>
              </div>

              <div className={styles.finalAgreement}>
                <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} id="final-ag" />
                <label htmlFor="final-ag">
                  我已詳細閱讀且同意<a href="#">會員服務條款</a>及節目資訊公告，並同意放棄契約審閱期...
                </label>
              </div>

              <div className={styles.bottomBtns}>
                <button className={styles.btnGray} onClick={() => setPhase(2)}>重新選擇</button>
                <button className={styles.btnGreen} onClick={handleSubmit}>確認張數</button>
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay (繞圈圈) */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>正在通訊中，請稍候...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaydaySim;
