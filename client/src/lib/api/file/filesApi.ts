import {
  AddCatalogResponse,
  AddFileResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  DeleteFileResult,
  FetchFilesResponse,
  RenameFileRequest,
  RenameFileResponse,
  RenameFileResult,
  TrashFileRequest,
  TrashFileResponse,
  TrashFileResult,
  UploadCatalogRequest,
  UploadFilesRequest,
  UserFile,
} from "@/lib/types/file";

/**
 * Fetches the files associated with a specific user.
 *
 * @param userId - The ID of the user whose files are to be fetched.
 * @returns A promise that resolves to a `FetchFilesResponse` object containing the user's files.
 * @throws An error if the fetch operation fails or the response is not ok.
 */
export const fetchUserFiles = async (): Promise<FetchFilesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/fetchall`,
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

/**
 * Uploads files to the server.
 *
 * @param data - The request data containing the files to upload and optional parentId.
 * @returns A promise that resolves to an array of UserFile objects.
 * @throws Will throw an error if the response is not ok or if the response data does not contain files.
 */
export const uploadFiles = async (
  data: UploadFilesRequest
): Promise<UserFile[]> => {
  const filesData = new FormData();

  for (const file of data.files) {
    filesData.append("files", file);
  }
  if (data.parentId != null) {
    filesData.append("parentId", data.parentId.toString());
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/addfile`,
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

/**
 * Uploads a catalog to the server.
 *
 * @param data - The request data for uploading the catalog.
 * @returns A promise that resolves to a string message indicating the result of the upload.
 * @throws An error if the upload fails or the response is not ok.
 */
export const uploadCatalog = async (
  data: UploadCatalogRequest
): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/addcatalog`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ name: data.name, parentId: data.parentId }),
    }
  );

  const responseData: AddCatalogResponse = await response.json();

  if (!response.ok || !responseData.message) {
    throw new Error(responseData.error);
  }

  return responseData.message;
};

/**
 * Renames a file by sending a PUT request to the server.
 *
 * @param data - An object containing the new name and the file ID.
 * @returns A promise that resolves to an object containing the new name, file ID, and a message from the server.
 * @throws An error if the response is not ok or if there is no message in the response data.
 *
 */
export const renameFile = async (
  data: RenameFileRequest
): Promise<RenameFileResult> => {
  console.log(data.name, data.fileId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/rename`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ name: data.name, fileId: data.fileId }),
    }
  );

  const responseData: RenameFileResponse = await response.json();

  console.log(responseData);

  if (!response.ok || !responseData.message) {
    throw new Error(responseData.error);
  }

  return {
    newName: data.name,
    fileId: data.fileId,
    message: responseData.message,
  };
};

/**
 * Moves a file to the trash.
 *
 * @param data - The request data containing the file ID to be trashed.
 * @returns A promise that resolves to the result of the trash operation, including the file ID and a message.
 * @throws An error if the response is not ok or if there is no message in the response data.
 */
export const trashFile = async (
  data: TrashFileRequest
): Promise<TrashFileResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/trash/${data.fileId}`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  const responseData: TrashFileResponse = await response.json();

  if (!response.ok || !responseData.message) {
    throw new Error(responseData.error);
  }

  return { fileId: data.fileId, message: responseData.message };
};

/**
 * Fetches a file from the server and returns it as a Blob.
 *
 * @param fileName - The name of the file to fetch.
 * @returns A promise that resolves to a Blob containing the file data.
 * @throws An error if the fetch operation fails or the server returns a non-OK status.
 */
export const getFile = async (fileName: string): Promise<Blob> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/getfile/${fileName}`,
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.error || "Failed to fetch file");
  }

  const blob = await response.blob();
  return blob;
};

export const deleteFile = async (
  data: DeleteFileRequest
): Promise<DeleteFileResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/delete/${data.fileId}`,
    {
      credentials: "include",
      method: "POST",
    }
  );

  const responseData: DeleteFileResponse = await response.json();

  if (!response.ok || !responseData.message) {
    throw new Error(responseData.error);
  }

  return { fileId: data.fileId, message: responseData.message };
};
