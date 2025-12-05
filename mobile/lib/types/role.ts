export const roles = ["USER", "ADMIN"] as const;

export type Role = (typeof roles)[number];
