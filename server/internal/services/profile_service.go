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

// NewAuthService creates a new instance of AuthService.
// It takes a logger, a user service, and an auth repository as parameters.
//
// Parameters:
//   - _logger: A pointer to an instance of slog.Logger for logging purposes.
//   - _us: A pointer to an instance of UserService for user-related operations.
//   - _ar: A pointer to an instance of AuthRepository for authentication-related operations.
//
// Returns:
//   - A pointer to an instance of AuthService.
func NewProfileService(_logger *slog.Logger, _pr *repositories.ProfileRepository) *ProfileService {
	return &ProfileService{profileRepository: _pr,  logger: _logger}
}

func (ps *ProfileService) GetProfile(profileUserID, currentUserID uint) (*dto.ProfileDTO, error) {
	return ps.profileRepository.GetProfileData(profileUserID, currentUserID)
}