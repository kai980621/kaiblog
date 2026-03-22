import React from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function MonthSection({month, posts}) {
  return (
    <div className="archive_month_block">
      <Heading as="h4" className="archive_month_title">
        {month}月
      </Heading>
      <ul className="archive_post_list">
        {posts.map((post) => (
          <li key={post.metadata.permalink}>
            <Link to={post.metadata.permalink} className="archive_post_link">
              <span className="archive_post_date">{post.metadata.date.split('-')[2]}日</span>
              <span className="archive_post_title">{post.metadata.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function YearSection({year, months}) {
  return (
    <section className="archive_year_section">
      <Heading as="h2" id={year} className="archive_year_title">
        {year} 年
      </Heading>
      <div className="archive_year_content">
        {months.map((monthData) => (
          <MonthSection key={monthData.month} {...monthData} />
        ))}
      </div>
    </section>
  );
}

function groupPosts(blogPosts) {
  const yearsMap = new Map();
  
  blogPosts.forEach(post => {
    const date = new Date(post.metadata.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    
    if (!yearsMap.has(year)) {
      yearsMap.set(year, new Map());
    }
    const monthsMap = yearsMap.get(year);
    if (!monthsMap.has(month)) {
      monthsMap.set(month, []);
    }
    monthsMap.get(month).push(post);
  });

  return Array.from(yearsMap.entries())
    .sort(([a], [b]) => b - a) // Recent years first
    .map(([year, monthsMap]) => ({
      year,
      months: Array.from(monthsMap.entries())
        .sort(([a], [b]) => b - a) // Recent months first
        .map(([month, posts]) => ({ month, posts }))
    }));
}

export default function BlogArchive({archive}) {
  const title = "🗄️ 貼文存檔";
  const description = "按年份與月份分類的所有文章列表";
  const groupedData = groupPosts(archive.blogPosts);

  return (
    <>
      <PageMetadata title={title} description={description} />
      <Layout>
        <div className="container margin-vert--xl archive_container">
          <header className="archive_header">
            <Heading as="h1">{title}</Heading>
            <p>{description}</p>
          </header>
          
          <main>
            {groupedData.map((yearData) => (
              <YearSection key={yearData.year} {...yearData} />
            ))}
          </main>
        </div>

        <style>{`
          .archive_container { max-width: 900px; }
          .archive_header { text-align: center; margin-bottom: 4rem; }
          .archive_header h1 { font-size: 3rem; font-weight: 900; background: var(--hero-gradient); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
          
          .archive_year_section { margin-bottom: 5rem; position: relative; }
          .archive_year_title { font-size: 2.5rem; font-weight: 900; color: var(--ifm-color-primary); margin-bottom: 2rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 0.5rem; }
          
          .archive_month_block { margin-bottom: 2.5rem; padding-left: 2rem; border-left: 3px solid var(--glass-border); }
          .archive_month_title { font-size: 1.5rem; color: var(--ifm-color-primary-dark); margin-bottom: 1rem; }
          
          .archive_post_list { list-style: none; padding: 0 !important; }
          .archive_post_list li { margin-bottom: 0.75rem; }
          .archive_post_link { display: flex; gap: 1rem; align-items: baseline; text-decoration: none !important; color: inherit !important; transition: 0.2s; padding: 0.5rem; border-radius: 8px; }
          .archive_post_link:hover { background: var(--glass-bg); color: var(--ifm-color-primary) !important; transform: translateX(5px); }
          
          .archive_post_date { font-family: 'DM Mono', monospace; font-weight: bold; opacity: 0.5; font-size: 0.9rem; flex-shrink: 0; width: 40px; }
          .archive_post_title { font-size: 1.1rem; font-weight: 500; }
          
          [data-theme='dark'] .archive_post_link:hover { background: rgba(255,255,255,0.05); }
        `}</style>
      </Layout>
    </>
  );
}
