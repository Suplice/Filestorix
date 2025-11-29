package services

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
)

type AdminService struct {
	adminRepo *repositories.AdminRepository
	logger    *slog.Logger
}

func NewAdminService(adminRepo *repositories.AdminRepository, logger *slog.Logger) *AdminService {
	return &AdminService{adminRepo: adminRepo, logger: logger}
}

func (as *AdminService) DeleteUser(adminID uint, targetUserID uint) error {
	if adminID == targetUserID {
		return errors.New("cannot delete yourself")
	}
	
	// Tu można dodać sprawdzenie czy user istnieje, ale Delete w Gorm nie zwróci błędu jeśli ID nie ma,
	// więc dla uproszczenia po prostu wołamy repo.
	err := as.adminRepo.DeleteUser(targetUserID)
	if err != nil {
		as.logger.Error("Failed to delete user", "targetID", targetUserID, "error", err)
		return err
	}
	return nil
}

func (as *AdminService) DeleteTask(taskID uint) error {
	err := as.adminRepo.DeleteTask(taskID)
	if err != nil {
		as.logger.Error("Failed to delete task", "taskID", taskID, "error", err)
		return err
	}
	return nil
}

func (as *AdminService) GetSystemStats() (*repositories.SystemStats, error) {
	return as.adminRepo.GetSystemStats()
}

func (as *AdminService) GetAllUsers() ([]models.User, error) {
	return as.adminRepo.GetAllUsers()
}