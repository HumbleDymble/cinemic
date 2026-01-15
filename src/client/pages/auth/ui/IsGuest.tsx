import { Navigate, Outlet } from "react-router-dom";
import { useHandleAuthorizationQuery } from "@/entities/user";
import { Loader } from "@/shared/ui";

export const IsGuest = () => {
  const { data, isLoading } = useHandleAuthorizationQuery();

  if (isLoading) {
    return <Loader open={true} />;
  }

  if (data?.user?.username) {
    return <Navigate to={data.user.isBanned ? "/banned" : "/"} replace />;
  }

  return <Outlet />;
};
