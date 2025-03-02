"use client";
import LoadingSpinner from "@/components/sections/loadingSpinner/loadingSpinner";
import {
  fetchUser,
  logout,
  signInUsingEmail,
  signInUsingGithub,
  signInUsingGoogle,
  signUpUsingEmail,
} from "@/lib/api/auth/auth";
import { signFormResult, signInForm, signUpForm } from "@/lib/types/forms";
import { fetchUserResult, User } from "@/lib/types/user";
import { ErrorMessage, SuccessMessage } from "@/lib/utils/ApiResponses";
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

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    const fetchCredentials = async () => {
      await checkCredentials();
    };

    fetchCredentials();
  }, []);

  /**
   * Asynchronously checks user credentials by fetching user data.
   *
   * If the fetch is successful and the result is ok, it sets the user as authenticated
   * and updates the user state. If the fetch is unsuccessful or the result is not ok,
   * it removes the credentials.
   */
  const checkCredentials = async () => {
    try {
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
    }
  };

  /**
   * Removes the user's authentication credentials.
   *
   * This function sets the authentication state to false and clears the user information.
   */
  const removeCredentials = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  /**
   * Handles user registration using email.
   *
   * This function attempts to register a user with the provided sign-up form data.
   * If the registration is successful, it sets the user state, marks the user as authenticated,
   * and redirects to the home page. If an error occurs, it displays an appropriate error message.
   *
   * @param {signUpForm} data - The sign-up form data containing user information.
   * @returns {Promise<void>} - A promise that resolves when the registration process is complete.
   */
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

      router.push("/");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
    }
  };

  /**
   * Handles user login using email and password.
   *
   * @param {signInForm} data - The sign-in form data containing email and password.
   * @returns {Promise<void>} - A promise that resolves when the login process is complete.
   */
  const handleLoginWithEmail = async (data: signInForm) => {
    try {
      const result = await signInUsingEmail(data);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      console.log("result user", result.user);

      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/");
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

      router.push("/");
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

      router.push("/");
    } catch {
      toast.error(ErrorMessage.UNEXPECTED_ERROR);
      router.push("/auth/signin");
    }
  };

  /**
   * Handles the user logout process.
   *
   * This function attempts to log out the user by calling the `logout` function.
   * If the logout is successful, it removes the user's credentials, displays a success message,
   * and redirects the user to the sign-in page.
   * If the logout fails, it displays an error message.
   * If an unexpected error occurs during the process, it displays a generic error message.
   *
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
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
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
};
