/**
 * createHashFromString
 * @via https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */

export async function createHashFromString(data: string, algorithm = 'SHA-256'): Promise<string> {
  if (!data) throw new Error('Failed to create hash. Data undefined.');
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

// https://github.com/colbyfayock/tweezer/blob/main/src/lib/cloudinary.js
const RESOURCE_INCLUDED_KEYS = ['height', 'info', 'public_id', 'resource_type', 'secure_url', 'tags', 'width'];

/**
 * sanitizeResource
 */

export function sanitizeResource(resource: any) {
  return Object.fromEntries(Object.entries(resource).filter(([key]) => RESOURCE_INCLUDED_KEYS.includes(key)));
}
