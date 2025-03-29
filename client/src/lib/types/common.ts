/**
 * Base structure for API responses, including optional message and error.
 */
export type BaseResponse = {
  message?: string;
  error?: string;
};

export enum Side {
  LEFT = "left",
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
}

export enum ScreenSize {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
  ALL = 999999,
}
