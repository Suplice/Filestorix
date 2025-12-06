import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { userEmailRegistrationSchema } from "@/lib/schemas/userRelatedSchemas";
import { signUpForm } from "@/lib/types/forms";
import { useAuth } from "@/context/AuthContext";

import { AuthInput } from "@/components/ui/AuthInput";
import { NativeButton } from "@/components/ui/NativeButton";

export default function SignupScreen() {
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { handleRegisterWithEmail } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpForm>({
    resolver: zodResolver(userEmailRegistrationSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: signUpForm) => {
    setIsSending(true);
    await handleRegisterWithEmail(data);
    setIsSending(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centeredContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Create an account</Text>
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

              <AuthInput
                control={control}
                name="confirmPassword"
                secureTextEntry
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                iconName="check-circle"
              />

              <NativeButton
                title="Sign up"
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
              <Text style={styles.footerText}>Already have an account? </Text>
              <NativeButton
                title="Sign in"
                variant="link"
                onPress={() => router.push("/auth/signin")}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
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
