/**
 * Generates a collision-resistant unique ID with an optional prefix.
 * Never relies on array indexes.
 */
export function generateId(prefix: string = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
  }
  // Fallback for environments lacking crypto.randomUUID
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}
