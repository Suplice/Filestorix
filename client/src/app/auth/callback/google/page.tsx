"use client";
import { ErrorMessage } from "@/lib/utils/ApiResponses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.push("/auth/signin");
      setTimeout(() => {
        toast.error(ErrorMessage.OAUTH_AUTHENTICATION_FAILED);
      }, 0);
    }

    const signInWithGoogle = async () => {
      await handleLoginWithGoogle();
    };
  }, []);

  return <div>Loading...</div>;
};

export default AuthCallback;
