interface Env {
  SUGGESTIONS_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const url = new URL(context.request.url);
  const password = url.searchParams.get('password');

  if (!context.env.ADMIN_PASSWORD || password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }

  try {
    const index = await context.env.SUGGESTIONS_KV.get('suggestions:index');
    const ids: string[] = index ? JSON.parse(index) : [];

    const suggestions = await Promise.all(
      ids.map(async (id) => {
        const raw = await context.env.SUGGESTIONS_KV.get(`suggestion:${id}`);
        return raw ? JSON.parse(raw) : null;
      })
    );

    return new Response(JSON.stringify({
      count: suggestions.length,
      suggestions: suggestions.filter(Boolean),
    }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
