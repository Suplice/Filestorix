import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { userEmailLoginSchema } from "@/lib/schemas/userRelatedSchemas";
import { signInForm } from "@/lib/types/forms";
import { useAuth } from "@/context/AuthContext";

import { AuthInput } from "@/components/ui/AuthInput";
import { NativeButton } from "@/components/ui/NativeButton";

export default function SigninScreen() {
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { handleLoginWithEmail } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<signInForm>({
    resolver: zodResolver(userEmailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: signInForm) => {
    setIsSending(true);
    await handleLoginWithEmail(data);
    setIsSending(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centeredContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue working with CodeQuest
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              control={control}
              name="email"
              placeholder="your@email.com"
              keyboardType="email-address"
              error={errors.email?.message}
              iconName="mail"
            />

            <AuthInput
              control={control}
              name="password"
              secureTextEntry
              placeholder="Password"
              error={errors.password?.message}
              iconName="lock"
            />

            <NativeButton
              title="Sign in"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSending}
              style={{ marginTop: 12 }}
            />
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <NativeButton
              title="Sign up"
              variant="link"
              onPress={() => router.push("/auth/signup")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#020617" },

  scrollContent: {
    flexGrow: 1,
    padding: 32,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
  },

  form: {
    marginBottom: 20,
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#1e293b",
  },

  separatorText: {
    color: "#64748b",
    marginHorizontal: 16,
    fontWeight: "500",
    fontSize: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: "#94a3b8",
    fontSize: 16,
  },
});
