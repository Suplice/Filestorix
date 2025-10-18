package controllers

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type SettingController struct {
	settingService *services.SettingService
	logger      *slog.Logger
}

func NewSettingsController(_logger *slog.Logger, _settingService *services.SettingService) *SettingController {
	return &SettingController{settingService: _settingService, logger: _logger}
}

// GetAllUserSettings retrieves all settings for a given user.
// Extracts the user ID from the request context and fetches associated settings.
// Returns a JSON response with the settings or an error if retrieval fails.
func (sc *SettingController) GetAllUserSettings(c *gin.Context) {
	userId, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%d", userId)

	settings, err := sc.settingService.GetAllUserSettings(stringUserId)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"settings": settings,
	})
}

// UpdateSettingsForUser updates the user's settings based on the provided JSON payload.
// Validates the request body, retrieves the user ID from the context, and updates the settings.
// Returns a success message if the update is successful, or an error otherwise.
func (sc *SettingController) UpdateSettingsForUser(c *gin.Context) {
	var settings []dto.UserSetting

	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	userId, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%d", userId)

	err := sc.settingService.UpdateSettingsForUser(stringUserId, settings)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessUpdateSettings,
	})

}
