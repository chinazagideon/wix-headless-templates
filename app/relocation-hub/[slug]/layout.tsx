import type { Metadata } from 'next';
import { constants } from '@app/components/constants';
import { fetchPostBySlugAdminWithContent } from '@app/model/blog/blog.service';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params?.slug;
  try {
    const post: any = await fetchPostBySlugAdminWithContent(slug);
    if (!post) {
      return {
        title: 'Relocation Hub',
        description: 'Read blog posts about our relocation stories',
        alternates: { canonical: `/relocation-hub/${slug}` },
        openGraph: {
          title: 'Relocation Hub',
          description: 'Read blog posts about our relocation stories',
          url: `/relocation-hub/${slug}`,
          siteName: constants.companyName,
          type: 'article',
        },
      };
    }

    const title = post?.title
      ? `${post.title} | ${constants.companyName}`
      : 'Relocation Hub';
    const rawDesc = (post?.excerpt || post?.contentText || '') as string;
    const description = rawDesc
      ? rawDesc.trim().replace(/\s+/g, ' ').slice(0, 160)
      : 'Read blog posts about our relocation stories';
    const imageUrl =
      post?.media?.wixMedia?.image?.url || post?.coverMedia?.image?.url;
    const canonical = `/relocation-hub/${slug}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: constants.companyName,
        type: 'article',
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (e) {
    return {
      title: 'Relocation Hub',
      description: 'Read blog posts about our relocation stories',
      alternates: { canonical: `/relocation-hub/${slug}` },
      openGraph: {
        title: 'Relocation Hub',
        description: 'Read blog posts about our relocation stories',
        url: `/relocation-hub/${slug}`,
        siteName: constants.companyName,
        type: 'article',
      },
    };
  }
}

export default function RelocationHubSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
