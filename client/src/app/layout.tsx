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
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

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
            <TooltipProvider>
              <ThemeProvider attribute="class" enableSystem>
                <AuthProvider>
                  {children}
                  <NextTopLoader />
                  <Toaster />
                  <ModalRoot />
                  <GlobalEffects />
                </AuthProvider>
              </ThemeProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
