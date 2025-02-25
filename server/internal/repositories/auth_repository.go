package repositories

import (
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


	result := ar.db.Create(userModel)

	if result.Error != nil {
		return nil, constants.ParseDBError(result.Error, "user")
	}

	return userModel, nil
}