// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KAI BLOG',
  favicon: 'img/channels4_profile.jpg',
  url: 'https://kaiblog.is-a.dev',
  baseUrl: '/',
  organizationName: 'kaihchs118',
  projectName: 'kaiblog',
  onBrokenLinks: 'throw',

  future: { v4: true },

  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // --- Google Analytics (GTAG) 保持不變 ---
        gtag: {
          trackingID: 'G-7916V6HGTV',
          anonymizeIP: true,
        },
        
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          onInlineTags: 'warn',
          onUntruncatedBlogPosts: 'warn',
          
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [

        [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "zh"], 
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
      },
    ],

    // --- 新增：Microsoft Clarity 插件設定 ---
    () => ({
      name: 'microsoft-clarity',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'script',
              innerHTML: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "vbv2g82ods");
              `,
            },
          ],
        };
      },
    }),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurusd.jpg',

      colorMode: { respectPrefersColorScheme: false },
      // docusaurus.config.js



      navbar: {
        title: 'KAI BLOG',
        logo: { alt: 'Logo', src: 'img/channels4_profile.jpg' },
        items: [
           
          { to: '/blog', label: '📝 最新貼文', position: 'left' },
            { to: '/blog/archive', label: '🗄️ 貼文列表', position: 'left' },
          { to: '/random', label: '🎲 隨機', position: 'left' }, 
          { to: '/docs', label: '📚 筆記', position: 'left' },
          { to: '/app', label: '📱 應用程式', position: 'left' },
          { to: '/about', label: '👤 關於', position: 'left' },
          { to: '/search', label: '🔍 全站搜尋', position: 'right' },

        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: '快速導覽',
            items: [
              { label: '最新貼文', to: '/blog' },
              { label: '筆記', to: '/docs' },
              { label: '貼文列表', to: '/blog/archive' },
              { label: '隨機連結', to: '/random' },
            ],
          },
          {
            title: '個人資訊',
            items: [
              { label: '關於我', to: '/about' },
              { label: '愛用', to: '/use' },
              { label: '應用程式', to: '/app' },
              { label: '更新紀錄', to: '/docs/update' },
            ],
          },
          {
            title: '社群媒體',
            items: [
              { label: 'YouTube (KAI STUDIO)', href: 'https://youtube.com/@kaistudio-621' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} KAI BLOG`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },

      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      
    }),
};

export default config;


