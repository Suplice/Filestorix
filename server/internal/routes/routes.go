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

func SetupRoutes(router *gin.Engine, db *gorm.DB, logger *slog.Logger) {
	authRepository := repositories.NewAuthRepository(db, logger)
	userRepository := repositories.NewUserRepository(db, logger)
	settingRepository := repositories.NewSettingRepository(db, logger)
	taskRepository := repositories.NewTaskRepository(db, logger)
	friendshipRepository := repositories.NewFriendshipRepository(db, logger)
	leaderboardRepository := repositories.NewLeaderboardRepository(db, logger)
	profileRepository := repositories.NewProfileRepository(db, logger)
	searchRepository := repositories.NewSearchRepository(db, logger)
	adminRepository := repositories.NewAdminRepository(db, logger);

	userService := services.NewUserService(userRepository, logger)
	authService := services.NewAuthService(logger, userService, authRepository)
	settingService := services.NewSettingService(settingRepository, logger)
	taskService := services.NewTaskService(taskRepository, logger)
	friendshipService := services.NewFriendshipService(friendshipRepository, logger)
	leaderboardService := services.NewLeaderboardService(leaderboardRepository, logger)
	profileService := services.NewProfileService(logger, profileRepository)
	searchService := services.NewSearchService(searchRepository, logger)
	adminService := services.NewAdminService(adminRepository, logger)
	recService := services.NewRecommendationService(taskRepository, userRepository, logger)


	authController := controllers.NewAuthController(logger, authService)
	settingController := controllers.NewSettingsController(logger, settingService)
	taskController := controllers.NewTaskController(logger, taskService, recService)
	friendshipController := controllers.NewFriendshipController(friendshipService, logger)
	leaderboardController := controllers.NewLeaderboardController(leaderboardService, logger)
	profileController := controllers.NewProfileController(profileService, logger)
	searchController := controllers.NewSearchController(searchService, logger)
	adminController := controllers.NewAdminController(logger, adminService)

	authRoutes := router.Group("/auth") 
	{
		authRoutes.POST("/register", authController.Register)
		authRoutes.POST("/login", authController.LoginWithEmail)
		authRoutes.POST("/logout", middleware.ValidateJWT(), authController.Logout)
		authRoutes.GET("/user", middleware.ValidateJWT(), authController.CheckCredentials)
		authRoutes.POST("/google", authController.GoogleLogin)
		authRoutes.POST("/github", authController.GithubLogin)
	}


	settingRoutes := router.Group("/settings")
	{
		settingRoutes.GET("/", middleware.ValidateJWT(), settingController.GetAllUserSettings)
		settingRoutes.PUT("/update", middleware.ValidateJWT(), settingController.UpdateSettingsForUser)
	}

	userRoutes := router.Group("users")
	{
		userRoutes.GET("/:id/tasks", middleware.ValidateJWT(), taskController.GetAllTasksForUser)
		userRoutes.GET("/search",middleware.ValidateJWT(), friendshipController.SearchUsers)
	}

	taskRoutes := router.Group("tasks")
	{
		taskRoutes.GET("/:taskId/tasks/:userId",middleware.ValidateJWT(), taskController.GetTaskForUser)
		taskRoutes.POST("/submit-answer",middleware.ValidateJWT(), taskController.SubmitAnswer)
		taskRoutes.GET("/recommended", middleware.ValidateJWT(), taskController.GetRecommendedTasks)
	}

	friendshipRoutes := router.Group("friends")
	{
		friendshipRoutes.POST("/request",middleware.ValidateJWT(), friendshipController.SendFriendRequest)
		friendshipRoutes.GET("/accepted",middleware.ValidateJWT(), friendshipController.GetAcceptedFriends)
		friendshipRoutes.GET("/sent",middleware.ValidateJWT(), friendshipController.GetSentRequests)
		friendshipRoutes.GET("/incoming",middleware.ValidateJWT(), friendshipController.GetIncomingRequests)
		friendshipRoutes.DELETE("/request/:friendshipId",middleware.ValidateJWT(), friendshipController.CancelFriendRequest )
		friendshipRoutes.PATCH("/request/:friendshipId",middleware.ValidateJWT(), friendshipController.RespondToFriendRequest)
		friendshipRoutes.DELETE("/:friendshipId",middleware.ValidateJWT(), friendshipController.RemoveFriend)
	}

	leaderboardRoutes := router.Group("leaderboard")
	{
		leaderboardRoutes.GET(":criteria",middleware.ValidateJWT(), leaderboardController.GetLeaderboard)
	}

	profileRoutes := router.Group("/profile")
	{
		profileRoutes.GET("/:id",middleware.ValidateJWT(), profileController.GetProfile )
	}

	searchRoutes := router.Group("search")
	{
		searchRoutes.GET("", middleware.ValidateJWT(), searchController.Search )
	}

	adminRoutes := router.Group("/admin")
	adminRoutes.Use(middleware.ValidateJWT(), middleware.AdminOnly(userService)) 
	{
		adminRoutes.GET("/stats", adminController.GetStats)       
		adminRoutes.DELETE("/users/:id", adminController.DeleteUser) 
		adminRoutes.DELETE("/tasks/:id", adminController.DeleteTask) 
		adminRoutes.GET("/users", adminController.GetAllUsers)
	}
}