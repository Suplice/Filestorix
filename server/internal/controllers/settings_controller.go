package controllers

import (
	"fmt"
	"log/slog"
	"net/http"

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