package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"strconv"
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

// LoginWithGoogle handles the OAuth2 login process using a Google authorization code.
// It exchanges the authorization code for an access token, retrieves user information
// from Google, and either logs in the user or registers a new user if they do not exist.
//
// Parameters:
//   - code: The authorization code received from Google after user consent.
//
// Returns:
//   - *models.User: The authenticated or newly registered user.
//   - error: An error if the login or registration process fails.
func (as *AuthService) LoginWithGoogle(code string) (*models.User, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")

	if clientID == "" || clientSecret == "" || redirectURI == "" {
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
		return nil, err
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

// LoginWithGithub handles the OAuth login process with GitHub.
// It exchanges the provided authorization code for an access token,
// retrieves the user's information and email from GitHub, and either
// logs in the user if they already exist or registers a new user.
//
// Parameters:
//   - code: The authorization code received from GitHub after user authorization.
//
// Returns:
//   - *models.User: The authenticated or newly registered user.
//   - error: An error if the login or registration process fails.
func (as *AuthService) LoginWithGithub(code string) (*models.User, error) {

	clientID := os.Getenv("GITHUB_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")
	redirectURI := os.Getenv("GITHUB_REDIRECT_URI")

	if clientID == "" || clientSecret == "" || redirectURI == "" {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

	resp, err := http.PostForm("https://github.com/login/oauth/access_token", data)

	if err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}


	values, err := url.ParseQuery(string(body))
	if err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	tokenRes := &dto.GithubAuthTokenResult{
		AccessToken: values.Get("access_token"),
		TokenType:   values.Get("token_type"),
	}

	if tokenRes.AccessToken == "" {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	userInfo, err := fetchGithubUserInfo(tokenRes.AccessToken)

	if err != nil {
		return nil, err
	}

	userEmail, err := fetchGithubUserEmail(tokenRes.AccessToken)

	if err != nil {
		return nil, err
	}

	userInfo.Email = userEmail

	user, err := as.userService.GetUserByEmail(userInfo.Email)

	if err != nil && err.Error() != constants.ErrRecordNotFound {
		return nil, err
	} 

	if user != nil && user.GithubID == userInfo.GithubID {
		return user, nil
	}

	registeredUser, err := as.authRepository.Register(userInfo)

	if err != nil {
		return nil, err
	}

	return registeredUser, nil

}

// fetchGithubUserInfo retrieves the GitHub user information using the provided access token.
// It sends a GET request to the GitHub API to fetch the user details.
//
// Parameters:
//   - accessToken: A string containing the GitHub access token.
//
// Returns:
//   - *models.User: A pointer to the User model containing the GitHub user information.
//   - error: An error if the request fails or the response is invalid.
func fetchGithubUserInfo(accessToken string) (*models.User, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("User-Agent", "MyGitHubApp") 


	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(constants.ErrFailedGithub)
	}

	var user *dto.GithubUser

	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	stringUserId := strconv.Itoa(user.GithubID) 

	if stringUserId == "" {
		return nil, errors.New(constants.ErrFailedGithub)
	}

	return &models.User{
		GithubID: stringUserId,
		Username: user.Username,
		Provider: "GITHUB",
		Role: "USER",
	}, nil
}

// fetchGithubUserEmail retrieves the primary email address of a GitHub user using the provided access token.
// It sends a GET request to the GitHub API endpoint for user emails and parses the response to find the primary email.
//
// Parameters:
//   - accessToken: A string containing the GitHub OAuth access token.
//
// Returns:
//   - A string containing the primary email address of the GitHub user.
//   - An error if the request fails, the response cannot be decoded, or no primary email is found.
func fetchGithubUserEmail(accessToken string) (string, error) {
	req, _ := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
    req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
    req.Header.Set("User-Agent", "MyGitHubApp")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", errors.New(constants.ErrFailedGithub)
    }
    defer resp.Body.Close()

	var emails []dto.GithubEmails

	if err := json.NewDecoder(resp.Body).Decode(&emails); err != nil {
		return "", errors.New(constants.ErrFailedGithub)
	}

	for _, e := range emails {
		if e.Primary {
			return e.Email, nil
		}
	}

	return "", errors.New(constants.ErrFailedGithub)
}


// fetchGoogleUserInfo retrieves user information from Google using the provided access token.
// It sends a GET request to the Google OAuth2 userinfo endpoint and decodes the response into a GoogleUser DTO.
// If successful, it returns a User model populated with the retrieved information.
// In case of an error during the request or decoding, it returns an error indicating the failure.
//
// Parameters:
//   - accessToken: A string containing the Google OAuth2 access token.
//
// Returns:
//   - *models.User: A pointer to the User model containing the Google user information.
//   - error: An error indicating the failure reason, if any.
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