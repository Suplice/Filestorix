"use client";
import { userEmailLoginSchema } from "@/lib/schemas/userRelatedSchemas";
import { signInForm } from "@/lib/utils/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import OAuth from "../sections/OAuth";
import AuthFormInputField from "../ui/authFormInputField";
import { signInUsingEmail } from "@/lib/api/auth/auth";
import { useState } from "react";

const SigninForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const form = useForm<signInForm>({
    resolver: zodResolver(userEmailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInForm) => {
    setIsSending(true);
    await signInUsingEmail(data);
    setIsSending(false);
    form.reset();
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
        <a href="#" className="text-blue-400 hover:underline">
          Sign Up
        </a>
      </p>
    </>
  );
};

export default SigninForm;
