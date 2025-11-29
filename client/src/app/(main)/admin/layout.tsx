"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role.toLowerCase() !== "admin") {
        router.push("/home");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role.toLowerCase() !== "admin") {
    return null;
  }

  return <>{children}</>;
}
