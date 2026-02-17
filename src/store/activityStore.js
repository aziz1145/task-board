import { getStorageItem, setStorageItem } from "../utils/storage";

const LOG_KEY = "taskboard_activity_v1";
const MAX_LOGS = 20;

export function loadLog() {
  const data = getStorageItem(LOG_KEY, []);
  return Array.isArray(data) ? data : [];
}

export function saveLog(logs) {
  setStorageItem(LOG_KEY, logs);
}

export function addLogEntry(entry) {
  const logs = loadLog();
  const next = [{ ...entry, id: crypto.randomUUID?.() ?? String(Date.now()), at: new Date().toISOString() }, ...logs];
  const trimmed = next.slice(0, MAX_LOGS);
  saveLog(trimmed);
  return trimmed;
}

export function resetLog() {
  saveLog([]);
  return [];
}