package services

import (
	"errors"
	"log/slog"
	"strconv"
	"strings"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils/constants"
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
	numberUserId, err := convertUserIdToUint(userId)

	if err != nil {
		return nil, err
	}

	files, err := fs.fileRepository.FetchAllUserFiles(numberUserId)

	if err != nil {
		return nil, err
	}

	return files, nil

}

// convertUserIdToUint converts a user ID from a string to a uint.
// It trims any leading or trailing whitespace from the input string,
// then attempts to parse it as an unsigned integer (base 10, 32-bit).
// If the parsing fails, it returns an error with a constant error message.
func convertUserIdToUint(userId string) (uint, error) {
	trimmedUserId := strings.TrimSpace(userId) 

	numberUserId, err := strconv.ParseUint(trimmedUserId, 10, 32)

	if err != nil {
		return 0, errors.New(constants.ErrUnexpected)
	}
	return uint(numberUserId), nil
}