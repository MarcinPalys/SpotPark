import { useCallback, useState } from 'react';

const STORAGE_KEY = 'spotpark.favorites';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Favourite spot ids, remembered in this browser. */
export function useFavorites() {
  const [ids, setIds] = useState(load);

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const key = String(id);
      const next = prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable — keep in memory only
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => ids.includes(String(id)), [ids]);

  return { isFavorite, toggle };
}
