package services

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
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