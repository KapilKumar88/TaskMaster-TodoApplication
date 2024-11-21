import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useResendEmailVerificationLinkMutation,
  useVerifyEmailMutation,
} from "@/redux/api/auth/auth-api-slice";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [ResendEmailVerificationLink] =
    useResendEmailVerificationLinkMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emailVerification = async (token: string) => {
    try {
      const result = await verifyEmail({
        token,
      }).unwrap();
      setLoading(false);
      toast({
        title: "Success",
        description: result?.message ?? "Email verified successfully",
      });
      navigate("/login");
      return;
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
  };

  const resendEmailVerificationLink = async () => {
    try {
      const result = await ResendEmailVerificationLink({
        email: searchParams.get("email") as string,
      }).unwrap();
      toast({
        title: "Success",
        description: result?.message ?? "Email verification link sent successfully",
      });
      navigate("/login");
      return;
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
  };

  useEffect(() => {
    if (searchParams.get("token")) {
      emailVerification(searchParams.get("token") as string);
    }
  }, [searchParams]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {loading && (
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold text-primary">
            Verifying email...
          </p>
        </div>
      )}

      {!loading && (
        <div className="text-center">
          <Button type="button" onClick={resendEmailVerificationLink}>
            Resend the email verification link
          </Button>
        </div>
      )}
    </div>
  );
}
