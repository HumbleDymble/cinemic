import {
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLazySearchQuery } from "../api/endpoints";

export const useSearchBar = () => {
  const [search, setSearch] = useState("");
  const [triggerSearch, { data, isLoading, isFetching, isError }] = useLazySearchQuery();

  const query = useMemo(() => search.trim(), [search]);
  const hasQuery = query.length >= 1;

  const lastTriggeredRef = useRef<string>("");

  useEffect(() => {
    if (!hasQuery) {
      lastTriggeredRef.current = "";
      return;
    }

    const t = setTimeout(() => {
      if (lastTriggeredRef.current === query) return;
      lastTriggeredRef.current = query;
      triggerSearch({ search: query });
    }, 400);

    return () => clearTimeout(t);
  }, [hasQuery, query, triggerSearch]);

  const setSearchValue = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  const clearSearch = useCallback(() => {
    setSearchValue("");
  }, [setSearchValue]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  const handleClearClick = useCallback(() => {
    clearSearch();
    inputRef.current?.focus();
  }, [clearSearch]);

  const preventMouseDownBlur = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  const showLoader = hasQuery ? (isLoading ?? isFetching) : false;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasAnyText = search.length > 0;

  return {
    search,
    data,
    isError,
    query,
    showLoader,
    handleSearchChange,
    clearSearch,
    handleSubmit,
    hasAnyText,
    inputRef,
    preventMouseDownBlur,
    handleClearClick,
  };
};
