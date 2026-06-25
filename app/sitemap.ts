import { MetadataRoute } from 'next';
import { constants } from '@app/components/constants';
import { fetchAllPostsAdmin } from '@app/model/blog/blog.service';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = constants.companyWebsite;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/relocation-hub`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quotation`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchAllPostsAdmin();
    postRoutes = posts
      .filter((p: any) => p?.slug)
      .map((p: any) => ({
        url: `${baseUrl}/relocation-hub/${p.slug}`,
        lastModified: p.lastPublishedDate
          ? new Date(p.lastPublishedDate)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
  } catch {
    // Degrade gracefully — static routes still served if blog fetch fails
  }

  return [...staticRoutes, ...postRoutes];
}
