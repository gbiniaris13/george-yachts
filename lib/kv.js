// Lightweight KV helper using Upstash/Vercel KV REST API
// No npm package needed — just fetch calls
// Requires KV_REST_API_URL and KV_REST_API_TOKEN env vars (auto-set by Vercel KV)

async function exec(commands) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

// Simple key-value
export const kvIncr = (key) => exec(['INCR', key]);
export const kvGet = (key) => exec(['GET', key]);
export const kvSet = (key, value, exSeconds) =>
  exSeconds ? exec(['SET', key, value, 'EX', String(exSeconds)]) : exec(['SET', key, value]);
export const kvDel = (key) => exec(['DEL', key]);

// Hash operations (for country/page counters)
export const kvHincrby = (key, field, n = 1) => exec(['HINCRBY', key, field, String(n)]);
export const kvHgetall = (key) => exec(['HGETALL', key]);

// List operations (for inquiry tracking)
export const kvLpush = (key, value) => exec(['LPUSH', key, value]);
export const kvLrange = (key, start, end) => exec(['LRANGE', key, String(start), String(end)]);
export const kvLrem = (key, count, value) => exec(['LREM', key, String(count), value]);

// Today's date key helper (Athens timezone)
export function todayKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' }); // YYYY-MM-DD
}
