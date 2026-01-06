"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHandleAuthorizationQuery } from "@/client/entities/user";
import { Loader } from "@/client/shared/ui";

export function IsAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useHandleAuthorizationQuery();

  const user = data?.user;
  const isAuthed = Boolean(user?._id);
  const isBanned = Boolean(user?.isBanned);

  useEffect(() => {
    if (isBanned) {
      router.replace("/banned");
      return;
    }
    if (!isLoading && !isAuthed) {
      router.replace("/auth/signin");
    }

    if (isAuthed) {
      router.replace("/");
    }
  }, [isBanned, isAuthed, isLoading, router]);

  if (isLoading) return <Loader open={true} />;

  if (isBanned) return <Loader open={true} />;

  return <>{children}</>;
}
