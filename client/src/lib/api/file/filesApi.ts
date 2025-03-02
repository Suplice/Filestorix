import { getErrorMessage } from "@/lib/utils/ApiResponses";

export const fetchUserFiles = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/fetchall/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(getErrorMessage("error"));
  }

  return [];
};
