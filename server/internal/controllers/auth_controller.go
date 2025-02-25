package controllers

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils"
	"github.com/Suplice/Filestorix/internal/utils/constants"
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

		c.JSON(400, gin.H{"error": constants.ErrInvalidData})
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
			"error": constants.ErrUnexpected,
		})
		return
	}

	ac.logger.Info("jwtString", "jwtStrings", jwtString)

	setAuthCookie(c, jwtString)

	c.JSON(201, gin.H{
		"message": constants.SuccessUserRegistered,
		"user": data,
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
			"error": constants.ErrInvalidData,
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
			"error": constants.ErrUnexpected,
		})
		return
	}

	ac.logger.Info("jwtString", "jwtStrings", jwtString)

	setAuthCookie(c, jwtString)

	c.JSON(200, gin.H{
		"message": constants.SuccessUserLoggedIn,
		"user": data,
	})

}

func (ac *AuthController) Logout(c *gin.Context) {
	removeAuthCookie(c)

	c.JSON(200, gin.H{
		"message": constants.SuccessUserLoggedOut,
	})
}

func (ac *AuthController) CheckCredentials(c *gin.Context){
	

	userId, err := c.Get("UserID")

	if err {
		removeAuthCookie(c)
		c.JSON(400, gin.H{
			"message": constants.ErrUnexpected,
		})
	}

	userIdUint, ok := userId.(uint)
	if !ok {
		ac.logger.Debug("error converting user to Uint")
		removeAuthCookie(c)
		c.JSON(400, gin.H{
			"message": constants.ErrUnexpected,
		})
		return
	}

	user, fetchError := ac.authService.FetchUser(userIdUint)

	if fetchError != nil {
		ac.logger.Debug("Error fetching user", "error", fetchError.Error())
		removeAuthCookie(c)
		c.JSON(400, gin.H{
			"message": constants.ErrUnexpected,
		})
		return
	}

	jwtString, jwtError := utils.CreateJWT(user)

	if jwtError != nil {
		ac.logger.Debug("Error on jwt", "error", jwtError.Error())
		c.JSON(400, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	ac.logger.Info("jwtString", "jwtStrings", jwtString)

	setAuthCookie(c, jwtString)
	
	c.JSON(200, gin.H{
		"user": user,
	})
}



func removeAuthCookie(c *gin.Context) {
	c.SetCookie(
		"user_auth",
		"",
		-1,
		"/",
		"localhost",
		true,
		true,
	)
}

func setAuthCookie(c *gin.Context, jwtString string) {
	c.SetCookie(
		"user_auth",
		jwtString,
		constants.Day,
		"/",
		"localhost",
		true,
		true,
	)
}