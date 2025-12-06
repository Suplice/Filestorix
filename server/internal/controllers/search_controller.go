package controllers

import (
	"log/slog"
	"net/http"
	"strings"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type SearchController struct {
	service *services.SearchService
	logger  *slog.Logger
}

func NewSearchController(service *services.SearchService, logger *slog.Logger) *SearchController {
	return &SearchController{service: service, logger: logger}
}

func (sc *SearchController) Search(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	query := ctx.Query("q") 
	trimmedQuery := strings.TrimSpace(query)


	limitPerType := 5 

	results, err := sc.service.PerformSearch(trimmedQuery, uint(userID), limitPerType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to perform search"})
		return
	}

	ctx.JSON(http.StatusOK, results)
}