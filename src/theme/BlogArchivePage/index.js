
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
          <h1 className="archive-title">所有貼文</h1>
        </header>

        {displayData.map((yearGroup) => (
          <section key={yearGroup.year} className="year-section">
            <details className="year-details" open>
              <summary className="year-summary">
                <div className="year-info">
                  <span className="year-label">{yearGroup.year}</span>
                  <span className="year-badge">{yearGroup.months.reduce((sum, m) => sum + m.posts.length, 0)} 篇</span>
                </div>
                <span className="arrow-icon"></span>
              </summary>

              <div className="months-grid">
                {yearGroup.months.map((monthGroup) => (
                  <details key={monthGroup.month} className="month-item" open>
                    <summary className="month-header">
                      <span className="month-text">{monthGroup.month} 月</span>
                      <span className="arrow-icon small"></span>
                    </summary>
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
                  </details>
                ))}
              </div>
            </details>
          </section>
        ))}
      </main>

      <style>{`
        .archive-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 80vh;
        }

        .archive-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: var(--ifm-color-primary);
          text-align: center;
        }

        /* 移除原生箭頭 */
        details > summary { list-style: none; outline: none; }
        details > summary::-webkit-details-marker { display: none; }

        /* 年份樣式 */
        .year-section { margin-bottom: 2rem; }
        .year-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 2px solid var(--ifm-color-emphasis-200);
          cursor: pointer;
        }

        .year-label { font-size: 1.75rem; font-weight: 800; margin-right: 1rem; }
        .year-badge { 
          font-size: 0.9rem; 
          background: var(--ifm-color-emphasis-200);
          padding: 2px 10px;
          border-radius: 20px;
          color: var(--ifm-color-emphasis-700);
        }

        /* 月份網格邏輯：電腦版並排，手機版堆疊 */
        .months-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem 0;
        }

        .month-item {
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 12px;
          padding: 1rem;
          background: var(--ifm-background-surface-color);
          height: fit-content;
        }

        .month-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: var(--ifm-color-primary);
        }

        /* 統一箭頭樣式 */
        .arrow-icon {
          width: 10px; height: 10px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg);
          transition: 0.2s;
          margin-right: 5px;
        }
        details[open] > summary .arrow-icon { transform: rotate(-135deg); }
        .arrow-icon.small { width: 6px; height: 6px; opacity: 0.5; }

        /* 文章列表 */
        .post-list { list-style: none; padding: 0; margin: 0; }
        .post-link {
          display: flex;
          gap: 12px;
          padding: 6px 4px;
          text-decoration: none !important;
          color: var(--ifm-font-color-base) !important;
          font-size: 0.95rem;
          border-radius: 4px;
        }
        .post-link:hover { background: var(--ifm-color-emphasis-100); }
        .post-date { color: var(--ifm-color-emphasis-600); font-family: monospace; flex-shrink: 0; }
        .post-title { line-height: 1.4; }

        @media (max-width: 768px) {
          .archive-title { font-size: 1.8rem; text-align: left; }
          .months-grid { grid-template-columns: 1fr; gap: 1rem; }
          .year-label { font-size: 1.5rem; }
        }
      `}</style>
    </Layout>
  );
}
