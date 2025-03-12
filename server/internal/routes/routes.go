package routes

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/controllers"
	"github.com/Suplice/Filestorix/internal/middleware"
	"github.com/Suplice/Filestorix/internal/repositories"
	"github.com/Suplice/Filestorix/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes sets up the routes for the given router.
// It initializes the necessary repositories, services, and controllers
// for handling authentication-related requests.
//
// Parameters:
//   - router: The Gin engine instance to which the authentication routes will be added.
//   - db: The Gorm database instance used for database operations.
//   - logger: The slog.Logger instance used for logging.
func SetupRoutes(router *gin.Engine, db *gorm.DB, logger *slog.Logger) {
	// Setup Repositories
	authRepository := repositories.NewAuthRepository(db, logger)
	userRepository := repositories.NewUserRepository(db, logger)
	fileRepository := repositories.NewFileRepository(db, logger)

	// Setup Services
	userService := services.NewUserService(userRepository, logger)
	authService := services.NewAuthService(logger, userService, authRepository)
	fileService := services.NewFileService(fileRepository, logger)

	// Setup Controllers
	authController := controllers.NewAuthController(logger, authService)
	fileController := controllers.NewFileController(logger, fileService)

	authRoutes := router.Group("/auth") 
	{
		authRoutes.POST("/register", authController.Register)
		authRoutes.POST("/login", authController.LoginWithEmail)
		authRoutes.POST("/logout", middleware.ValidateJWT(), authController.Logout)
		authRoutes.GET("/user", middleware.ValidateJWT(), authController.CheckCredentials)
		authRoutes.POST("/google", authController.GoogleLogin)
		authRoutes.POST("/github", authController.GithubLogin)
	}

	fileRoutes := router.Group("/files") 
	{
		fileRoutes.GET("/fetchall", middleware.ValidateJWT(), fileController.FetchAllUserFiles)
		fileRoutes.POST("/addfile", middleware.ValidateJWT(), fileController.UploadFiles)
		fileRoutes.POST("/addcatalog", middleware.ValidateJWT(), fileController.CreateCatalog)
		fileRoutes.PATCH("/rename", middleware.ValidateJWT(), fileController.RenameFile)
		fileRoutes.PATCH("/trash/:fileId", middleware.ValidateJWT(), fileController.TrashFile)
		fileRoutes.GET("/getfile/:fileName", middleware.ValidateJWT(), fileController.GetFile)
		fileRoutes.DELETE("/delete/:fileId", middleware.ValidateJWT(), fileController.DeleteFile)
		fileRoutes.PATCH("/trashcatalog/:catalogId", middleware.ValidateJWT(), fileController.TrashCatalog)
		fileRoutes.DELETE("/deletecatalog/:catalogId", middleware.ValidateJWT(), fileController.DeleteCatalog)
		fileRoutes.PATCH("/restore/:fileId/:parentId", middleware.ValidateJWT(), fileController.RestoreFile)
	}
}