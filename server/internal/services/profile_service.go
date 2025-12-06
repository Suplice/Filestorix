package services

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/repositories"
)

type ProfileService struct {
	profileRepository *repositories.ProfileRepository
	logger            *slog.Logger
}

func NewProfileService(_logger *slog.Logger, _pr *repositories.ProfileRepository) *ProfileService {
	return &ProfileService{profileRepository: _pr,  logger: _logger}
}

func (ps *ProfileService) GetProfile(profileUserID, currentUserID uint) (*dto.ProfileDTO, error) {
	return ps.profileRepository.GetProfileData(profileUserID, currentUserID)
}