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


// NewUserService creates a new instance of UserService.
// It takes a UserRepository and a Logger as parameters and returns a pointer to UserService.
//
// Parameters:
//   - _ur: A pointer to UserRepository which handles user data operations.
//   - _logger: A pointer to slog.Logger for logging purposes.
//
// Returns:
//   - A pointer to UserService.
func NewUserService(_ur *repositories.UserRepository, _logger *slog.Logger ) *UserService{
	return &UserService{userRepository: _ur, logger: _logger}
}


// GetUserByEmail retrieves a user by their email address.
// It takes an email string as input and returns a pointer to a User model and an error.
// If the user is found, it returns the user and a nil error.
// If the user is not found or an error occurs, it returns nil and the error.
func (us *UserService) GetUserByEmail(email string) (*models.User, error) {
	user, err := us.userRepository.GetUserByEmail(email);

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetUserById(id uint) (*models.User, error) {
	user, err := us.userRepository.GetUserById(id)

	if err != nil {
		return nil, err
	}

	return user, nil
}