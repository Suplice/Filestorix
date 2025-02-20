package repositories

import (
	"log/slog"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
	logger *slog.Logger
}

func NewUserRepository(db *gorm.DB, logger *slog.Logger) *UserRepository {
	return &UserRepository{db, logger}
}