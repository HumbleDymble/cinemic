import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Lang = "ru" | "en";

type Localized = Partial<Record<Lang, string>>;

export interface RecentViewedType {
  id: number;
  title: Localized;
  image: Localized;
  year?: number;
  type?: string;
  rating?: number;
}

interface RecentViewedState {
  recentViewed: RecentViewedType[];
}

const STORAGE_KEY = "recentViewed";

const initialState: RecentViewedState = {
  recentViewed: [],
};

function persist(list: RecentViewedType[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function migrateIfNeeded(raw: unknown): RecentViewedType[] {
  if (!Array.isArray(raw)) return [];

  if (raw.length === 0) return [];

  const first = raw[0];

  if (first && typeof first === "object" && first.title && typeof first.title === "object") {
    return raw as RecentViewedType[];
  }

  return raw.map((x) => ({
    id: Number(x.id),
    title: { ru: x.title ?? "", en: x.title ?? "" },
    image: { ru: x.image ?? "", en: x.image ?? "" },
    year: x.year,
    type: x.type,
    rating: x.rating,
  }));
}

export const recentViewedSlice = createSlice({
  name: "recentViewed",
  initialState,
  reducers: {
    getRecentViewedData(state) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        state.recentViewed = [];
        return;
      }

      try {
        const parsed = JSON.parse(stored) as unknown;
        const migrated = migrateIfNeeded(parsed);
        state.recentViewed = migrated;
        persist(migrated);
      } catch (e) {
        console.error("Error parsing recentViewed from localStorage:", e);
        state.recentViewed = [];
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    operateRecentViewedData(state, action: PayloadAction<RecentViewedType>) {
      const newItem = action.payload;
      const otherItems = state.recentViewed.filter((i) => i.id !== newItem.id);

      const existing = state.recentViewed.find((i) => i.id === newItem.id);
      const merged: RecentViewedType = existing
        ? {
            ...existing,
            ...newItem,
            title: { ...existing.title, ...newItem.title },
            image: { ...existing.image, ...newItem.image },
          }
        : newItem;

      const updatedList = [merged, ...otherItems].slice(0, 5);
      state.recentViewed = updatedList;
      persist(updatedList);
    },

    patchRecentViewedLocalization(
      state,
      action: PayloadAction<{ id: number; lang: Lang; title?: string; image?: string }>,
    ) {
      const { id, lang, title, image } = action.payload;
      const idx = state.recentViewed.findIndex((x) => x.id === id);
      if (idx === -1) return;

      const item = state.recentViewed[idx];
      const updated: RecentViewedType = {
        ...item,
        title: title != null ? { ...item.title, [lang]: title } : item.title,
        image: image != null ? { ...item.image, [lang]: image } : item.image,
      };

      state.recentViewed[idx] = updated;
      persist(state.recentViewed);
    },

    clearRecentViewedData(state) {
      localStorage.removeItem(STORAGE_KEY);
      state.recentViewed = [];
    },
  },
});

export const {
  getRecentViewedData,
  operateRecentViewedData,
  patchRecentViewedLocalization,
  clearRecentViewedData,
} = recentViewedSlice.actions;
