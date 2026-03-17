import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function groupPostsByYearMonth(posts) {
  const groups = posts.reduce((acc, post) => {
    const d = new Date(post.metadata.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    acc[year] = acc[year] || {};
    acc[year][month] = acc[year][month] || [];
    acc[year][month].push(post);
    return acc;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => b - a)
    .map(year => ({
      year,
      months: Object.keys(groups[year])
        .sort((a, b) => b - a)
        .map(month => ({
          month,
          posts: groups[year][month],
        })),
    }));
}

export default function BlogArchivePage({ archive }) {
  const displayData =
    archive?.years
      ? archive.years.map(y => ({
          year: y.year,
          months: y.posts
            .reduce((acc, p) => {
              const m = new Date(p.metadata.date).getMonth() + 1;
              acc[m] = acc[m] || [];
              acc[m].push(p);
              return acc;
            }, {})
            .sort((a, b) => b - a)
            .map((posts, idx) => ({ month: idx + 1, posts })),
        }))
      : groupPostsByYearMonth(archive?.blogPosts || []);

  return (
    <Layout title="貼文列表">
      <main className="container margin-vert--lg" style={{ maxWidth: '1280px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '2.5rem' }}>
          貼文列表
        </h1>

        {displayData.map(yearGroup => (
          <details key={yearGroup.year} className="year-section" open>
            <summary className="year-summary">
              <span className="year-label">{yearGroup.year} 年</span>
              <span className="post-count">
                {yearGroup.months.reduce((sum, m) => sum + m.posts.length, 0)} 篇
              </span>
            </summary>

            <div className="months-container">
              {yearGroup.months.map(monthGroup => (
                <details key={monthGroup.month} className="month-item" open>
                  <summary className="month-header">
                    {monthGroup.month} 月
                  </summary>

                  <ul className="post-list">
                    {monthGroup.posts.map(post => {
                      const d = new Date(post.metadata.date);
                      const dateStr = `${d.getMonth() + 1}月${d.getDate()}日`;
                      return (
                        <li key={post.metadata.permalink}>
                          <Link to={post.metadata.permalink} className="post-item">
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
        ))}
      </main>

      <style jsx>{`
        .year-section {
          margin-bottom: 2.5rem;
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 12px;
          overflow: hidden;
          background: var(--ifm-background-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .year-summary {
          padding: 1.25rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ifm-color-primary);
          cursor: pointer;
          background: var(--ifm-background-surface-color);
          list-style: none;
        }
        .year-summary::-webkit-details-marker { display: none; }

        .post-count {
          font-size: 0.95rem;
          color: var(--ifm-color-emphasis-600);
          font-weight: 500;
        }

        .months-container {
          display: flex;
          flex-direction: row;
          gap: 1.5rem;
          padding: 1.5rem 1.75rem 1.75rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          background: var(--ifm-color-emphasis-100);
        }
        .months-container::-webkit-scrollbar {
          height: 6px;
        }
        .months-container::-webkit-scrollbar-thumb {
          background: var(--ifm-color-primary-light);
          border-radius: 3px;
        }

        .month-item {
          flex: 0 0 320px;
          background: var(--ifm-background-surface-color);
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }

        .month-header {
          padding: 1rem 1.25rem;
          font-size: 1.15rem;
          font-weight: 600;
          background: var(--ifm-background-color);
          color: var(--ifm-color-primary-dark);
          cursor: pointer;
          list-style: none;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
        }
        .month-header::-webkit-details-marker { display: none; }

        .post-list {
          list-style: none;
          margin: 0;
          padding: 0.75rem 1.25rem 1.25rem;
        }

        .post-item {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 0;
          color: var(--ifm-font-color-base);
          text-decoration: none;
          transition: color 0.15s;
        }
        .post-item:hover {
          color: var(--ifm-color-primary);
        }

        .post-date {
          font-size: 0.82rem;
          color: var(--ifm-color-emphasis-600);
          margin-bottom: 0.25rem;
        }

        .post-title {
          font-size: 1.02rem;
          line-height: 1.4;
        }

        @media (max-width: 996px) {
          .months-container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 1.25rem;
          }
          .month-item {
            flex: none;
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}