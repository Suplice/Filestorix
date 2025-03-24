"use client";
import { ThemeProvider } from "@/themes/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ModalRoot from "@/components/layout/ModalRoot/modalRoot";
import GlobalEffects from "@/components/layout/GlobalEffects/GlobalEffects";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" enableSystem>
              <AuthProvider>
                {children}
                <Toaster />
                <ModalRoot />
                <GlobalEffects />
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
