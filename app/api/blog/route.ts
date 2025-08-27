import { fetchAllPostsAdmin } from '@app/model/blog/blog.service';

export async function GET() {
  try {
    const items = await fetchAllPostsAdmin();
    return new Response(JSON.stringify({ items: items ?? [] }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch blog posts', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch blog posts' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
