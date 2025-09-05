'use client';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { usePaginatedPosts } from '@app/hooks/useBlog';
import { formatDate } from '@app/utils/format-date';
import PaginationLinks from '@app/components/pagination/PaginationLinks';
import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import { BinocularsIcon, Loader, Gauge } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const {
    items: posts,
    page,
    totalPages,
    hasNext,
    hasPrev,
    next,
    prev,
    setPage,
    isLoading,
    isFetching,
    isError,
  } = usePaginatedPosts(1, 9);

  return (
    <>
      <PageHeader
        title="Relocation Hub"
        description="Read blog posts about our relocation stories"
      />
      {/* <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
            <span className="text-theme-orange font-bold">Winnipeg</span>{' '}
            Relocation Hub
          </h1>
          <p className="text-gray-500 text-sm">
            Read blog posts about our relocation stories
          </p>
        </div>
      </div> */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl overflow-hidden mx-auto h-full text-black flex flex-col lg:grid lg:grid-cols-3 items-center justify-center gap-4">
          {isLoading ||
            (isFetching && (
              <div className="flex items-center justify-center">
                <Loader className="w-10 h-10 animate-spin text-theme-orange" />
              </div>
            ))}
          {isError && (
            <div className="flex items-center justify-center">
              Error loading posts
            </div>
          )}
          {!isLoading && !isFetching && !isError && posts.length === 0 && (
            <div className="flex items-center justify-center">
              No posts found
            </div>
          )}
          {!isLoading && !isFetching && !isError && posts.length > 0 && (
            <>
              {posts.map((post: any, index: number) => (
                <div
                  key={post?.id || post?._id || index}
                  className="flex flex-col items-center justify-center gap-2 w-full"
                >
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
                  <div className="font-outfit text-sm text-center p-3 flex flex-col items-center justify-center">
                    <div className="hover:text-gray-300 pb-3 transition-colors flex flex-col items-center justify-center">
                      <div className="flex flex-col gap-2 items-start justify-start">
                        <div className="flex flex-row justify-between gap-2 mb-2 border-b border-gray-200 pb-2 w-full">
                          <div className="flex flex-row justify-start gap-2">
                            <CalendarIcon className="h-4 w-4 text-theme-orange" />
                            <p className="text-xs font-light font-outfit text-gray-500">
                              {formatDate(
                                post?.firstPublishedDate || post?.date
                              )}
                            </p>
                          </div>
                          <div className="flex flex-row justify-end gap-2">
                            <PencilIcon className="h-4 w-4 text-theme-orange" />
                            <p className="text-xs font-light font-outfit text-gray-500">
                              {post?.location || 'Winnipeg, MB'}
                            </p>
                          </div>
                        </div>
                        <h1
                          className="text-lg font-bold font-outfit text-black normal-case cursor-pointer hover:text-theme-orange transition-colors hover:underline"
                          onClick={() =>
                            router.push(`/relocation-hub/${post?.slug}`)
                          }
                        >
                          {post?.title ||
                            post?.title?.short?.replace(/<[^>]*>?/gm, '')}
                        </h1>

                        <p className="text-xs font-light text-wrap text-left font-outfit text-gray-500">
                          {post?.excerpt || post?.subtitle || ''}
                        </p>
                        <a
                          href={
                            post?.slug
                              ? `/relocation-hub/${post.slug}`
                              : '/relocation-hub'
                          }
                          className="hover:underline text-theme-orange text-xs cursor-pointer"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {!isLoading && !isFetching && !isError && (
          <PaginationLinks
            prev={prev}
            next={next}
            hasPrev={hasPrev}
            hasNext={hasNext}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default Page;
