package services

import (
	"errors"
	"log/slog"
	"strings"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils"
)

type AuthService struct {
	authRepository 	*repositories.AuthRepository
	userService 	*UserService
	logger			*slog.Logger
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
func NewAuthService(_logger *slog.Logger, _us *UserService, _ar *repositories.AuthRepository ) *AuthService {
	return &AuthService{authRepository: _ar, userService: _us ,logger: _logger}
}

// Register registers a new user with the provided registration data.
// It extracts the username from the email, hashes the password, and creates a new user record.
// If the email is invalid or there is an error hashing the password, it returns an error.
// On success, it returns the newly created user with the password hash removed.
//
// Parameters:
//   - data: dto.RegisterRequestDTO containing the registration details.
//
// Returns:
//   - *models.User: The newly created user with the password hash removed.
//   - error: An error if the registration fails.
func (as *AuthService) Register(data dto.RegisterRequestDTO) (*models.User, error) {

	username := strings.Split(data.Email, "@")[0]

	if username == "" {
		return nil , errors.New("email is invalid")
	}

	hashedPassword, err := utils.HashPassword(data.Password)

	if err != nil {
		return nil, err
	}

	newUser := &models.User{
		Username: username,
		Email: data.Email,
		Provider: "EMAIL",
		AvatarURL: "",
		Role: "USER",
		PasswordHash: hashedPassword,
	}

	user, err := as.authRepository.Register(newUser)

	user.PasswordHash = ""

	return user, err
} 

// LoginWithEmail authenticates a user using their email and password.
// It takes a LoginRequestDTO containing the user's email and password,
// and returns the authenticated User model or an error if authentication fails.
//
// Parameters:
//   - data: dto.LoginRequestDTO containing the user's email and password.
//
// Returns:
//   - *models.User: The authenticated user model with the password hash removed.
//   - error: An error if the email or password is incorrect or if there is an issue retrieving the user.
func (as *AuthService) LoginWithEmail(data dto.LoginRequestDTO) (*models.User, error) {

	user, err := as.userService.GetUserByEmail(data.Email)

	if err != nil  {
		return nil, errors.New("email or password is incorrect") 
	}

	if compareErr := utils.ComparePasswords(data.Password, []byte(user.PasswordHash)); compareErr != nil {
		return nil, errors.New("email or password is incorrect")
	}

	user.PasswordHash = ""

	return user, nil

}