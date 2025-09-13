'use client';
import { usePaginatedPosts } from '@app/hooks/useBlog';
import { formatDate } from '@app/utils/format-date';
import PaginationLinks from '@app/components/pagination/PaginationLinks';
import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import { Loader } from 'lucide-react';
import PostThumb from '@app/components/Blog/PostThumb';

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
                <PostThumb
                  key={post?.id || post?._id || index}
                  post={post}
                  index={index}
                />
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
