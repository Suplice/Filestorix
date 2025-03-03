import {
  signFormResponse,
  signFormResult,
  signInForm,
  signUpForm,
} from "@/lib/types/forms";
import { fetchUserResponse, fetchUserResult } from "@/lib/types/user";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";

/**
 * Registers a new user using their email.
 *
 * @param data - The sign-up form data containing user information.
 * @returns A promise that resolves to a signFormResult object indicating the success or failure of the registration.
 */
export const signUpUsingEmail = async (
  data: signUpForm
): Promise<signFormResult> => {
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
        credentials: "include",
      }
    );

    const responseData: signFormResponse = await response.json();

    console.log("Response Data:", responseData);

    if (!response.ok || !responseData.user) {
      console.error(responseData);
      return {
        ok: false,
        error: getErrorMessage(responseData.error),
      };
    }

    return {
      ok: true,
      user: responseData.user,
      message: getSuccessMessage(responseData.message),
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: getErrorMessage(error as string),
    };
  }
};

/**
 * Signs in a user using their email and password.
 *
 * @param data - The sign-in form data containing email and password.
 * @returns A promise that resolves to a signFormResult object containing the result of the sign-in attempt.
 */
export const signInUsingEmail = async (
  data: signInForm
): Promise<signFormResult> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const responseData: signFormResponse = await response.json();

    console.log(responseData);

    if (!response.ok || !responseData.user) {
      console.error(responseData);
      return {
        ok: false,
        error: getErrorMessage(responseData.error),
      };
    }

    return {
      ok: true,
      user: responseData.user,
      message: getSuccessMessage(responseData.message),
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: getErrorMessage(error as string),
    };
  }
};

/**
 * Signs in a user using Google authentication.
 *
 * @param code - access code, received from google oauth
 * @returns A promise that resolves to a `signFormResult` object containing the result of the sign-in attempt.
 */
export const signInUsingGoogle = async (
  code: string
): Promise<signFormResult> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      {
        method: "POST",
        body: JSON.stringify({ code: code }),
        credentials: "include",
      }
    );

    const responseData: signFormResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: getErrorMessage(responseData.error),
      };
    }

    return {
      ok: true,
      message: getSuccessMessage(responseData.message),
      user: responseData.user,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: getErrorMessage(error as string),
    };
  }
};

/**
 * Signs in a user using their GitHub account.
 * @param code - access code, received from github oauth
 * @returns A promise that resolves to a `signFormResult` object containing the result of the sign-in operation.
 */
export const signInUsingGithub = async (
  code: string
): Promise<signFormResult> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
      {
        method: "POST",
        body: JSON.stringify({ code: code }),
        credentials: "include",
      }
    );

    const responseData: signFormResponse = await response.json();

    console.log(responseData);

    if (!response.ok) {
      return {
        ok: false,
        error: getErrorMessage(responseData.error),
      };
    }

    return {
      ok: true,
      message: getSuccessMessage(responseData.message),
      user: responseData.user,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: getErrorMessage(error as string),
    };
  }
};
/**
 * Logs out the current user by making a POST request to the logout endpoint.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the logout was successful, or `false` otherwise.
 */
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        credentials: "include",
        method: "POST",
      }
    );

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Fetches the authenticated user's information from the API.
 *
 * @returns {Promise<fetchUserResult>} A promise that resolves to an object containing the user's information,
 *                                     or an error message if the request fails.
 */
export const fetchUser = async (): Promise<fetchUserResult> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
      {
        credentials: "include",
      }
    );

    const responseData: fetchUserResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: getErrorMessage(responseData.error),
      };
    }

    return {
      ok: true,
      message: getSuccessMessage(responseData.message),
      user: responseData.user,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: getErrorMessage(error as string),
    };
  }
};
