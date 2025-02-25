enum ErrorMessage {
  INVALID_DATA = "Invalid input data. Please check your details.",
  USER_ALREADY_EXISTS = "A user with this email already exists.",
  UNEXPECTED_ERROR = "An unexpected error occurred, please try again.",
  DB_UNKNOWN_ERROR = "An error occured, please try again later.",
  UNAUTHORIZED = "You are not authorized, please sign in and try again.",
  SESSION_EXPIRED = "Your session has expired, please log in again.",
}

enum SuccessMessage {
  USER_REGISTERED = "User registered successfully!",
  USER_LOGGED_IN = "User logged in successfully!",
  LOGGED_OUT = "Logged out successfully",
}

export const getErrorMessage = (errorCode?: string): string => {
  return (
    ErrorMessage[errorCode as keyof typeof ErrorMessage] ||
    "Unknown error, please try again."
  );
};

export const getSuccessMessage = (successCode?: string): string => {
  return (
    SuccessMessage[successCode as keyof typeof SuccessMessage] || "Success!"
  );
};
