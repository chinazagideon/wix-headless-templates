import { wixClient as serverClient } from '@app/server/wix';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const fieldsParam = searchParams.getAll('fields');

    if (id) {
      const data = await serverClient.collections.listDataCollections({
        paging: { limit: 1, offset: 0 },
        fields: fieldsParam?.length ? fieldsParam : undefined,
      });
      // Prefer get when we have explicit id
      const one = await serverClient.collections.getDataCollection(id, {
        fields: fieldsParam?.length ? fieldsParam : undefined,
      });
      return new Response(JSON.stringify({ collection: one }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    const limit = limitParam ? Math.max(1, Number(limitParam)) : 100;
    const offset = offsetParam ? Math.max(0, Number(offsetParam)) : 0;
    const result = await serverClient.collections.listDataCollections({
      paging: { limit, offset },
      fields: fieldsParam?.length ? fieldsParam : undefined,
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch collections', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch collections' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}


