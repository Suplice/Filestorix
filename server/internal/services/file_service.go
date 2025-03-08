package services

import (
	"errors"
	"log/slog"
	"os"
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

func (fs *FileService) RenameFile(data dto.RenameFileRequest) error {
	return fs.fileRepository.RenameFile(data.FileId, data.Name)
}