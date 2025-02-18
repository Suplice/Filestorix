package database

import (
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)






func Connect(databaseURL string) (*gorm.DB, error) {
	println(databaseURL)

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.User{},
		&models.File{},
		&models.Catalog{},
		&models.FavoriteFile{},
		&models.Thrash{},
		&models.ActivityLog{},
	)

	if err != nil {
		return err
	}

	return nil
}

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