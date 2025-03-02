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

func convertUserIdToUint(userId string) (uint, error) {
	trimmedUserId := strings.TrimSpace(userId) 

	numberUserId, err := strconv.ParseUint(trimmedUserId, 10, 32)

	if err != nil {
		return 0, errors.New(constants.ErrUnexpected)
	}
	return uint(numberUserId), nil
}