import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import DashboardPage from "../pages/dashboard/dashboard-page";
import AppLayout from "@/components/layout/app-layout";
import ErrorPage from "@/pages/error/error-page";
import TodoListingPage from "@/pages/todo/todo-listing-page";
import AuthGuard from "@/guard/auth-guard";
import AccountPage from "@/pages/profile/account-page";
import AuthLayout from "@/components/layout/auth-layout";
import ForgotPasswordPage from "@/pages/auth/forgot-password-page";
import ResetPasswordPage from "@/pages/auth/reset-password-page";
import EmailVerificationPage from "@/pages/auth/email-verification-page";
import LandingPage from "@/pages/landing-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/email-verification",
        element: <EmailVerificationPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/todo",
        element: <TodoListingPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
