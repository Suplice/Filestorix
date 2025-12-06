package services

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils/constants"
)

type SettingService struct {
	settingRepository *repositories.SettingRepository
	logger            *slog.Logger
}

func NewSettingService(_settingRepository *repositories.SettingRepository, _logger *slog.Logger) *SettingService {
	return &SettingService{settingRepository: _settingRepository, logger: _logger}
}

func (ss *SettingService) GetAllUserSettings(userId string) ([]*models.Settings, error) {
	return ss.settingRepository.GetAllUserSettings(userId)
}

func (ss *SettingService) UpdateSettingsForUser(userId string, settings []dto.UserSetting) error {

	keySet := make(map[string]bool)

    for _, setting := range settings {
        if _, exists := keySet[setting.SettingKey]; exists {
            return errors.New(constants.ErrSettingsSameKeys)
        }
        keySet[setting.SettingKey] = true
    }



	return ss.settingRepository.UpdateSettingsForUser(userId, settings)
}

func (ss *SettingService) ToggleHiddenFilesForUser(userId string, state string) error {
	toggleHiddenSetting := []dto.UserSetting{
        {
            SettingKey:   "showHiddenFiles",
            SettingValue: state,
        },
    }

	err := ss.settingRepository.UpdateSettingsForUser(userId, toggleHiddenSetting)

	if err != nil {
		return err
	}

	return nil
}