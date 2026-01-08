"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHandleAuthorizationQuery } from "@/client/entities/user";
import { Loader } from "@/client/shared/ui";

export function IsAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useHandleAuthorizationQuery();
  const pathname = usePathname();

  const isAuthed = data?.user?._id;
  const isBanned = data?.user?.isBanned;

  useEffect(() => {
    if (!isAuthed) return;

    if ((isAuthed && pathname === "/auth/signin") || (isAuthed && pathname === "/auth/signup")) {
      router.replace("/");
    }
  }, [isLoading, isError, data, isBanned, router]);

  if (isLoading) return <Loader open />;

  return <>{children}</>;
}
