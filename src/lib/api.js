// src/lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const AUTH_BASE = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ''; // Next.js app-এর নিজের origin

let cachedToken = null;
let cachedTokenExpiry = 0;

async function getJwt() {
  // cache আছে এবং এখনো valid থাকলে নতুন করে fetch করার দরকার নাই
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${AUTH_BASE}/api/auth/token`, {
    credentials: 'include', // better-auth session cookie পাঠাবে, same-origin তাই কাজ করবে
  });

  if (!res.ok) {
    cachedToken = null;
    cachedTokenExpiry = 0;
    throw new Error('Not authenticated — please log in again');
  }

  const data = await res.json();

  // ⚠️ এই field name টা আপনার better-auth version অনুযায়ী কনফার্ম করে নিন
  // (token / accessToken / jwt — যেটা actual response এ আসে)
  const token = data.token;

  if (!token) {
    throw new Error('No token returned from auth server');
  }

  cachedToken = token;
  cachedTokenExpiry = Date.now() + 55 * 1000; // short-lived JWT, একটু আগে refresh করার জন্য
  return cachedToken;
}

export async function apiFetch(path, options = {}) {
  const token = await getJwt();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {

    if (res.status === 401 || res.status === 403) {
      cachedToken = null;
      cachedTokenExpiry = 0;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}