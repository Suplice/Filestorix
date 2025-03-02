package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"gorm.io/gorm"
)

type FileRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewFileRepository(_db *gorm.DB, _logger *slog.Logger) *FileRepository {
	return &FileRepository{db: _db, logger: _logger}
}

func (fr *FileRepository) FetchAllUserFiles(userId uint) ([]*models.UserFile, error) {
	var files []*models.UserFile
	result := fr.db.Where("user_id = ?", userId).Find(&files)
	
	if result.Error != nil {
		return nil, constants.ParseDBError(result.Error, "file")
	}

	return files, nil
}