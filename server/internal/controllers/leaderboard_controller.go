package controllers

import (
	"log/slog"
	"net/http"
	"strings" 

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type LeaderboardController struct {
	service *services.LeaderboardService
	logger  *slog.Logger
}

func NewLeaderboardController(service *services.LeaderboardService, logger *slog.Logger) *LeaderboardController {
	return &LeaderboardController{service: service, logger: logger}
}

func (lc *LeaderboardController) GetLeaderboard(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	criteria := strings.ToLower(ctx.Param("criteria"))
	if criteria != "level" && criteria != "points" && criteria != "completed" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid criteria. Must be 'level', 'points', or 'completed'"})
		return
	}

	filter := strings.ToLower(ctx.DefaultQuery("filter", "all"))
	if filter != "all" && filter != "friends" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filter. Must be 'all' or 'friends'"})
		return
	}

	limit := 100 

	leaderboardData, err := lc.service.GetLeaderboard(criteria, filter, uint(userID), limit)
	if err != nil {
		lc.logger.Error("Failed to get leaderboard data", "err", err, "criteria", criteria, "filter", filter, "userID", userID)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve leaderboard data"})
		return
	}

	ctx.JSON(http.StatusOK, leaderboardData)
}