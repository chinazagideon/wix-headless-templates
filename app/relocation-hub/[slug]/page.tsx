import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate } from '@app/utils/format-date';
import { fetchAllPostsAdmin, fetchPostBySlugAdmin, fetchPostBySlugAdminRaw } from '@app/model/blog/blog.service';

export const revalidate = 3600; // ISR: revalidate every hour

export async function generateStaticParams() {
    const items = await fetchAllPostsAdmin();
    const slugs = (items ?? []).map((p: any) => p?.slug).filter(Boolean);
    return slugs.map((slug: string) => ({ slug }));
}

async function getPostBySlug(slug: string) {
    return fetchPostBySlugAdmin(slug);
}

export default async function Page({ params }: { params: { slug: string } }) {
    const [post, raw] = await Promise.all([
        getPostBySlug(params.slug),
        fetchPostBySlugAdminRaw(params.slug),
    ]);
    if (!post) return notFound();

    // Normalize media image to object with url
    const rawImage = (post as any)?.media?.wixMedia?.image ?? (post as any)?.media?.image ?? undefined;
    const imageObj = typeof rawImage === 'string' ? { id: rawImage, url: rawImage } : rawImage;

    return (
        <>
            <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto justify-center items-center">
                <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
                    <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
                        <span className="text-theme-orange font-bold">{post.title}</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {post.excerpt}
                    </p>
                </div>
            </div>
            <div className="min-h-screen bg-white text-black justify-center items-center px-4 py-10">
                <div className="max-w-3xl mx-auto px-4 py-10">
                    {/* <h1 className="text-3xl font-bold mb-3">{post.title}</h1> */}
                    <p className="text-sm text-gray-500 mb-6">
                        {post.firstPublishedDate ? formatDate(post.firstPublishedDate) : ''}
                    </p>
                    {imageObj?.url ? (
                        <div className="mb-6 rounded-md overflow-hidden">
                            <Image
                                src={imageObj.url as string}
                                alt={post.title as string}
                                width={1024}
                                height={576}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}