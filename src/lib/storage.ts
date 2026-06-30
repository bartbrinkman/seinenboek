import type { Stats } from '../types';

const STORAGE_KEY = 'seinenboek.stats.v1';

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { correct: 0, total: 0 };
    const parsed = JSON.parse(raw);
    if (typeof parsed.correct === 'number' && typeof parsed.total === 'number') {
      return parsed;
    }
  } catch {
    // ignore corrupt storage, fall through to default
  }
  return { correct: 0, total: 0 };
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats(): Stats {
  const fresh = { correct: 0, total: 0 };
  saveStats(fresh);
  return fresh;
}
