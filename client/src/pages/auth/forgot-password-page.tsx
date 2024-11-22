import { useState } from "react";
import { Loader, LogIn } from "lucide-react";
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
import { useForgotPasswordMutation } from "@/redux/api/auth/auth-api-slice";

export default function ForgotPasswordPage() {
  const [ForgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ForgotPassword({
        email: email,
      }).unwrap();

      toast({
        title: "Success",
        description: response?.message ?? "Password reset instructions sent",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
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
      <form onSubmit={handleForgotPassword}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            {!isLoading && <LogIn className="mr-2 h-4 w-4" />}
            {isLoading && <Loader className="animate-spin" />}
            Send Instructions
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
