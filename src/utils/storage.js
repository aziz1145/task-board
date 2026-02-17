export function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStorageItem(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return safeJsonParse(raw, fallback);
}

export function setStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key) {
  localStorage.removeItem(key);
}