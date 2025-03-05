package database

import (
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


type Database struct {
	DB *gorm.DB
}



// Connect establishes a connection to the database using the provided database URL.
// It returns a pointer to the gorm.DB instance and an error if the connection fails.
//
// Parameters:
//   - databaseURL: A string containing the URL of the database to connect to.
//
// Returns:
//   - *gorm.DB: A pointer to the gorm.DB instance representing the database connection.
//   - error: An error if the connection to the database fails, otherwise nil.
func Connect(databaseURL string) (*gorm.DB, error) {
	println(databaseURL)

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	return db, nil
}

// Migrate applies the database schema migrations for the provided gorm.DB instance.
// Returns an error if any migration fails.
func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.User{},
		&models.UserFile{},
		//&models.FavoriteFile{},
		&models.Thrash{},
		&models.ActivityLog{},
		&models.Settings{},
	)

	if err != nil {
		return err
	}

	return nil
}

// Close closes the database connection.
// It takes a *gorm.DB object as an argument and returns an error if any occurs during the process.
// The function retrieves the underlying sql.DB object from the gorm.DB instance and attempts to close it.
// If any error occurs while retrieving or closing the sql.DB object, it is returned.
func Close(db *gorm.DB) error {
	dbSQL, err := db.DB()

	if err != nil {
		return err
	}

	err = dbSQL.Close()

	if err != nil {
		return err
	}

	return nil
}