package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils/constants"
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

	if result.Error != nil {
		return nil, constants.ParseDBError(result.Error, "user")
	}

	return user, nil

}

func (ur *UserRepository) GetUserById(id uint) (*models.User, error){
	var user *models.User

	result := ur.db.Where("ID = ?", id).First(&user)

	if result.Error != nil {
		return nil, constants.ParseDBError(result.Error, "user")
	}

	return user, nil
}

func (ur *UserRepository) GetUserWithHistory(userID uint64) (*models.User, error) {
    var user models.User
    // Preloadujemy TaskProgress oraz zagnieżdżony Task, żeby znać język i typ zadania
    err := ur.db.
        Preload("TaskProgress").
        Preload("TaskProgress.Task"). 
        First(&user, userID).Error
    
    if err != nil {
        return nil, err
    }
    return &user, nil
}