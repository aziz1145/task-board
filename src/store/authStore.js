import { getStorageItem, setStorageItem, removeStorageItem } from "../utils/storage.js";

const AUTH_KEY = "taskboard_auth";

export function getAuth() {
  return getStorageItem(AUTH_KEY, { isLoggedIn: false, remember: false });
}

export function login({ email, password, remember }) {
  const ok = email === "intern@demo.com" && password === "intern123";
  if (!ok) return { ok: false, message: "Invalid email or password." };

  setStorageItem(AUTH_KEY, { isLoggedIn: true, remember: !!remember });
  return { ok: true };
}

export function logout() {
  removeStorageItem(AUTH_KEY);
}

export function isLoggedIn() {
  const auth = getAuth();
  return auth?.isLoggedIn === true;
}