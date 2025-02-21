"use client";
import { userEmailRegistrationSchema } from "@/lib/schemas/userRelatedSchemas";
import { signUpForm } from "@/lib/types/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import OAuth from "../sections/OAuth";
import AuthFormInputField from "../ui/authFormInputField";
import { signUpUsingEmail } from "@/lib/api/auth/auth";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SignupForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const router = useRouter();

  const { setUser, setIsAuthenticated } = useAuth();

  const form = useForm<signUpForm>({
    resolver: zodResolver(userEmailRegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Handles the form submission for the sign-up process.
   *
   * @param {signUpForm} data - The data submitted from the sign-up form.
   * @returns {Promise<void>} A promise that resolves when the submission is complete.
   *
   * @throws Will display an error toast if an unexpected error occurs during submission.
   *
   * @async
   */
  const onSubmit = async (data: signUpForm) => {
    try {
      setIsSending(true);

      const result = await signUpUsingEmail(data);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      setUser(result.user!);
      setIsAuthenticated(true);
      router.push("/");
    } catch {
      toast.error("An unexpected error occured, please try again.");
    } finally {
      setIsSending(false);
    }
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
