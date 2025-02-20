package services

import (
	"errors"
	"log/slog"
	"strings"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/utils"
	"gorm.io/gorm"
)

type AuthService struct {
	authRepository *repositories.AuthRepository
	logger *slog.Logger
}

func NewAuthService(db *gorm.DB, logger *slog.Logger) *AuthService {
	return &AuthService{repositories.NewAuthRepository(db, logger), logger}
}


func (as *AuthService) Register(data dto.RegisterRequestDTO) (*models.User, error) {

	username := strings.Split(data.Email, "@")[0]

	if username == "" {
		as.logger.Error("AuthService - email is invalid")
		return nil , errors.New("email is invalid")
	}

	hashedPassword, err := utils.HashPassword(data.Password)

	if err != nil {
		as.logger.Error("AuthService - Error occured while hashing password", err)
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

	return as.authRepository.Register(newUser)
} 