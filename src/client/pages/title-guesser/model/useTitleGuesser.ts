import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Image,
  useGetMediaDetailsQuery,
  useLazyGetImagesForTitleQuery,
  useLazyGetRandomTitleQuery,
} from "@/entities/media-detail";

export type GameState = "INITIAL" | "LOADING" | "PLAYING" | "REVEALED";

interface MaybeRtkError {
  status?: number | string;
}

export interface HistoryItem {
  id: number;
  name: string;
  posterUrl: string;
  isCorrect: boolean;
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const preloadImage = (url: string, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal.aborted) return onAbort();
    signal.addEventListener("abort", onAbort, { once: true });

    img.onload = () => {
      signal.removeEventListener("abort", onAbort);
      cleanup();
      resolve();
    };

    img.onerror = () => {
      signal.removeEventListener("abort", onAbort);
      cleanup();
      reject(new Error("Image failed to load"));
    };

    img.src = url;
  });

function safeLoadNumber(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function safeLoadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export const useTitleGuesser = () => {
  const [gameState, setGameState] = useState<GameState>("INITIAL");
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);

  const [currentImages, setCurrentImages] = useState<Image[]>([]);

  const [userGuess, setUserGuess] = useState("");
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [streak, setStreak] = useState<number>(() => safeLoadNumber("movieGuesserStreak", 0));
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    safeLoadJson<HistoryItem[]>("movieGuesserHistory", []),
  );

  const failedImageUrlsRef = useRef<Set<string>>(new Set());
  const loadSeqRef = useRef(0);
  const reloadAttemptsRef = useRef(0);

  const [fetchRandomTitle, { isFetching: isRandomFetching }] = useLazyGetRandomTitleQuery();
  const [fetchImagesForTitle] = useLazyGetImagesForTitleQuery();
  const [isImagesLoading, setIsImagesLoading] = useState(false);

  const {
    data: movieData,
    isFetching: isDetailsFetching,
    isError: isDetailsError,
    error: detailsError,
  } = useGetMediaDetailsQuery({ id: currentMovieId?.toString() }, { skip: !currentMovieId });

  const isFetching = isDetailsFetching ?? isRandomFetching ?? isImagesLoading;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movieGuesserStreak", streak.toString());
  }, [streak]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movieGuesserHistory", JSON.stringify(history));
  }, [history]);

  const getStatus = (e: unknown) =>
    e && typeof e === "object" ? (e as MaybeRtkError).status : undefined;
  const is403 = (e: unknown) => {
    const s = getStatus(e);
    return s === 403 || s === "403" || Number(s) === 403;
  };

  const gameStateRef = useRef<GameState>("INITIAL");
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [apiBlocked, setApiBlocked] = useState(false);
  const apiBlockedRef = useRef(false);
  useEffect(() => {
    apiBlockedRef.current = apiBlocked;
  }, [apiBlocked]);

  const hasRequiredTitle = useCallback(() => {
    return !!(movieData?.name?.trim() ?? movieData?.enName?.trim());
  }, [movieData]);

  const getDisplayTitle = useCallback(() => {
    const ru = movieData?.name?.trim();
    const en = movieData?.enName?.trim();
    const year = movieData?.year;

    let title = ru ?? en ?? "Unknown title";
    if (en && ru && en !== ru) title += ` / ${en}`;
    if (year) title += ` (${year})`;
    return title;
  }, [movieData]);

  const topCast = useMemo(
    () =>
      movieData?.persons
        ?.filter((p) => p.enProfession === "actor" && p.name)
        .slice(0, 4)
        .map((p) => p.name)
        .join(", ") ?? "not available",
    [movieData],
  );

  const handleShowHint = useCallback(() => setShowHint(true), []);

  const beginNewRound = useCallback(
    async (source: "user" | "auto") => {
      if (apiBlockedRef.current) return;
      if (source === "auto" && gameStateRef.current === "REVEALED") return;

      setUserGuess("");
      setIsGuessCorrect(false);
      setShowHint(false);
      setCurrentImages([]);
      failedImageUrlsRef.current.clear();
      reloadAttemptsRef.current = 0;

      const recentIds = history.slice(0, 10).map((h) => h.id);

      let nextId: number | null = null;

      for (let attempts = 0; attempts < 20; attempts++) {
        const result = await fetchRandomTitle({})
          .unwrap()
          .catch((e) => {
            if (is403(e)) setApiBlocked(true);
            return null;
          });
        if (apiBlockedRef.current) return;

        if (!result?.id) continue;
        if (recentIds.includes(result.id)) continue;

        const candidateName = (result.name ?? "").trim();
        const candidateEn = (result.enName ?? "").trim();
        if (!candidateName && !candidateEn) continue;

        nextId = result.id;
        break;
      }

      if (!nextId) {
        console.error("Couldn’t fetch a random movie after 20 tries.");
        return;
      }

      setCurrentMovieId(nextId);
      setGameState("LOADING");
    },
    [fetchRandomTitle, history],
  );

  const startNewGame = useCallback(() => beginNewRound("user"), [beginNewRound]);

  const checkAnswer = useCallback(
    (guess: string): boolean => {
      if (!movieData) return false;

      const normalizedGuess = guess.trim().toLowerCase();
      if (!normalizedGuess) return false;

      const validNames = [
        movieData.name,
        movieData.enName,
        movieData.alternativeName,
        ...(movieData.names?.map((n) => n.name) ?? []),
      ]
        .filter((name): name is string => !!name)
        .map((name) => name.toLowerCase().trim());

      return validNames.includes(normalizedGuess);
    },
    [movieData],
  );

  const handleGuessSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!movieData) return;

      loadSeqRef.current += 1;

      const isCorrect = checkAnswer(userGuess);
      setIsGuessCorrect(isCorrect);
      setStreak(isCorrect ? (prev) => prev + 1 : 0);

      const safeTitle = movieData.name?.trim() ?? movieData.enName?.trim() ?? "Unknown title";
      setHistory((prev) =>
        [
          {
            id: movieData.id!,
            name: safeTitle,
            posterUrl: movieData.poster?.previewUrl ?? "",
            isCorrect,
          },
          ...prev,
        ].slice(0, 20),
      );

      setGameState("REVEALED");
    },
    [movieData, checkAnswer, userGuess],
  );

  const loadImagesForMovie = useCallback(
    async (movieId: number) => {
      const seq = ++loadSeqRef.current;
      const ac = new AbortController();

      setIsImagesLoading(true);

      try {
        const res = await fetchImagesForTitle({
          movieId,
          type: ["still", "screenshot"],
          limit: 200,
        })
          .unwrap()
          .catch((e) => {
            if (is403(e)) setApiBlocked(true);
            return null;
          });
        if (apiBlockedRef.current) return;

        const collected: Image[] = (res?.docs ?? []).filter((img) => !!img.url);

        if (seq !== loadSeqRef.current) return;

        const byUrl = new Map<string, Image>();
        for (const img of collected) {
          if (!img.url) continue;
          if (failedImageUrlsRef.current.has(img.url)) continue;
          if (!byUrl.has(img.url)) byUrl.set(img.url, img);
        }

        const pool = Array.from(byUrl.values());
        shuffleInPlace(pool);

        const picked: Image[] = [];
        for (const img of pool) {
          if (picked.length >= 5) break;
          try {
            await preloadImage(img.url, ac.signal);
            picked.push(img);
          } catch {
            failedImageUrlsRef.current.add(img.url);
          }
        }

        if (seq !== loadSeqRef.current) return;

        if (picked.length === 0) {
          void beginNewRound("auto");
          return;
        }

        setCurrentImages(picked);
        setGameState("PLAYING");
      } finally {
        if (seq === loadSeqRef.current) setIsImagesLoading(false);
        ac.abort();
      }
    },
    [fetchImagesForTitle, beginNewRound],
  );

  const reloadImages = useCallback(() => {
    if (!currentMovieId) return;

    reloadAttemptsRef.current += 1;
    if (reloadAttemptsRef.current >= 3) {
      void beginNewRound("auto");
      return;
    }

    setCurrentImages([]);
    setShowHint(false);
    setGameState("LOADING");
  }, [currentMovieId, beginNewRound]);

  const handleImageError = useCallback(
    (url: string) => {
      if (gameStateRef.current !== "PLAYING") return;
      if (url) failedImageUrlsRef.current.add(url);

      reloadImages();
    },
    [reloadImages],
  );

  useEffect(() => {
    if (gameState === "INITIAL") {
      void startNewGame();
      return;
    }

    if (gameState !== "LOADING") return;
    if (!currentMovieId) return;
    if (isFetching) return;
    if (isDetailsFetching) return;

    if (isDetailsError || !movieData) {
      void startNewGame();
      return;
    }

    if (!hasRequiredTitle()) {
      void startNewGame();
      return;
    }

    void loadImagesForMovie(currentMovieId);
  }, [
    gameState,
    currentMovieId,
    isDetailsFetching,
    isDetailsError,
    movieData,
    hasRequiredTitle,
    loadImagesForMovie,
    startNewGame,
  ]);

  useEffect(() => {
    if (!detailsError) return;
    if (is403(detailsError)) {
      setApiBlocked(true);
      setIsImagesLoading(false);
      setGameState("INITIAL");
    }
  }, [detailsError]);

  return {
    state: {
      gameState,
      currentImages,
      userGuess,
      isGuessCorrect,
      showHint,
      streak,
      history,
      movieData,
      topCast,
      isFetching,
      displayTitle: getDisplayTitle(),
      apiBlocked,
    },
    actions: {
      setUserGuess,
      handleGuessSubmit,
      startNewGame,
      handleShowHint,
      handleImageError,
    },
  };
};
