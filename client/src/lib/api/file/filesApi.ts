import { FetchFilesResponse, UserFile } from "@/lib/types/file";
import { AddFileResponse } from "@/lib/types/forms";

/**
 * Fetches the files associated with a specific user.
 *
 * @param userId - The ID of the user whose files are to be fetched.
 * @returns A promise that resolves to a `FetchFilesResponse` object containing the user's files.
 * @throws An error if the fetch operation fails or the response is not ok.
 */
export const fetchUserFiles = async (
  userId: number
): Promise<FetchFilesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/fetchall/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const responseData: FetchFilesResponse = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  return { files: responseData.files };
};

export const uploadFiles = async (
  files: File[],
  userId: number
): Promise<UserFile[]> => {
  const filesData = new FormData();

  for (const file of files) {
    filesData.append("files", file);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/add/${userId}`,
    {
      method: "POST",
      credentials: "include",
      body: filesData,
    }
  );

  const responseData: AddFileResponse = await response.json();

  if (!response.ok || !responseData.files) {
    throw new Error(responseData.error);
  }

  return responseData.files;
};
