package database

import (
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


type Database struct {
	DB *gorm.DB
}



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
		&models.Settings{},
		&models.Task{},
		&models.TaskQuestion{},
		&models.UserTaskProgress{},
		&models.UserAnswer{},
		&models.CodeSubmission{},
		&models.Badge{},
		&models.UserBadge{},
		&models.Friendship{},
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