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

func NewAuthService(_logger *slog.Logger, _us *UserService, _ar *repositories.AuthRepository ) *AuthService {
	return &AuthService{authRepository: _ar, userService: _us ,logger: _logger}
}

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