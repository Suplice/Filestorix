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

// GET /search?q=...
func (sc *SearchController) Search(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	query := ctx.Query("q") // Get search query from URL parameter 'q'
	trimmedQuery := strings.TrimSpace(query)

	// Optional: Add minimum query length check
	// if len(trimmedQuery) < 2 {
	// 	 ctx.JSON(http.StatusOK, dtos.SearchResultsDTO{Users: []dtos.UserSearchResult{}, Courses: []dtos.CourseSearchResult{}})
	// 	 return
	// }

	limitPerType := 5 // Limit results per category (e.g., 5 users, 5 courses)

	results, err := sc.service.PerformSearch(trimmedQuery, uint(userID), limitPerType)
	if err != nil {
		// Service already logs the error
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to perform search"})
		return
	}

	ctx.JSON(http.StatusOK, results)
}