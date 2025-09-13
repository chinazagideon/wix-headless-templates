import { notFound } from 'next/navigation';
import { formatDate } from '@app/utils/format-date';
import RichContent from '@app/components/Blog/RichContent';
import PostThumb from '@app/components/Blog/PostThumb';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import routes from '@app/components/Layout/NavBarV2/routes';
import {
  fetchAllPostsAdmin,
  fetchPostBySlugAdmin,
  fetchPostBySlugAdminRaw,
  fetchPostBySlugAdminWithContent,
  fetchMostReadPosts,
} from '@app/model/blog/blog.service';
import PageHeader from '@app/components/Layout/PageHeader';

export const revalidate = 3600; // Disable ISR temporarily for live testing
export const dynamic = 'force-dynamic'; // Force SSR to avoid serving old SSG HTML

// Rendering moved to RichContent component

export async function generateStaticParams() {
  const items = await fetchAllPostsAdmin();
  const slugs = (items ?? []).map((p: any) => p?.slug).filter(Boolean);
  return slugs.map((slug: string) => ({ slug }));
}

async function getPostBySlug(slug: string) {
  return fetchPostBySlugAdmin(slug);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [post, raw, withContent, mostRead] = await Promise.all([
    getPostBySlug(params.slug),
    fetchPostBySlugAdminRaw(params.slug),
    fetchPostBySlugAdminWithContent(params.slug),
    fetchMostReadPosts(4),
  ]);
  if (!post) return notFound();

  // Normalize media image to object with url
  const rawImage =
    (post as any)?.media?.wixMedia?.image ??
    (post as any)?.media?.image ??
    undefined;
  const imageObj =
    typeof rawImage === 'string' ? { id: rawImage, url: rawImage } : rawImage;

  return (
    <>
      <PageHeader title={post.title} description={post.excerpt} />
      {/* <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto justify-center items-center">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
            <span className="text-theme-orange font-bold">{post.title}</span>
          </h1>
          <p className="text-gray-500 text-sm">{post.excerpt}</p>
        </div>
      </div> */}
      <div className="min-h-screen bg-white text-black justify-center items-center px-4 py-10">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* <h1 className="text-3xl font-bold mb-3">{post.title}</h1> */}
          <p className="text-sm text-gray-500 mb-6">
            Published on{' '}
            {post.firstPublishedDate ? formatDate(post.firstPublishedDate) : ''}
          </p>

          {/* Render post rich content */}
          <RichContent
            richContent={withContent?.richContent}
            contentText={withContent?.contentText}
          />
          {!withContent?.richContent?.nodes?.length &&
          !withContent?.contentText ? (
            <p className="text-base text-gray-700">{post.excerpt}</p>
          ) : null}
        </div>
      </div>
      <div className="bg-white text-black px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Most read</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mostRead || []).slice(0, 3).map((p: any, idx: number) => (
              <PostThumb key={p?.id || p?._id || idx} post={p} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center gap-2 mt-2 mb-2">
        <Link
          href={routes.relocation_hub}
          className="flex flex-row items-center gap-2"
        >
          <ArrowRightIcon className="h-3 w-3  text-theme-orange hover:text-theme-orange-dark" />
          <span className="text-theme-orange hover:text-theme-orange-dark">
            Read More on Relocation Hub
          </span>
        </Link>
      </div>
    </>
  );
}
