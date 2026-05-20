interface Env {
  SUGGESTIONS_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body: { toolName?: string; description?: string; email?: string | null } = await context.request.json();

    const toolName = body.toolName?.trim();
    const description = body.description?.trim();

    if (!toolName) {
      return new Response(JSON.stringify({ error: 'Tool name is required' }), { status: 400, headers });
    }
    if (toolName.length > 100) {
      return new Response(JSON.stringify({ error: 'Tool name too long (max 100 characters)' }), { status: 400, headers });
    }
    if (!description) {
      return new Response(JSON.stringify({ error: 'Description is required' }), { status: 400, headers });
    }
    if (description.length > 2000) {
      return new Response(JSON.stringify({ error: 'Description too long (max 2000 characters)' }), { status: 400, headers });
    }

    const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';

    // Basic rate limit: max 3 suggestions per IP per hour
    const rateKey = `ratelimit:${ip}`;
    const rateData = await context.env.SUGGESTIONS_KV.get(rateKey);
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxPerWindow = 3;

    if (rateData) {
      const timestamps: number[] = JSON.parse(rateData);
      const recent = timestamps.filter(t => now - t < windowMs);
      if (recent.length >= maxPerWindow) {
        return new Response(JSON.stringify({ error: 'Too many submissions. Please try again later.' }), { status: 429, headers });
      }
      recent.push(now);
      await context.env.SUGGESTIONS_KV.put(rateKey, JSON.stringify(recent), { expirationTtl: 3600 });
    } else {
      await context.env.SUGGESTIONS_KV.put(rateKey, JSON.stringify([now]), { expirationTtl: 3600 });
    }

    const suggestion = {
      id: crypto.randomUUID(),
      toolName,
      description,
      email: body.email?.trim() || null,
      createdAt: new Date().toISOString(),
      ip,
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
