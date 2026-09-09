// lib/crypto.js -> Web Crypto API diye AES-256-GCM
export async function deriveKey(masterPassword, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptPassword(plainText, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, enc.encode(plainText)
  );
  return {
    encryptedPassword: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptPassword(encryptedPassword, iv, key) {
  const cipherBuffer = Uint8Array.from(atob(encryptedPassword), c => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer }, key, cipherBuffer
  );
  return new TextDecoder().decode(plainBuffer);
}