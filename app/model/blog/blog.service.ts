import { media as wixMedia } from '@wix/sdk';
import { getWixAdminClient } from '@app/model/blog/blog.admin';

const asUrlObject = (image: any) => {
  if (!image) return image;
  if (typeof image === 'string') {
    const url = wixMedia.getScaledToFillImageUrl(image, 1024, 576, {});
    return { id: image, url };
  }
  return image;
};

const normalizeMedia = (media: any) => {
  if (!media) return media;
  const wixMediaObj = media?.wixMedia ?? media;
  const image = asUrlObject(wixMediaObj?.image ?? media?.image);
  if (!image) return media;
  return {
    ...media,
    wixMedia: { ...(media?.wixMedia || {}), image },
  };
};

export const normalizePost = (item: any) => ({
  _id: item?._id ?? item?.id,
  id: item?.id ?? item?._id,
  title: item?.title,
  excerpt: item?.excerpt ?? item?.subtitle ?? '',
  firstPublishedDate: item?.firstPublishedDate ?? item?.date,
  lastPublishedDate: item?.lastPublishedDate ?? item?.date,
  slug: item?.slug,
  featured: item?.featured,
  pinned: item?.pinned,
  categoryIds: item?.categoryIds ?? [],
  coverMedia: normalizeMedia(item?.coverMedia),
  memberId: item?.memberId,
  hashtags: item?.hashtags ?? [],
  commentingEnabled: item?.commentingEnabled ?? false,
  minutesToRead: item?.minutesToRead,
  tagIds: item?.tagIds ?? [],
  relatedPostIds: item?.relatedPostIds ?? [],
  pricingPlanIds: item?.pricingPlanIds ?? [],
  language: item?.language,
  preview: item?.preview ?? false,
  contentId: item?.contentId,
  mostRecentContributorId: item?.mostRecentContributorId,
  media: normalizeMedia(item?.media),
  hasUnpublishedChanges: item?.hasUnpublishedChanges ?? false,
  translations: item?.translations ?? [],
  customExcerpt: item?.customExcerpt ?? false,
  internalCategoryIds: item?.internalCategoryIds ?? [],
  internalRelatedPostIds: item?.internalRelatedPostIds ?? [],
});

export async function fetchAllPostsAdmin() {
  const client = getWixAdminClient();
  const { items } = await client.posts.queryPosts().find();
  return (items ?? []).map(normalizePost);
}

export async function fetchPostBySlugAdmin(slug: string) {
  const items = await fetchAllPostsAdmin();
  return items.find((p) => p.slug === slug) ?? null;
}

// RAW (un-normalized) helpers
export async function fetchAllPostsAdminRaw() {
  const client = getWixAdminClient();
  const { items } = await client.posts.queryPosts().find();
  return items ?? [];
}

export async function fetchPostBySlugAdminRaw(slug: string) {
  const items = await fetchAllPostsAdminRaw();
  return (items as any[]).find((p) => p?.slug === slug) ?? null;
}

// Fetch a single post by slug including full rich content
export async function fetchPostBySlugAdminWithContent(slug: string) {
  const client = getWixAdminClient();
  const res = await client.posts.getPostBySlug(slug, {
    fieldsets: ['RICH_CONTENT', 'CONTENT_TEXT'],
  } as any);
  const post = (res as any)?.post ?? null;
  if (!post) return null;
  const normalized = normalizePost(post);
  return {
    ...normalized,
    richContent: post?.richContent,
    contentText: post?.contentText,
  } as any;
}

// Fetch most-read posts (sorted by view count)
export async function fetchMostReadPosts(limit: number = 4) {
  const client = getWixAdminClient();
  // Sort by view count descending if supported; fallback to published date desc
  try {
    const res = await client.posts.listPosts({
      sort: 'VIEW_COUNT' as any,
      paging: { limit },
    } as any);
    const items = (res as any)?.posts ?? [];
    return (items ?? []).map(normalizePost);
  } catch (e) {
    const res = await client.posts.listPosts({
      sort: 'PUBLISHED_DATE_DESC' as any,
      paging: { limit },
    } as any);
    const items = (res as any)?.posts ?? [];
    return (items ?? []).map(normalizePost);
  }
}
