import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { StatusBar } from "react-native";
import "../globals.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar barStyle="light-content" />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#111827" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/signin" />
            <Stack.Screen name="auth/signup" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
