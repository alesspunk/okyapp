const STORE_KEY = "__truthLieRateStore";

function getStore() {
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = new Map();
  }
  return globalThis[STORE_KEY];
}

export function consumeRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const store = getStore();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  store.set(key, current);
  return true;
}
