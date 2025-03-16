package services

import (
	"errors"
	"log/slog"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type FileService struct {
	fileRepository *repositories.FileRepository
	logger         *slog.Logger
}

func NewFileService(_fileRepository *repositories.FileRepository, _logger *slog.Logger ) *FileService{
	return &FileService{fileRepository: _fileRepository, logger: _logger}
}


// FetchAllUserFiles retrieves all files associated with a given user ID.
// It converts the user ID from a string to a uint and then fetches the files
// from the file repository.
func (fs * FileService) FetchAllUserFiles(userId string) ([]*models.UserFile, error) {
	numberUserId, err := convertStringToUint(userId)

	if err != nil {
		return nil, err
	}

	files, err := fs.fileRepository.FetchAllUserFiles(numberUserId)

	if err != nil {
		return nil, err
	}

	return files, nil

}



// UploadFiles handles the uploading of multiple files for a given user.
// It parses the multipart form data from the request, validates the files,
// and saves them to the user's designated folder.
func (fs *FileService) UploadFiles(c *gin.Context, userId string, parentId string) ([]*models.UserFile, error) {
	err := c.Request.ParseMultipartForm(constants.MaxFileSize)
	if err != nil {
		return nil, errors.New(constants.ErrExceededFileSize)
	}

	form, _ := c.MultipartForm()
	files := form.File["files"]

	if len(files) == 0 {
		return nil, errors.New(constants.ErrInvalidData)
	}

	userIDInt, err := convertStringToUint(userId)

	if err != nil {
		return nil, errors.New(constants.ErrUnauthorized)
	}

	var uintParentId *uint = nil


	if parentId != "" {
		parentIDInt, err := convertStringToUint(parentId)

		if err != nil {
			return nil, errors.New(constants.ErrUnexpected)
		}
		uintParentId = &parentIDInt
	}
	

	userFolder := filepath.Join("/server/uploads", userId)
	if err := os.MkdirAll(userFolder, os.ModeDir); err != nil {
		return nil, errors.New(constants.ErrUnexpected)
	}

	uploadedFiles, err := fs.fileRepository.UploadFiles(userIDInt, files, userFolder, uintParentId)

	if err != nil {
		return nil, err
	}

	return uploadedFiles, nil


}

// convertUserIdToUint converts a user ID from a string to a uint.
// It trims any leading or trailing whitespace from the input string,
// then attempts to parse it as an unsigned integer (base 10, 32-bit).
// If the parsing fails, it returns an error with a constant error message.
func convertStringToUint(userId string) (uint, error) {
	trimmedUserId := strings.TrimSpace(userId) 

	numberUserId, err := strconv.ParseUint(trimmedUserId, 10, 32)

	if err != nil {
		return 0, errors.New(constants.ErrUnexpected)
	}
	return uint(numberUserId), nil
}

// CreateCatalog creates a new catalog (directory) for a user.
// It takes the catalog name, an optional parent ID, and the user ID as input parameters.
// The function returns the created UserFile model or an error if the creation fails.
func (fs *FileService) CreateCatalog(name string, parentId *uint, userId string) (*models.UserFile, error) {

	UintUserId, err := convertStringToUint(userId)

	if err != nil {
		return nil, errors.New(constants.ErrUnexpected)
	}

	catalog := &models.UserFile{
		UserID: UintUserId,
		Name: name,
		Extension: "",
		Type: "CATALOG",
		Size: 0,
		Path: "test",
		IsTrashed: false,
		ParentID: parentId,
		IsFavorite: false,
	}

	result, err := fs.fileRepository.CreateCatalog(catalog)

	if err != nil {
		return nil, err
	}

	return result, nil

}

// RenameFile renames a file identified by the given FileId to the new name provided in the RenameFileRequest.
// It delegates the renaming operation to the fileRepository.
func (fs *FileService) RenameFile(data dto.RenameFileRequest) error {
	return fs.fileRepository.RenameFile(data.FileId, data.Name)
}

// TrashFile moves the specified file to the trash.
// It takes a fileId as a string, converts it to an unsigned integer,
// and then calls the file repository to trash the file.
// If the fileId is invalid and cannot be converted, it returns an error.
func (fs *FileService) TrashFile(fileId string) error {

	uintFileId, err := convertStringToUint(fileId)

	if err != nil {
		return errors.New(constants.ErrInvalidFileData)
	}

	return fs.fileRepository.TrashFile(uintFileId)
}

// GetFile retrieves the file path for a given file ID and user ID.
// It ensures that the file ID and user ID are safe by using the base name of the paths.
// If the file does not exist, it returns an error indicating that the file does not exist.
func (fs *FileService) GetFile(fileId string, userId string) (string, error) {

	safeFileId := path.Base(fileId)
	safeUserId := path.Base(userId)


	filePath := filepath.Join("/server/uploads", safeUserId, safeFileId)


	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return "", errors.New(constants.ErrFileDoesNotExist)
	}

	return filePath, nil
}


// DeleteFile deletes a file both from the database and from disk.
// It takes fileId and userId as parameters, where fileId identifies the file to be deleted,
// and userId is used to locate the file on disk.
// If the file is successfully deleted from both database and disk, it returns nil.
// If there is an error during any step of the process, it returns an appropriate error.
func (fs *FileService) DeleteFile(fileId string, userId string) error {
	uintFileId, err := convertStringToUint(fileId)

	if err != nil {
		return errors.New(constants.ErrInvalidFileData)
	}

	file, err := fs.fileRepository.GetFile(fileId)

	if err != nil {
		return err
	}



	return fs.fileRepository.DeleteFile(uintFileId, userId, file.Extension)
}

// TrashCatalog marks a catalog (folder) and all of its nested contents as trashed in the database.
// It takes catalogId as a parameter, which is the unique identifier of the catalog to be trashed.
// If the operation is successful, it returns nil. Otherwise, it returns an error indicating the failure.
func (fs *FileService) TrashCatalog(catalogId string) error {
	return fs.fileRepository.TrashCatalog(catalogId)
}

// DeleteCatalog permanently deletes a catalog (folder) from the database.
// Before deletion, it ensures that all child elements are detached properly to avoid orphaned records.
// It takes catalogId as a parameter, which is the unique identifier of the catalog to delete.
// If the operation is successful, it returns nil. Otherwise, it returns an error indicating the failure.
func (fs *FileService) DeleteCatalog(catalogId string) error {
	return fs.fileRepository.DeleteCatalog(catalogId)
}

// RestoreFile restores a file from the trash and ensures that all its parent catalogs are also restored if needed.
// It takes fileId as a parameter to identify which file to restore, and parentId for potential future use (currently not used directly).
// Returns nil if the file and its parent structure are restored successfully, or an error otherwise.
func (fs *FileService) RestoreFile(fileId string, parentId string) error {
	return fs.fileRepository.RestoreFile(fileId, parentId)
}

func (fs *FileService) RemoveFavorite(fileId string) error {
	return fs.fileRepository.RemoveFavorite(fileId)
}

func (fs *FileService) AddFavorite(fileId string) error {
	return fs.fileRepository.AddFavorite(fileId)
}

func (fs *FileService) HideFile(fileId string) error {
	return fs.fileRepository.HideFile(fileId)
}

func (fs *FileService) RevealFile(fileId string) error {
	return fs.fileRepository.RevealFile(fileId)
}