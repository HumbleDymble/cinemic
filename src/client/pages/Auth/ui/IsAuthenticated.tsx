import { Navigate, Outlet } from "react-router-dom";
import { useHandleAuthorizationQuery } from "@/entities/user";
import { Loader } from "@/shared/ui";

export const IsAuthenticated = () => {
  const { data, isLoading } = useHandleAuthorizationQuery();

  if (isLoading) {
    return <Loader open={true} />;
  }

  if (data?.user?.isBanned) {
    return <Navigate to="/banned" replace />;
  }

  return <Outlet />;
};
