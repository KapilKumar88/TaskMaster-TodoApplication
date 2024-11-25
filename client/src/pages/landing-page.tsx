import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import appConfig from "@/config/app.config";
import { RootState } from "@/redux/store";
import { CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">
            {appConfig.APP_NAME}
          </CardTitle>
          <CardDescription>
            Organize your life, one task at a time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <p>Effortlessly manage your tasks</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <p>Collaborate with your team</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <p>Track your productivity</p>
          </div>
        </CardContent>
        <CardFooter>
          {!isAuthenticated && (
            <Button
              className="w-full text-lg"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Login / Register
            </Button>
          )}

          {isAuthenticated && (
            <Button
              className="w-full text-lg"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2024 {appConfig.APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
