import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/api/auth/auth-api-slice";
import { useDispatch } from "react-redux";
import { setUserAuthDetails } from "@/redux/features/auth-slice";
import { apiSlice } from "@/redux/api/api-slice";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const [Login] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (response.status) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        dispatch(
          setUserAuthDetails({
            isAuthenticated: true,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          })
        );
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        dispatch(apiSlice.endpoints.fetchUserProfile.initiate());
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "error",
        description: error?.message ?? "Something went wrong. Please try again",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive password reset instructions
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Send Instructions
          </Button>
          <div className="text-sm text-center text-gray-500">
            Already have an account?
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
