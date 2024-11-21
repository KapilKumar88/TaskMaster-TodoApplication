import { useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";

export default function AuthLayout() {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <Outlet />
    </div>
  );
}
