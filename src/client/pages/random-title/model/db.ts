import type { MovieDtoV1_4 } from "@/client/entities/media-detail";

export type MovieHistoryItem = MovieDtoV1_4 & { timestamp: number };

const DB_NAME = "MovieRouletteDB";
const STORE_NAME = "history_v1_4";
const DB_VERSION = 2;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error ?? new Error("Failed to open database"));
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
};

export const dbService = {
  add: async (movie: MovieDtoV1_4) => {
    if (!movie.id) return;

    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      const historyItem: MovieHistoryItem = {
        ...movie,
        timestamp: Date.now(),
      };

      const request = store.put(historyItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error("Failed to add item"));
    });
  },

  getAll: async (): Promise<MovieHistoryItem[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("timestamp");

      const request = index.openCursor(null, "prev");
      const results: MovieHistoryItem[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor && results.length < 20) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error ?? new Error("Failed to get items"));
    });
  },

  clear: async () => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Failed to clear database"));
    });
  },
};
