"use client";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import {
  fetchUser,
  logout,
  signInUsingEmail,
  signInUsingGithub,
  signInUsingGoogle,
  signUpUsingEmail,
} from "@/lib/api/auth/auth";
import { signInForm, signUpForm } from "@/lib/types/forms";
import { fetchUserResult, signFormResult, User } from "@/lib/types/user";
import { ErrorMessage, SuccessMessage } from "@/lib/utils/ApiResponses";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleRegisterWithEmail: (data: signUpForm) => Promise<void>;
  handleLoginWithEmail: (data: signInForm) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleLoginWithGoogle: (code: string) => Promise<void>;
  handleLoginWithGithub: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchCredentials = async () => {
      await checkCredentials();
    };

    fetchCredentials();
  }, []);

  const checkCredentials = async () => {
    try {
      setIsLoading(true);

      const result: fetchUserResult = await fetchUser();

      if (result.ok) {
        setIsAuthenticated(true);
        setUser(result.user!);
      } else {
        removeCredentials();
      }
    } catch (error) {
      console.error(error);
      removeCredentials();
    } finally {
      setIsLoading(false);
    }
  };

  const removeCredentials = () => {
    setIsAuthenticated(false);
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ["files"] });
  };

  const handleRegisterWithEmail = async (data: signUpForm) => {
    try {
      const result = await signUpUsingEmail(data);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/home");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
    }
  };

  const handleLoginWithEmail = async (data: signInForm) => {
    try {
      const result = await signInUsingEmail(data);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/home");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
    }
  };

  const handleLoginWithGoogle = async (code: string) => {
    try {
      const result: signFormResult = await signInUsingGoogle(code);

      if (!result.ok) {
        toast.error(result.error);
        router.push("/auth/signin");
        return;
      }

      toast.success(result.message);
      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/home");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
      router.push("/auth/signin");
    }
  };

  const handleLoginWithGithub = async (code: string) => {
    try {
      const result: signFormResult = await signInUsingGithub(code);

      if (!result.ok) {
        toast.error(result.error);
        router.push("/auth/signin");
        return;
      }

      toast.success(result.message);
      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/home");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
      router.push("/auth/signin");
    }
  };

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const result = await logout();
        if (result) {
          toast.success(SuccessMessage.LOGGED_OUT);
          router.push("/auth/signin");
          removeCredentials();
        } else {
          toast.error(ErrorMessage.LOGOUT_FAILED);
        }
      } catch {
        toast.error(ErrorMessage.UNEXPECTED_ERROR);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setIsAuthenticated,
        isAuthenticated,
        isLoading,
        handleRegisterWithEmail,
        handleLoginWithEmail,
        handleLogout,
        handleLoginWithGoogle,
        handleLoginWithGithub,
      }}
    >
      {isPending ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
