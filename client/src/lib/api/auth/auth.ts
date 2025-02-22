import {
  signFormResponse,
  signFormResult,
  signInForm,
  signUpForm,
} from "@/lib/types/forms";

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
        error: responseData.error || "An error occured, please try again",
      };
    }

    setSessionExpireDate(responseData.sessionExpiresAt!);

    return { ok: true, user: responseData.user, message: responseData.message };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "An unexpected error occurred, please try again",
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
        error: responseData.error || "An error occured, please try again",
      };
    }

    setSessionExpireDate(responseData.sessionExpiresAt!);

    return { ok: true, user: responseData.user, message: responseData.message };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "An unexpected error occured, please try again",
    };
  }
};

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
 * Sets the session expiration date in the local storage.
 *
 * @param date - The expiration date as a Unix timestamp (in seconds).
 */
const setSessionExpireDate = (date: number) => {
  const actualDate = new Date(date * 1000);

  localStorage.setItem("sessionExpiresAt", actualDate.toISOString());
};

/**
 * Retrieves the session expiration date from the local storage.
 *
 * @returns {string | null} The session expiration date as a string if it exists, otherwise null.
 */
export const getSessionExpireDate = () => {
  return localStorage.getItem("sessionExpiresAt");
};

/**
 * Removes the session expiration date from the local storage.
 * This function deletes the "sessionExpiresAt" item from the local storage,
 * effectively clearing any stored session expiration information.
 */
export const removeSessionEpireDate = () => {
  localStorage.removeItem("sessionExpiresAt");
};
