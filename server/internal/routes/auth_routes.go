package routes

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/controllers"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupAuthRoutes(router *gin.Engine, db *gorm.DB, logger *slog.Logger) {
	authController := controllers.NewAuthController(db, logger)

	authRoutes := router.Group("/auth") 
	{
		authRoutes.POST("/register", authController.Register)
	}
}