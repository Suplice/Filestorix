package controllers

import (
	"log/slog"
	"time"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *services.AuthService
	logger *slog.Logger
}

// NewAuthController creates a new instance of AuthController with the provided logger and AuthService.
// Parameters:
//   - _logger: A pointer to an instance of slog.Logger used for logging within the controller.
//   - _as: A pointer to an instance of AuthService that handles authentication logic.
// Returns:
//   - A pointer to a newly created AuthController instance.
func NewAuthController(_logger *slog.Logger, _as *services.AuthService) *AuthController {
	return &AuthController{authService: _as, logger: _logger}
}

// Register handles the user registration process.
// It binds the incoming JSON request to a RegisterRequestDTO, validates it, and then
// calls the authService to register the user. If successful, it generates a JWT token,
// sets it as a cookie, and returns a success message along with user data and session expiration time.
func (ac *AuthController) Register(c *gin.Context) {
	var registerData dto.RegisterRequestDTO

	if err := c.ShouldBindBodyWithJSON(&registerData); err != nil {

		ac.logger.Error("AuthController - An error occured while parsing data", "error", err.Error())

		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	data, err := ac.authService.Register(registerData)

	if err != nil {
		ac.logger.Error("AuthController - Error occured while registering", "error", err.Error())
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}



	jwtString, err := utils.CreateJWT(data)

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ac.logger.Info("jwtString", "jwtStrings", jwtString)

	c.SetCookie(
		"user_auth",
		jwtString,
		utils.Day,
		"/",
		"localhost",
		true,
		true,
	)

	c.JSON(201, gin.H{
		"message": "User registered successfully",
		"user": data,
		"sessionExpiresAt": time.Now().Add(24 * time.Hour).Unix(),
	})

}

// LoginWithEmail handles user login using email and password.
// It parses the login request data from the request body, validates it,
// and attempts to authenticate the user using the AuthService.
// If successful, it generates a JWT token, sets it as a cookie, and
// returns a success response with user data and session expiration time.
// If any error occurs during the process, it returns an appropriate error response.
func (ac *AuthController) LoginWithEmail(c *gin.Context) {
	var loginData dto.LoginRequestDTO

	if err := c.ShouldBindBodyWithJSON(&loginData); err != nil {
		ac.logger.Error("AuthController - An error occured while parsing data", "error", err.Error())

		c.JSON(400, gin.H{
			"error": err.Error(),
		})

		return
	}

	data, err := ac.authService.LoginWithEmail(loginData)


	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}



	jwtString, err := utils.CreateJWT(data)

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ac.logger.Info("jwtString", "jwtStrings", jwtString)

	c.SetCookie(
		"user_auth",
		jwtString,
		utils.Day,
		"/",
		"localhost",
		true,
		true,
	)

	c.JSON(200, gin.H{
		"message": "User logged in successfully",
		"user": data,
		"sessionExpiresAt": time.Now().Add(24 * time.Hour).Unix(),
	})

}