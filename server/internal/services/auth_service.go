package services

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils"
	"github.com/Suplice/Filestorix/internal/utils/constants"
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
		return nil , errors.New(constants.ErrInvalidData)
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

	if err != nil {
		return nil, err
	}

	user.PasswordHash = ""

	return user, nil
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
		return nil, err
	}

	if compareErr := utils.ComparePasswords(data.Password, []byte(user.PasswordHash)); compareErr != nil {
		return nil, errors.New(constants.ErrInvalidData)
	}

	user.PasswordHash = ""

	return user, nil

}


// FetchUser retrieves a user by their unique identifier.
// It returns a pointer to the User model and an error if the user could not be found.
//
// Parameters:
//   userId - the unique identifier of the user to be fetched.
//
// Returns:
//   *models.User - a pointer to the User model if found.
//   error - an error if the user could not be found or any other issue occurred.
func (as *AuthService) FetchUser(userId uint) (*models.User, error) {
	user, err := as.userService.GetUserById(userId)

	if err != nil {
		return nil, err
	}

	return user, nil

}

func (as *AuthService) LoginWithGoogle(code string) (*models.User, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")

	if clientID == "" || clientSecret == "" || redirectURI == "" {
		as.logger.Error("AuthService - Loaded env variables are incorrect %s, %s, %s", clientID, clientSecret, redirectURI)
		return nil, errors.New(constants.ErrUnexpected)
	} 

	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

	resp, err := http.PostForm("https://oauth2.googleapis.com/token", data)

	if err != nil {
		return nil, errors.New(constants.ErrFaildedGoogle)
	}
	
	defer resp.Body.Close()

	var tokenRes *dto.GoogleAuthTokenResult

	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return nil, errors.New(constants.ErrFaildedGoogle)
	}

	userInfo, err := fetchGoogleUserInfo(tokenRes.AccessToken)

	if err != nil {
		return nil, errors.New(constants.ErrFaildedGoogle)
	}

	user, err := as.userService.GetUserByEmail(userInfo.Email)

	if err != nil && err.Error() != constants.ErrRecordNotFound {
		return nil, err
	} 

	if user != nil && user.GoogleID == userInfo.GoogleID {
		return user, nil
	}

	registeredUser, err := as.authRepository.Register(userInfo)

	if err != nil {
		return nil, err
	}

	return registeredUser, nil

}

func fetchGoogleUserInfo(accessToken string) (*models.User, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken)

	if err != nil {
		return nil, errors.New(constants.ErrFaildedGoogle)
	}

	defer resp.Body.Close()

	var user *dto.GoogleUser

	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, errors.New(constants.ErrFaildedGoogle)
	}

	return &models.User{
		GoogleID: user.Sub,
		Username: user.Name,
		Email:	user.Email,
		AvatarURL: user.Picture,
		Provider: "GOOGLE",
		Role: "USER",
	}, nil


}