package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
	logger *slog.Logger
}

func NewAuthRepository(db *gorm.DB, logger *slog.Logger) *AuthRepository {

	return &AuthRepository{db, logger}
}


func (ar *AuthRepository) Register(userModel *models.User) (*models.User, error) {


	result := ar.db.Create(userModel)

	if result.Error != nil {
		ar.logger.Error("AuthRepository - Error occured while adding user to database", slog.Any("error", result.Error))
		return nil, result.Error
	}

	return userModel, nil
}