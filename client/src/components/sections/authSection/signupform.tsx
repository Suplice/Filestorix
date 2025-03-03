"use client";
import { userEmailRegistrationSchema } from "@/lib/schemas/userRelatedSchemas";
import { signUpForm } from "@/lib/types/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";
import OAuth from "../authSection/OAuth";
import AuthFormInputField from "../../ui/authFormInputField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SignupForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const router = useRouter();

  const { handleRegisterWithEmail } = useAuth();

  const form = useForm<signUpForm>({
    resolver: zodResolver(userEmailRegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Handles the form submission for the sign-up form.
   *
   * @param {signUpForm} data - The data from the sign-up form.
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  const onSubmit = async (data: signUpForm) => {
    setIsSending(true);
    await handleRegisterWithEmail(data);
    setIsSending(false);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Create an Account
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          method="POST"
        >
          <AuthFormInputField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
          />
          <AuthFormInputField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
          />
          <AuthFormInputField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
          />
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="my-4 flex items-center justify-center text-gray-400">
        <span className="h-px w-full bg-gray-600"></span>
        <span className="px-3">or</span>
        <span className="h-px w-full bg-gray-600"></span>
      </div>

      <OAuth />

      <p className="text-sm text-gray-400 text-center mt-4">
        Already have an account?{" "}
        <Button
          variant="link"
          size="default"
          className="px-1 text-blue-400"
          onClick={() => router.push("/auth/signin")}
        >
          Sign in
        </Button>
      </p>
    </>
  );
};

export default SignupForm;
