package repositories

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils/constants"
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

	tx := ar.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return nil, constants.ParseDBError(tx.Error, "user")
	}

	result := tx.Create(userModel)

	if result.Error != nil {
		tx.Rollback()
		return nil, constants.ParseDBError(result.Error, "user")
	}

	err := InitializeSettingsForNewUser(userModel, tx)

	if err != nil {
		tx.Rollback()
		return nil, errors.New(constants.ErrUnexpected)
	}

	tx.Commit()

	return userModel, nil
}

func InitializeSettingsForNewUser(userModel *models.User, tx *gorm.DB) error {

	for _, setting := range constants.BaseSettings {
		newSetting := models.Settings{
			UserId:       userModel.ID,
			SettingKey:   setting.SettingKey,
			SettingValue: setting.SettingValue,
		}
		if err := tx.Create(&newSetting).Error; err != nil {
			return err
		}
	}
	return nil
}