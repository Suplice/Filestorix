package controllers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/gin-gonic/gin"
)

type AdminController struct {
	adminService *services.AdminService
	logger       *slog.Logger
}

func NewAdminController(logger *slog.Logger, adminService *services.AdminService) *AdminController {
	return &AdminController{adminService: adminService, logger: logger}
}

func (ac *AdminController) DeleteUser(c *gin.Context) {
	targetIDStr := c.Param("id")
	targetID, err := strconv.ParseUint(targetIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Pobieramy ID admina z kontekstu (ustawione przez auth middleware)
	adminID := uint(c.GetUint64("userID"))

	if err := ac.adminService.DeleteUser(adminID, uint(targetID)); err != nil {
		ac.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (ac *AdminController) DeleteTask(c *gin.Context) {
	taskIDStr := c.Param("id")
	taskID, err := strconv.ParseUint(taskIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	if err := ac.adminService.DeleteTask(uint(taskID)); err != nil {
		ac.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func (ac *AdminController) GetStats(c *gin.Context) {
	stats, err := ac.adminService.GetSystemStats()
	if err != nil {
		ac.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// Helper method
func (ac *AdminController) JSON(code int, obj interface{}) {
	// Wrapper jeśli potrzebujesz customowego logowania odpowiedzi
}

func (ac *AdminController) GetAllUsers(c *gin.Context) {
	users, err := ac.adminService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}