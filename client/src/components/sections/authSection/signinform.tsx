"use client";
import { userEmailLoginSchema } from "@/lib/schemas/userRelatedSchemas";
import { signInForm } from "@/lib/types/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import OAuth from "@/components/sections/AuthSection/OAuth";
import AuthFormInputField from "@/components/ui/authFormInputField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SigninForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const { handleLoginWithEmail } = useAuth();

  const router = useRouter();

  const form = useForm<signInForm>({
    resolver: zodResolver(userEmailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handles the form submission for signing in.
   *
   * @param {signInForm} data - The data from the sign-in form.
   * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
   *
   * @throws Will display an error toast if an unexpected error occurs during the sign-in process.
   *
   * @async
   */
  const onSubmit = async (data: signInForm) => {
    setIsSending(true);
    await handleLoginWithEmail(data);
    setIsSending(false);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Log in into account
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          method="POST"
          title="signInForm"
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
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Sign In
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
        Not registered yet?{" "}
        <Button
          variant="link"
          className="text-blue-400 px-1"
          onClick={() => {
            router.push("/auth/signup");
          }}
        >
          Sign Up
        </Button>
      </p>
    </>
  );
};

export default SigninForm;
