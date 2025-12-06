import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role.toLowerCase() !== "admin") {
        router.replace("/(drawer)/home");
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#020617",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user || user.role.toLowerCase() !== "admin") return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#020617" },
      }}
    />
  );
}
