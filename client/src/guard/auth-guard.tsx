import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement | null {
  const isAuthenticated = useSelector(
    (state: RootState): boolean => state.auth?.isAuthenticated ?? false
  );

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
