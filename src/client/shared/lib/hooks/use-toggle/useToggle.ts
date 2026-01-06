"use client";

import { useCallback, useState } from "react";

export function useToggle(
  initialState: boolean | (() => boolean) = false,
): [boolean, (value?: boolean) => void] {
  const [isToggled, setIsToggled] = useState<boolean>(initialState);

  const toggle = useCallback((value?: boolean) => {
    setIsToggled((prev) => (typeof value === "boolean" ? value : !prev));
  }, []);

  return [isToggled, toggle];
}
