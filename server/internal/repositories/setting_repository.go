package repositories

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"gorm.io/gorm"
)

type SettingRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewSettingRepository(_db *gorm.DB, _logger *slog.Logger) *SettingRepository {
	return &SettingRepository{db: _db, logger: _logger}
}

// GetAllUserSettings retrieves all settings for a given user.
// It takes userId as a parameter and returns a slice of Settings or an error if retrieval fails.
func (sr *SettingRepository) GetAllUserSettings(userId string) ([]*models.Settings, error) {
	var settings []*models.Settings

	result := sr.db.Where("user_id = ?", userId).Find(&settings)

	if result.Error != nil {
		return nil, result.Error
	}
	return settings, nil

}

// UpdateSettingsForUser updates the user's settings.
// It takes userId and a slice of UserSetting DTOs as parameters.
// Ensures that there are no duplicate setting keys before updating.
// Returns nil if the update is successful, or an error otherwise.
func (sr *SettingRepository) UpdateSettingsForUser(userId string, settings []dto.UserSetting) error {

	tx := sr.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUpdateSettings)
		
	}

	for _, setting := range settings {
		if err := tx.Model(&models.Settings{}).Where("user_id = ? AND setting_key = ?", userId, setting.SettingKey).Update("setting_value", setting.SettingValue).Error; err != nil {
			tx.Rollback()
			return errors.New(constants.ErrUpdateSettings)
		}
	}

	tx.Commit()
	return nil
}