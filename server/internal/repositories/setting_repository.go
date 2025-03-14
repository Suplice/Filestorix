package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type SettingRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewSettingRepository(_db *gorm.DB, _logger *slog.Logger) *SettingRepository {
	return &SettingRepository{db: _db, logger: _logger}
}

func (sr *SettingRepository) GetAllUserSettings(userId string) ([]*models.Settings, error) {
	var settings []*models.Settings

	result := sr.db.Where("user_id = ?", userId).Find(&settings)

	if result.Error != nil {
		return nil, result.Error
	}
	return settings, nil

}