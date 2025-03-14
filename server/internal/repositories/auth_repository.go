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

// NewAuthRepository creates a new instance of AuthRepository with the provided
// database connection and logger.
// 
// Parameters:
//   - db: A pointer to a gorm.DB instance representing the database connection.
//   - logger: A pointer to a slog.Logger instance for logging purposes.
// 
// Returns:
//   A pointer to an AuthRepository instance.
func NewAuthRepository(db *gorm.DB, logger *slog.Logger) *AuthRepository {

	return &AuthRepository{db, logger}
}


// Register registers a new user in the database.
// It takes a pointer to a User model as input and returns the created User model or an error if the operation fails.
// 
// Parameters:
//   userModel (*models.User): A pointer to the User model to be registered.
//
// Returns:
//   (*models.User, error): The registered User model or an error if the registration fails.
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