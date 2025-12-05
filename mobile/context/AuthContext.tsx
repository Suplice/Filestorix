import {
  fetchUser,
  logout,
  signInUsingEmail,
  signUpUsingEmail,
} from "@/lib/api/auth/auth";
import { signInForm, signUpForm } from "@/lib/types/forms";
import { fetchUserResult, User } from "@/lib/types/user";
import { ErrorMessage } from "@/lib/utils/ApiResponses";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router"; // <--- ZMIANA: Router mobilny
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, ActivityIndicator, View } from "react-native"; // <--- ZMIANA: Natywne komponenty

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleRegisterWithEmail: (data: signUpForm) => Promise<void>;
  handleLoginWithEmail: (data: signInForm) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    checkCredentials();
  }, []);

  const checkCredentials = async () => {
    try {
      setIsLoading(true);
      const result: fetchUserResult = await fetchUser();

      if (result.ok && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
      } else {
        removeCredentials();
      }
    } catch (error) {
      console.error("Auth Check Error:", error);
      removeCredentials();
    } finally {
      setIsLoading(false);
    }
  };

  const removeCredentials = () => {
    setIsAuthenticated(false);
    setUser(null);
    queryClient.removeQueries({ queryKey: ["files"] });
  };

  const handleRegisterWithEmail = async (data: signUpForm) => {
    try {
      const result = await signUpUsingEmail(data);

      if (!result.ok) {
        Alert.alert("Błąd rejestracji", result.error);
        return;
      }

      // Sukces
      setUser(result.user!);
      setIsAuthenticated(true);
      router.replace("/(drawer)/home");
    } catch {
      Alert.alert("Błąd", ErrorMessage.UNEXPECTED_ERROR);
    }
  };

  const handleLoginWithEmail = async (data: signInForm) => {
    try {
      const result = await signInUsingEmail(data);

      if (!result.ok) {
        Alert.alert("Błąd logowania", result.error);
        return;
      }

      setUser(result.user!);
      setIsAuthenticated(true);
      router.replace("/(drawer)/home");
    } catch {
      Alert.alert("Błąd", ErrorMessage.UNEXPECTED_ERROR);
    }
  };
  const handleLogout = async () => {
    try {
      // Usunięto useTransition - w RN lepiej robić to zwykłym async
      const result = await logout();
      if (result) {
        removeCredentials();
        router.replace("/auth/signin"); // Dostosuj ścieżkę
      } else {
        Alert.alert("Błąd", ErrorMessage.LOGOUT_FAILED);
      }
    } catch {
      Alert.alert("Błąd", ErrorMessage.UNEXPECTED_ERROR);
    }
  };

  // // Jeśli trwa ładowanie początkowe, wyświetlamy Spinner na cały ekran
  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

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
      }}
    >
      {children}
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
