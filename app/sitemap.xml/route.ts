import { NextResponse } from 'next/server';
import { constants } from '@app/components/constants';
import { fetchAllPostsAdmin } from '@app/model/blog/blog.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const base = constants.companyWebsite;

  const staticUrls: {
    loc: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
  }[] = [
    { loc: base, changefreq: 'weekly', priority: '1.0' },
    { loc: `${base}/about`, changefreq: 'monthly', priority: '0.9' },
    { loc: `${base}/services`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${base}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${base}/relocation-hub`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${base}/quote`, changefreq: 'daily', priority: '0.8' },
    { loc: `${base}/travel-fees`, changefreq: 'weekly', priority: '0.8' },
  ];

  let postUrls: {
    loc: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
  }[] = [];
  try {
    const posts = await fetchAllPostsAdmin();
    postUrls = posts
      .filter((p: any) => p?.slug)
      .map((p: any) => ({
        loc: `${base}/relocation-hub/${p.slug}`,
        lastmod: p.lastPublishedDate
          ? new Date(p.lastPublishedDate).toISOString()
          : new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.6',
      }));
  } catch {
    // serve static URLs only if blog fetch fails
  }

  const all = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map((u) =>
    [
      '  <url>',
      `    <loc>${u.loc}</loc>`,
      u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
