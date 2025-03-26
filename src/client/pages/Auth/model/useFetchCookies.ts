import { useAppDispatch } from "@/app/store/store";
import { getCookies } from "@/pages/Auth/model/getCookiesSlice";
import { useCallback } from "react";

export const useFetchCookies = () => {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/cookies`, {
        credentials: "include",
      });
      const data = await response.json();
      dispatch(getCookies(data.cookies));
    } catch (e) {
      console.log(e);
    }
  }, []);
};
