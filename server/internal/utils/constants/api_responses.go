package constants

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

// Api info messages
const (
	// Success message, when user successfully logged in
	SuccessUserLoggedIn		= "USER_LOGGED_IN"
	
	// Success message, when user successfully logged out
	SuccessUserLoggedOut	= "LOGGED_OUT"

	// Success message, when user successfully registered
	SuccessUserRegistered	= "USER_REGISTERED"

	// Success message, when user successfully logged in via google
	SuccessUserGoogleLogin	= "SUCCESS_GOOGLE_LOGIN"

	// Success message, when user successfully logged in via github
	SuccessUserGithubLogin 	= "SUCCESS_GITHUB_LOGIN"

	// Success message, when user successfuly uploads files
	SuccessUploadFiles 		= "SUCCESS_UPLOAD_FILES"

	//Success message, when Catalog was created successfully
	SuccessCreateCatalog 	= "SUCCES_UPLOAD_CATALOG"

	// Success message, when file was renamed successfully
	SuccessRenamingFile 	= "SUCCESS_RENAME_FILE"

	// Success message, when trashing file is successful
	SuccessTrashingFile 	= "SUCCESS_TRASH_FILE"

	// Success message, when deleting file is successful
	SuccessDeletingFile		= "SUCCESS_DELETE_FILE"	

	// Success message, when trashing catalog is successful
	SuccessTrashingCatalog	= "SUCCESS_TRASH_CATALOG"
	
	// Success message, when deleting catalog is successful
	SuccessDeleteCatalog 	= "SUCCESS_DELETE_CATALOG"

	// Success message, when restoring file is successful
	SuccessRestoreFile		= "SUCCESS_RESTORE_FILE"

	// Success message, when removing file from favorites
	// is successful
	SuccessRemoveFavorite	= "SUCCESS_REMOVE_FAVORITE"

	// Success message, when adding file to favorites
	// is successful
	SuccessAddFavorite		= "SUCCESS_ADD_FAVORITE"

	// Success message, when updating settings was successful
	SuccessUpdateSettings 	= "SUCCESS_UPDATE_SETTINGS"

	// Success message, when hiding file is successful
	SuccessHideFile			= "SUCCESS_HIDE_FILE"

	// Success message, when revealing file is successful
	SuccessRevealFile		= "SUCCESS_REVEAL_FILE"

	//Success message, when toggling hidden files is succcessful
	SuccessToggleHidden		= "SUCCESS_TOGGLE_HIDDEN"

	// Success message, when moving file is successful
	SuccessMoveFile			= "SUCCESS_MOVE_FILE"
)
// Api error messages
const (
	// Error message, when user does not exist in database
	ErrUserExists   		= "USER_ALREADY_EXISTS" 

	// Error message, when record is not found in database
	ErrRecordNotFound 		= "INVALID_DATA"

	// Error message, when unexpected error occured in database
	ErrDBUnknown    		= "DB_UNKNOWN_ERROR"

	// Error message, when provided data is invalid 
	ErrInvalidData 			= "INVALID_DATA"

	// Error message, when an unexpected error occurs
	ErrUnexpected 			= "UNEXPECTED_ERROR"

	// Error message, when user is not authorized
	ErrUnauthorized			= "UNAUTHORIZED"

	// Error message, when user session has expired
	ErrSessionExpired		= "SESSION_EXPIRED"

	// Error message, when logging in via google fails
	ErrFaildedGoogle		= "FAILED_GOOGLE_LOGIN"

	// Error message, when logging in via github fails
	ErrFailedGithub 		= "FAILED_GITHUB_LOGIN"

	// Error message, when fetching files fails
	ErrFailedToFetchFiles 	= "FAILED_FETCH_FILES"

	// Error message, when use tries to upload files 
	// whose combined size is exceeds maximal size
	ErrExceededFileSize 	= "EXCEEDED_FILE_SIZE"

	// Error message, when saving files to database or 
	// server folders fails
	ErrFailedSaving 		= "FAILED_SAVING_FILES"

	// Error message, when one of files to be saved
	// already exists in database
	ErrFileAlreadyExists 	= "FILE_ALREADY_EXISTS"

	// Error message, when file gives error
	// while trying to open fileHeader
	// or the file is broken
	ErrFileIsCorrupt		= "FILE_CORRUPT_ERROR"

	// Error message, when request file
	// contains invalid data, f.e "fileId"
	ErrInvalidFileData		= "INVALID_FILE_DATA"

	// Error message, when requested file
	// does not exist on server side
	ErrFileDoesNotExist 	= "FILE_NOT_EXIST"

	// Error message, when deleting file fails
	ErrDeletingFile			= "ERROR_DELETE_FILE"

	// Error message, when provided catalog does not
	// exist or it's data is incorrect
	ErrInvalidCatalogData	= "INVALID_CATALOG_DATA"

	// Error message, when deleting catalog fails
	ErrDeleteCatalog		= "ERROR_DELETING_CATALOG"

	// Error message, when restoring file fails
	ErrRestoreFile			= "ERROR_RESTORING_FILE"

	// Error message, when removing file from favorite files
	// fails
	ErrRemoveFavorite		= "ERROR_REMOVE_FAVORITE"

	// Error message, when adding file to favorite files
	// fails
	ErrAddFavorite			= "ERROR_ADD_FAVORITE"

	// Error message, when updating settings fails
	ErrUpdateSettings		= "ERROR_UPDATE_SETTINGS"

	// Error message, when two settings have same value
	ErrSettingsSameKeys		= "ERROR_SAME_SETTING_KEYS"

	// Error message, when hiding file has failed
	ErrHideFile				= "ERROR_HIDING_FILE"

	// Error message, when revealing file has failed
	ErrRevealFile			= "ERROR_REVEAL_FILE"

	// Error message, when toggling hidden files fails
	ErrToggleHidden			= "ERROR_TOGGLE_HIDDEN"

	// Error message, when moving file fails
	ErrMoveFile 			= "ERROR_MOVE_FILE"

)

// ParseDBError parses the provided database error based on the given context.
func ParseDBError(err error, context string) error {
	if err == nil {
		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New(ErrRecordNotFound)
	}

	lowerErr := strings.ToLower(err.Error())
	if strings.Contains(lowerErr, "duplicate key") || strings.Contains(lowerErr, "unique constraint") {

		switch context {
		case "user":
			return errors.New(ErrUserExists)
		default:
			return errors.New(ErrDBUnknown) 
		}
	}

	return errors.New(ErrDBUnknown)
}
