export const providers = ["GOOGLE", "GITHUB", "EMAIL"] as const;

export type Provider = (typeof providers)[number];
