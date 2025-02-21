"use client";
import { getSessionExpireDate } from "@/lib/api/auth/auth";
import { User } from "@/lib/types/user";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkCredentials();
  }, []);

  const checkCredentials = () => {
    const sessionExpireDate = getSessionExpireDate();

    if (!sessionExpireDate) {
      removeCredentials();
      return;
    }

    const expireDate = new Date(sessionExpireDate);

    const currentDate = new Date();

    if (expireDate < currentDate) {
      removeCredentials();
      return;
    }
  };

  const removeCredentials = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, setIsAuthenticated, isAuthenticated }}
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
