package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
	logger *slog.Logger
}

func NewUserRepository(db *gorm.DB, logger *slog.Logger) *UserRepository {
	return &UserRepository{db, logger}
}


func (ur *UserRepository) GetUserByEmail(email string) (*models.User, error) {

	var user *models.User

	result := ur.db.Where("email = ?", email).First(&user)

	return user, utils.ParseDBError(result.Error)


	
}