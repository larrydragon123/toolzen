interface Env {
  SUGGESTIONS_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body: { toolName?: string; description?: string; email?: string | null } = await context.request.json();

    if (!body.toolName || !body.toolName.trim()) {
      return new Response(JSON.stringify({ error: 'Tool name is required' }), { status: 400, headers });
    }
    if (!body.description || !body.description.trim()) {
      return new Response(JSON.stringify({ error: 'Description is required' }), { status: 400, headers });
    }

    const suggestion = {
      id: crypto.randomUUID(),
      toolName: body.toolName.trim(),
      description: body.description.trim(),
      email: body.email?.trim() || null,
      createdAt: new Date().toISOString(),
      ip: context.request.headers.get('cf-connecting-ip') || 'unknown',
    };

    const key = `suggestion:${suggestion.id}`;
    await context.env.SUGGESTIONS_KV.put(key, JSON.stringify(suggestion));

    const index = await context.env.SUGGESTIONS_KV.get('suggestions:index');
    const ids: string[] = index ? JSON.parse(index) : [];
    ids.unshift(suggestion.id);
    await context.env.SUGGESTIONS_KV.put('suggestions:index', JSON.stringify(ids.slice(0, 500)));

    return new Response(JSON.stringify({ ok: true, id: suggestion.id }), { status: 201, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
}
