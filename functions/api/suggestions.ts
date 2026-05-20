interface Env {
  SUGGESTIONS_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

function authError(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
  });
}

function extractPassword(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const url = new URL(request.url);
  return url.searchParams.get('password');
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const password = extractPassword(context.request);
  if (!context.env.ADMIN_PASSWORD || password !== context.env.ADMIN_PASSWORD) {
    return authError();
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

export async function onRequestDelete(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const password = extractPassword(context.request);
  if (!context.env.ADMIN_PASSWORD || password !== context.env.ADMIN_PASSWORD) {
    return authError();
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400, headers });
    }

    await context.env.SUGGESTIONS_KV.delete(`suggestion:${id}`);

    const index = await context.env.SUGGESTIONS_KV.get('suggestions:index');
    const ids: string[] = index ? JSON.parse(index) : [];
    const filtered = ids.filter(i => i !== id);
    await context.env.SUGGESTIONS_KV.put('suggestions:index', JSON.stringify(filtered));

    return new Response(JSON.stringify({ ok: true }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
}

export async function onRequestPatch(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const password = extractPassword(context.request);
  if (!context.env.ADMIN_PASSWORD || password !== context.env.ADMIN_PASSWORD) {
    return authError();
  }

  try {
    const body: { id?: string; status?: string } = await context.request.json();
    if (!body.id || !body.status) {
      return new Response(JSON.stringify({ error: 'Missing id or status' }), { status: 400, headers });
    }
    if (!['pending', 'reviewed', 'implemented'].includes(body.status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400, headers });
    }

    const raw = await context.env.SUGGESTIONS_KV.get(`suggestion:${body.id}`);
    if (!raw) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    }

    const suggestion = JSON.parse(raw);
    suggestion.status = body.status;
    await context.env.SUGGESTIONS_KV.put(`suggestion:${body.id}`, JSON.stringify(suggestion));

    return new Response(JSON.stringify({ ok: true }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
