import { writeFileSync } from 'fs';
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { posts } from '@wix/blog';

const BASE_URL = 'https://icandomovers.ca';

const staticUrls = [
  { loc: BASE_URL, changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE_URL}/services`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/relocation-hub`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${BASE_URL}/quote`, changefreq: 'daily', priority: '0.8' },
  { loc: `${BASE_URL}/travel-fees`, changefreq: 'weekly', priority: '0.8' },
];

async function fetchPosts() {
  const { WIX_API_KEY, WIX_ACCOUNT_ID, WIX_SITE_ID } = process.env;
  if (!WIX_API_KEY || !WIX_ACCOUNT_ID) {
    console.warn('WIX_API_KEY / WIX_ACCOUNT_ID not set — skipping blog posts');
    return [];
  }
  const client = createClient({
    modules: { posts },
    auth: ApiKeyStrategy({ apiKey: WIX_API_KEY, accountId: WIX_ACCOUNT_ID, siteId: WIX_SITE_ID }),
  });
  const { items } = await client.posts.queryPosts().find();
  return items ?? [];
}

function toUrl(entry) {
  return [
    '  <url>',
    `    <loc>${entry.loc}</loc>`,
    entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  let postUrls = [];
  try {
    const items = await fetchPosts();
    postUrls = items
      .filter((p) => p?.slug)
      .map((p) => ({
        loc: `${BASE_URL}/relocation-hub/${p.slug}`,
        lastmod: p.lastPublishedDate ? new Date(p.lastPublishedDate).toISOString() : new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.6',
      }));
  } catch (err) {
    console.warn('Failed to fetch blog posts:', err.message);
  }

  const all = [...staticUrls, ...postUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(toUrl).join('\n')}
</urlset>`;

  writeFileSync('public/sitemap.xml', xml, 'utf-8');
  console.log(`sitemap.xml written — ${all.length} URLs (${postUrls.length} blog posts)`);
}

main().catch((err) => {
  console.error('sitemap generation failed:', err);
  process.exit(1);
});
