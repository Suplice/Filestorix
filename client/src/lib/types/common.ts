/**
 * Base structure for API responses, including optional message and error.
 */
export type BaseResponse = {
  message?: string;
  error?: string;
};
