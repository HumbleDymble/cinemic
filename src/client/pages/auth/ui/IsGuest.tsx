"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHandleAuthorizationQuery } from "@/client/entities/user";
import { Loader } from "@/client/shared/ui";

export function IsGuest({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useHandleAuthorizationQuery();

  const user = data?.user;

  const isAuthed = data?.user?._id;
  const isBanned = data?.user?.isBanned;

  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    if (!isAuthed) return;

    if (user?.isBanned) {
      router.replace("/banned");
    } else {
      router.replace("/");
    }
  }, [isLoading, isError, data, isBanned, router]);

  if (isLoading) return <Loader open />;

  if (!isError && isAuthed) return <Loader open />;

  return <>{children}</>;
}
