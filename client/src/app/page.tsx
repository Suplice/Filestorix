"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, handleLogout } = useAuth();

  return (
    <div>
      <div>id: {user?.ID} </div>
      <div>email: {user?.email}</div>
      <div>username: {user?.username}</div>
      <Button variant="destructive" size="lg" onClick={handleLogout}></Button>
    </div>
  );
}
