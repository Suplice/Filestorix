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
	settingRepository := repositories.NewSettingRepository(db, logger)

	// Setup Services
	userService := services.NewUserService(userRepository, logger)
	authService := services.NewAuthService(logger, userService, authRepository)
	fileService := services.NewFileService(fileRepository, logger)
	settingService := services.NewSettingService(settingRepository, logger)

	// Setup Controllers
	authController := controllers.NewAuthController(logger, authService)
	fileController := controllers.NewFileController(logger, fileService)
	settingController := controllers.NewSettingsController(logger, settingService)

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
		fileRoutes.GET("/", middleware.ValidateJWT(), fileController.FetchAllUserFiles)
		fileRoutes.POST("/file", middleware.ValidateJWT(), fileController.UploadFiles)
		fileRoutes.POST("/catalog", middleware.ValidateJWT(), fileController.CreateCatalog)
		fileRoutes.PATCH("/rename", middleware.ValidateJWT(), fileController.RenameFile)
		fileRoutes.PATCH("/file/trash/:fileId", middleware.ValidateJWT(), fileController.TrashFile)
		fileRoutes.GET("/file/:fileName", middleware.ValidateJWT(), fileController.GetFile)
		fileRoutes.DELETE("/file/delete/:fileId", middleware.ValidateJWT(), fileController.DeleteFile)
		fileRoutes.PATCH("/catalog/trash/:catalogId", middleware.ValidateJWT(), fileController.TrashCatalog)
		fileRoutes.DELETE("/catalog/delete/:catalogId", middleware.ValidateJWT(), fileController.DeleteCatalog)
		fileRoutes.PATCH("/file/restore/:fileId/:parentId", middleware.ValidateJWT(), fileController.RestoreFile)
		fileRoutes.PATCH("/file/unfavorite/:fileId", middleware.ValidateJWT(), fileController.RemoveFavorite)
		fileRoutes.PATCH("/file/favorite/:fileId", middleware.ValidateJWT(), fileController.AddFavorite)
		fileRoutes.PATCH("/file/hide/:fileId", middleware.ValidateJWT(), fileController.HideFile)
		fileRoutes.PATCH("/file/reveal/:fileId", middleware.ValidateJWT(), fileController.RevealFile)
		fileRoutes.GET("/file/activitylog/:fileId", middleware.ValidateJWT(), fileController.GetActivityLogForFile)
	}

	settingRoutes := router.Group("/settings")
	{
		settingRoutes.GET("/", middleware.ValidateJWT(), settingController.GetAllUserSettings)
		settingRoutes.PUT("/update", middleware.ValidateJWT(), settingController.UpdateSettingsForUser)
		settingRoutes.PATCH("/togglehidden/:state", middleware.ValidateJWT(), settingController.ToggleHiddenFilesForUser)
	}
}