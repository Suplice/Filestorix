"use client";
import { useAuth } from "@/context/AuthContext";
import { ErrorMessage } from "@/lib/utils/ApiResponses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { handleLoginWithGoogle } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const signInWithGoogle = async () => {
      await handleLoginWithGoogle(code!);
    };

    if (!code) {
      router.push("/auth/signin");
      setTimeout(() => {
        toast.error(ErrorMessage.OAUTH_AUTHENTICATION_FAILED);
      }, 0);
    } else {
      signInWithGoogle();
    }
  }, []);

  return <div>Loading...</div>;
};

export default AuthCallback;
