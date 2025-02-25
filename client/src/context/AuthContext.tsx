"use client";
import {
  fetchUser,
  logout,
  signInUsingEmail,
  signUpUsingEmail,
} from "@/lib/api/auth/auth";
import { signInForm, signUpForm } from "@/lib/types/forms";
import { fetchUserResult, User } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
      toast.error("An unexpected error occured, please try again.");
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
      toast.error("An unexpected error occured, please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result) {
        removeCredentials();
        toast.success("Logged out successfully.");
        router.push("/auth/signin");
      } else {
        toast.error(
          "An error occured while trying to log out, please try again."
        );
      }
    } catch {
      toast.error("An error occured, please try again.");
    }
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
      }}
    >
      {children}
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
