"use client";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div>id: {user?.ID} </div>
      <div>email: {user?.email}</div>
      <div>username: {user?.username}</div>
    </div>
  );
}
