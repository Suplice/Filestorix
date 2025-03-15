export enum ErrorMessage {
  INVALID_DATA = "Invalid input data. Please check your details.",
  USER_ALREADY_EXISTS = "A user with this email already exists.",
  UNEXPECTED_ERROR = "An unexpected error occurred, please try again.",
  DB_UNKNOWN_ERROR = "An error occured, please try again later.",
  UNAUTHORIZED = "You are not authorized, please sign in and try again.",
  SESSION_EXPIRED = "Your session has expired, please log in again.",
  LOGOUT_FAILED = "An error occured while trying to log out, please try again.",
  FAILED_GOOGLE_LOGIN = "An error occured, while trying to log in via google, please try again.",
  FAILED_GITHUB_LOGIN = "An error occured, while trying to log in via github, please try again.",
  FAILED_FETCH_FILES = "An error occured while fetching files, please try again.",
  EXCEEDED_FILE_SIZE = "Files size exceeded maximum (10MB), please upload less files at once.",
  FAILED_SAVING_FILES = "An error occured while trying to save files",
  FILE_ALREADY_EXISTS = "A file with the same name already exists on your disk. Please rename the file and try again.",
  FILE_CORRUPT_ERROR = "Saving file failed, one of your files might be corrupt, please try again.",
  FILE_NOT_EXIST = "The file you tried to open does not exist, please reload or try again.",
  ERROR_DELETE_FILE = "An error occured while trying to delete file, please try again.",
  INVALID_CATALOG_DATA = "An error occured while trying to perform action on this catalog, please try again.",
  ERROR_DELETING_CATALOG = "An error occured while trying to delete catalog, please try again.",
  ERROR_RESTORING_FILE = "An error occured while trying to restore file, please try again.",
  ERROR_REMOVE_FAVORITE = "An error occured while trying to remove file from favorite files, please try again.",
  ERROR_ADD_FAVORITE = "An error occured while trying to mark file as favorite, please try again.",
  ERROR_UPDATE_SETTINGS = "An error occured while trying to update settings, please try again.",
  ERROR_SAME_SETTING_KEYS = "One value can't be associated with multiple settings.",
}

export enum SuccessMessage {
  USER_REGISTERED = "User registered successfully!",
  USER_LOGGED_IN = "User logged in successfully!",
  LOGGED_OUT = "Logged out successfully!",
  SUCCESS_GOOGLE_LOGIN = "Logged in via google successfully!",
  SUCCESS_GITHUB_LOGIN = "Logged in via github successfully!",
  SUCCESS_UPLOAD_FILES = "Uploaded files successfully!",
  SUCCESS_UPLOAD_CATALOG = "Successfully created new catalog!",
  SUCCESS_RENAME_FILE = "Successfully renamed file!",
  SUCCESS_TRASH_FILE = "Successfully trashed file!",
  SUCCESS_DELETE_FILE = "Successfully deleted file!",
  SUCCESS_TRASH_CATALOG = "Successfully trashed catalog!",
  SUCCESS_DELETE_CATALOG = "Successfully deleted catalog!",
  SUCCESS_RESTORE_FILE = "Successfully restored file(s)!",
  SUCCESS_REMOVE_FAVORITE = "Successfully removed file from favorites!",
  SUCCESS_ADD_FAVORITE = "Successfully marked file as favorite!",
  SUCCESS_UPDATE_SETTINGS = "Successfully updated settings!",
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
