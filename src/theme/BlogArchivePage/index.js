import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function createDisplayData(posts) {
  const groups = posts.reduce((acc, post) => {
    const d = new Date(post.metadata.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(post);
    return acc;
  }, {});

  return Object.keys(groups).sort((a, b) => b - a).map(year => ({
    year,
    months: Object.keys(groups[year]).sort((a, b) => b - a).map(month => ({
      month,
      posts: groups[year][month]
    }))
  }));
}

export default function BlogArchivePage(props) {
  const archive = props.archive;
  let displayData = [];

  if (archive && archive.years) {
    displayData = archive.years.map(y => {
      const monthGroups = y.posts.reduce((acc, p) => {
        const m = new Date(p.metadata.date).getMonth() + 1;
        if (!acc[m]) acc[m] = [];
        acc[m].push(p);
        return acc;
      }, {});
      return {
        year: y.year,
        months: Object.keys(monthGroups).sort((a, b) => b - a).map(m => ({
          month: m,
          posts: monthGroups[m]
        }))
      };
    });
  } else if (archive && archive.blogPosts) {
    displayData = createDisplayData(archive.blogPosts);
  }

  return (
    <Layout title="貼文列表">
      <main className="archive-container">
        <header className="archive-header">
          <h1>所有貼文</h1>
        </header>

        {displayData.map((yearGroup) => (
          <section key={yearGroup.year} className="year-section">
            <div className="year-heading-wrapper">
              <h2 className="year-heading">{yearGroup.year}</h2>
              <span className="year-count">
                {yearGroup.months.reduce((sum, m) => sum + m.posts.length, 0)} 篇
              </span>
            </div>

            <div className="months-grid">
              {yearGroup.months.map((monthGroup) => (
                <div key={monthGroup.month} className="month-block">
                  <h3 className="month-heading">{monthGroup.month} 月</h3>
                  <ul className="post-list">
                    {monthGroup.posts.map((post) => {
                      const dateObj = new Date(post.metadata.date);
                      const dateStr = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}`;
                      
                      return (
                        <li key={post.metadata.permalink}>
                          <Link to={post.metadata.permalink} className="post-link">
                            <span className="post-date">{dateStr}</span>
                            <span className="post-title">{post.metadata.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <style>{`
        /* 容器與標題 */
        .archive-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          min-height: 85vh;
        }
        
        .archive-header h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 3rem;
          color: var(--ifm-color-primary);
        }

        /* 年份區塊 */
        .year-section {
          margin-bottom: 4rem;
        }

        .year-heading-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 2px solid var(--ifm-color-emphasis-200);
          padding-bottom: 0.5rem;
          margin-bottom: 2rem;
        }

        .year-heading {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          color: var(--ifm-font-color-base);
        }

        .year-count {
          font-size: 1rem;
          color: var(--ifm-color-emphasis-500);
          font-weight: 600;
        }

        /* 月份網格 (核心改進：捨棄橫向滾動，改用自動網格) */
        .months-grid {
          display: grid;
          /* 電腦版自動排滿，最小寬度 300px，排不下自動換行 */
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .month-heading {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--ifm-color-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* 月份標題旁的小圓點點綴 */
        .month-heading::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--ifm-color-primary);
          opacity: 0.7;
        }

        /* 貼文列表與 hover 效果 */
        .post-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .post-link {
          display: flex;
          align-items: flex-start;
          text-decoration: none !important;
          padding: 0.75rem;
          border-radius: 8px;
          margin-left: -0.75rem; /* 對齊修正 */
          transition: background-color 0.2s ease;
        }

        .post-link:hover {
          background-color: var(--ifm-color-emphasis-100);
        }

        .post-date {
          flex-shrink: 0;
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--ifm-color-emphasis-500);
          margin-right: 1rem;
          margin-top: 0.1rem; /* 微調與標題對齊 */
        }

        .post-title {
          font-size: 1rem;
          font-weight: 500;
          color: var(--ifm-font-color-base);
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .post-link:hover .post-title {
          color: var(--ifm-color-primary);
        }

        /* 手機版微調 */
        @media (max-width: 768px) {
          .archive-header h1 {
            font-size: 2.5rem;
          }
          .months-grid {
            grid-template-columns: 1fr; /* 手機版變成單行 */
            gap: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
}
