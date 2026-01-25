'use client';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';
import { formatDate } from '@app/utils/format-date';
import Image from 'next/image';
import Link from 'next/link';
import routes from '@app/components/Layout/NavBarV2/routes';

const PostThumb = ({ post, index }: { post: any; index: number }) => {
  return (
    <>
      <div key={post?.id || post?._id || index}>
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <span className="font-bold text-xl flex flex-row items-center justify-center gap-2 rounded-md overflow-hidden">
            {post?.media?.wixMedia?.image?.url ? (
              <>
                <Image
                  src={post?.media?.wixMedia?.image?.url}
                  alt={post?.title}
                  width={440}
                  height={480}
                  className="rounded-md"
                />
              </>
            ) : null}
          </span>
          <div className="font-outfit text-sm text-center p-0.5 flex flex-col items-center justify-center">
            <div className="hover:text-gray-300 pb-3 transition-colors flex flex-col items-center justify-center">
              <div className="flex flex-col gap-2 items-start justify-start">
                <div className="flex flex-row justify-between gap-2 mb-2 border-b border-gray-200 pb-2 w-full">
                  <Link
                    className="cursor-pointer"
                    prefetch={true}
                    href={
                      post?.slug
                        ? `${routes.relocation_hub}/${post.slug}`
                        : routes.relocation_hub
                    }
                  >
                    <h1 className="text-lg font-bold font-outfit text-black normal-case cursor-pointer hover:text-theme-orange transition-colors hover:underline">
                      {post?.title ||
                        post?.title?.short?.replace(/<[^>]*>?/gm, '')}
                    </h1>
                  </Link>
                </div>

                <p className="text-xs font-light text-wrap text-left font-outfit text-gray-500">
                  {post?.excerpt || post?.subtitle || ''}
                </p>
                <div className="flex flex-row justify-between gap-2 mb-2 pb-2 w-full">
                  <Link
                    prefetch={true}
                    href={
                      post?.slug
                        ? `${routes.relocation_hub}/${post.slug}`
                        : routes.relocation_hub
                    }
                    className="hover:underline text-theme-orange text-xs hover:cursor-pointer"
                  >
                    Read More
                  </Link>
                  <div className="flex flex-row justify-end gap-2">
                    <CalendarIcon className="h-3 w-3  text-gray-500 mt-0.5" />
                    <p className="text-xs font-light font-outfit text-gray-500">
                      {formatDate(post?.firstPublishedDate || post?.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostThumb;
