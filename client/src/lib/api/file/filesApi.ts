import { getErrorMessage } from "@/lib/utils/ApiResponses";

export const fetchUserFiles = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/fetchall/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData.error));
  }

  return responseData.files;
};
