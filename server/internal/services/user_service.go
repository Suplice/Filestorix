package services

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
)

type UserService struct {
	userRepository *repositories.UserRepository
	logger *slog.Logger
}


func NewUserService(_ur *repositories.UserRepository, _logger *slog.Logger ) *UserService{
	return &UserService{userRepository: _ur, logger: _logger}
}


func (us *UserService) GetUserByEmail(email string) (*models.User, error) {
	user, err := us.userRepository.GetUserByEmail(email);

	if err != nil {
		return nil, err
	}

	return user, nil
}