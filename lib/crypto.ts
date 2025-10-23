import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

function getKey() {
  const b64 = process.env.MAILBOX_ENCRYPTION_KEY;
  if (!b64) throw new Error('MAILBOX_ENCRYPTION_KEY is not set');
  const buf = Buffer.from(b64, 'base64');
  if (buf.length !== 32) throw new Error('MAILBOX_ENCRYPTION_KEY must be 32 bytes (base64)');
  return buf;
}

export function encrypt(text: string) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decrypt(token: string) {
  const key = getKey();
  const data = Buffer.from(token, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const enc = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(enc), decipher.final()]);
  return out.toString('utf8');
}
