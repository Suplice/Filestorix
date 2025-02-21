package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils"
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
		return nil, utils.ParseDBError(result.Error)
	}

	return userModel, nil
}