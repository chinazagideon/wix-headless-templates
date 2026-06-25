import { fetchLatestPosts } from '@app/model/blog/blog.service';
import PostThumb from '@app/components/Blog/PostThumb';
import Link from 'next/link';
import routes from '@app/components/Layout/NavBarV2/routes';

export default async function LatestPosts() {
  let posts: any[] = [];
  try {
    posts = await fetchLatestPosts(3);
  } catch {
    return null;
  }
  if (!posts.length) return null;

  return (
    <section className="bg-[#FDFAF5] py-20 md:py-24" id="latest-posts">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="text-center mb-9">
          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-theme-orange mb-2">
            Relocation Hub
          </p>
          <h2
            className="font-serif font-bold text-[#1A1208] mb-3"
            style={{ fontSize: 'clamp(28px,3vw,38px)' }}
          >
            Moving tips from our crew
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <PostThumb key={post?.id || post?._id || idx} post={post} index={idx} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={routes.relocation_hub}
            className="inline-flex items-center gap-2 text-theme-orange font-semibold text-sm hover:underline"
          >
            Read all posts on Relocation Hub →
          </Link>
        </div>
      </div>
    </section>
  );
}
