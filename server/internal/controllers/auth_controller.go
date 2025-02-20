package controllers

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *services.AuthService
	logger *slog.Logger
}

func NewAuthController(_logger *slog.Logger, _as *services.AuthService) *AuthController {
	return &AuthController{authService: _as, logger: _logger}
}

func (ac *AuthController) Register(c *gin.Context) {
	var registerData dto.RegisterRequestDTO

	if err := c.ShouldBindBodyWithJSON(&registerData); err != nil {

		ac.logger.Error("AuthController - An error occured while parsing data", "error", err)

		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	data, err := ac.authService.Register(registerData)

	if err != nil {
		ac.logger.Error("AuthController - Error occured while registering", "error", err)
		c.JSON(400, gin.H{
			"message": err, // <- handle better this error, give info whether email already exist, or database is unavailable
			"user": data,
		})
	}

	c.JSON(201, gin.H{
		"message": "User registered successfully",
		"user": data,
	})
}

func (ac *AuthController) LoginWithEmail(c *gin.Context) {
	var loginData dto.LoginRequestDTO

	if err := c.ShouldBindBodyWithJSON(&loginData); err != nil {
		ac.logger.Error("AuthController - An error occured while parsing data", "error", err)

		c.JSON(400, gin.H{
			"error": err.Error(),
		})

		return
	}

	// data, err := ac.authService.LoginWithEmail(loginData)


	// To Be implemented

	c.JSON(501, gin.H{
		"error": "Route is not correctly implemented",
	})
	return

}