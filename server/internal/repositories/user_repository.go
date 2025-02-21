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

// NewUserRepository creates a new instance of UserRepository with the provided
// gorm.DB and slog.Logger. It returns a pointer to the created UserRepository.
//
// Parameters:
//   - db: A pointer to a gorm.DB instance for database operations.
//   - logger: A pointer to a slog.Logger instance for logging.
//
// Returns:
//   - A pointer to the created UserRepository.
func NewUserRepository(db *gorm.DB, logger *slog.Logger) *UserRepository {
	return &UserRepository{db, logger}
}


// GetUserByEmail retrieves a user from the database by their email address.
// It returns a pointer to the User model and an error if the operation fails.
//
// Parameters:
//   - email: The email address of the user to retrieve.
//
// Returns:
//   - *models.User: A pointer to the User model if found, otherwise nil.
//   - error: An error if the operation fails, otherwise nil.
func (ur *UserRepository) GetUserByEmail(email string) (*models.User, error) {

	var user *models.User

	result := ur.db.Where("email = ?", email).First(&user)

	return user, utils.ParseDBError(result.Error)


	
}