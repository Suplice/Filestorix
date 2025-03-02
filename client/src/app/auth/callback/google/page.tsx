"use client";
import LoadingSpinner from "@/components/sections/loadingSpinner/loadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { ErrorMessage } from "@/lib/utils/ApiResponses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const hasRun = useRef(false);

  const { handleLoginWithGoogle } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const signInWithGoogle = async () => {
      await handleLoginWithGoogle(code!);
    };

    if (!code) {
      router.push("/auth/signin");
      setTimeout(() => {
        toast.error(ErrorMessage.FAILED_GOOGLE_LOGIN);
      }, 0);
    } else {
      signInWithGoogle();
    }
  }, []);

  return <LoadingSpinner />;
};

export default AuthCallback;
