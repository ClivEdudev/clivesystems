// Clive ID sync: stores one backup per sync code in Netlify Blobs.
// The code is the only key, so treat it like a password. Keys are hashed before storage.
import { getStore } from '@netlify/blobs';

export const config = { path: '/api/sync' };

const CODE = /^CLV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const MAX_BYTES = 600 * 1024;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

async function keyFor(code) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('clive-sync:' + code));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async (req) => {
  const store = getStore('clive-sync');
  if (req.method === 'GET') {
    const code = (new URL(req.url).searchParams.get('code') || '').toUpperCase();
    if (!CODE.test(code)) return json({ error: 'bad code' }, 400);
    const saved = await store.get(await keyFor(code), { type: 'json' });
    if (!saved) return json({ error: 'not found' }, 404);
    return json({ data: saved.data, at: saved.at });
  }
  if (req.method === 'POST') {
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: 'too large' }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: 'bad json' }, 400); }
    const code = String(body.code || '').toUpperCase();
    if (!CODE.test(code) || !body.data || body.data.app !== 'clive') return json({ error: 'bad request' }, 400);
    await store.setJSON(await keyFor(code), { data: body.data, at: new Date().toISOString() });
    return json({ ok: true });
  }
  return json({ error: 'method not allowed' }, 405);
};
