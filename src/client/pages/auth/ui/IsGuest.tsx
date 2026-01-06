"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHandleAuthorizationQuery } from "@/client/entities/user";
import { Loader } from "@/client/shared/ui";

export function IsGuest({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useHandleAuthorizationQuery();

  const user = data?.user;
  const isAuthed = Boolean(user?._id);

  useEffect(() => {
    if (!isAuthed) return;
    router.replace(user?.isBanned ? "/banned" : "/");
  }, [isAuthed, user?.isBanned, router]);

  if (isLoading) return <Loader open={true} />;

  if (isAuthed) return <Loader open={true} />;

  return <>{children}</>;
}
