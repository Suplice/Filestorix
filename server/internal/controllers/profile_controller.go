package controllers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type ProfileController struct {
	service *services.ProfileService
	logger  *slog.Logger
}

func NewProfileController(service *services.ProfileService, logger *slog.Logger) *ProfileController {
	return &ProfileController{service: service, logger: logger}
}

func (pc *ProfileController) GetProfile(ctx *gin.Context) {
	currentUserID := ctx.GetUint64("userID")
	if currentUserID == 0 { 		
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	profileIDStr := ctx.Param("id")
	profileID, err := strconv.ParseUint(profileIDStr, 10, 64)
	if err != nil {		
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filter. Must be 'all' or 'friends'"})
		return }

	profileData, err := pc.service.GetProfile(uint(profileID), uint(currentUserID))
	if err != nil { 		
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filter. Must be 'all' or 'friends'"})
		return }
	
	ctx.JSON(http.StatusOK, profileData)
}