package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type AdminRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewAdminRepository(db *gorm.DB, logger *slog.Logger) *AdminRepository {
	return &AdminRepository{db: db, logger: logger}
}

func (ar *AdminRepository) DeleteUser(userID uint) error {
	return ar.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", userID).Delete(&models.UserTaskProgress{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&models.UserBadge{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&models.Settings{}).Error; err != nil {
			return err
		}
		
		if err := tx.Select(clause.Associations).Delete(&models.User{}, userID).Error; err != nil {
			return err
		}
		return nil
	})
}

func (ar *AdminRepository) DeleteTask(taskID uint) error {
	return ar.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("task_id = ?", taskID).Delete(&models.TaskQuestion{}).Error; err != nil {
			return err
		}
		if err := tx.Where("task_id = ?", taskID).Delete(&models.UserTaskProgress{}).Error; err != nil {
			return err
		}

		if err := tx.Delete(&models.Task{}, taskID).Error; err != nil {
			return err
		}
		return nil
	})
}

type SystemStats struct {
	TotalUsers     int64 `json:"total_users"`
	TotalTasks     int64 `json:"total_tasks"`
	TotalCompleted int64 `json:"total_completed_tasks"`
}

func (ar *AdminRepository) GetSystemStats() (*SystemStats, error) {
	var stats SystemStats

	if err := ar.db.Model(&models.User{}).Count(&stats.TotalUsers).Error; err != nil {
		return nil, err
	}
	if err := ar.db.Model(&models.Task{}).Count(&stats.TotalTasks).Error; err != nil {
		return nil, err
	}
	if err := ar.db.Model(&models.UserTaskProgress{}).Where("is_completed = ?", true).Count(&stats.TotalCompleted).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (ar *AdminRepository) GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := ar.db.Select("id", "username", "email", "avatar_url", "role", "level", "points").Find(&users)
	return users, result.Error
}