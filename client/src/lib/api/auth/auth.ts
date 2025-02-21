import { signInForm, signUpForm } from "@/lib/utils/forms";
import { toast } from "react-toastify";

export const signUpUsingEmail = async (data: signUpForm) => {
  try {
    console.log(JSON.stringify(data));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    console.log("Response Data:", responseData);

    if (!response.ok) {
      console.error(responseData);
      toast.error(responseData.error);
      return;
    }

    toast.success(responseData.message);
  } catch (error) {
    console.error(error);
  }
};

export const signInUsingEmail = async (data: signInForm) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    console.log(responseData);

    if (!response.ok) {
      console.error(responseData);
      toast.error(responseData.error);
      return;
    }

    toast.success(responseData.message);
  } catch (error) {
    console.error(error);
  }
};
