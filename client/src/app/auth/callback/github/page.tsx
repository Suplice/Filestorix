"use client";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { ErrorMessage } from "@/lib/utils/ApiResponses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { handleLoginWithGithub } = useAuth();

  const router = useRouter();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const signInWithGithub = async () => {
      await handleLoginWithGithub(code!);
    };

    if (!code) {
      router.push("/auth/signin");
      setTimeout(() => {
        toast.error(ErrorMessage.FAILED_GITHUB_LOGIN);
      }, 0);
    } else {
      signInWithGithub();
    }
  }, []);

  return <LoadingSpinner />;
};

export default AuthCallback;
