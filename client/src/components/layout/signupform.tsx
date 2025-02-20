"use client";
import { userEmailRegistrationSchema } from "@/lib/schemas/userRelatedSchemas";
import { signUpForm } from "@/lib/utils/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import OAuth from "../sections/OAuth";
import AuthFormInputField from "../ui/AuthFormInputField";
import { signUpUsingEmail } from "@/lib/api/auth/auth";
import { useState } from "react";

const SignupForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const form = useForm<signUpForm>({
    resolver: zodResolver(userEmailRegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: signUpForm) => {
    setIsSending(true);
    await signUpUsingEmail(data);
    setIsSending(false);
    form.reset();
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
        <a href="#" className="text-blue-400 hover:underline">
          Sign in
        </a>
      </p>
    </>
  );
};

export default SignupForm;
