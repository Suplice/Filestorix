package controllers

import (
	"log/slog"
	"net/http"

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

func NewAuthController(_logger *slog.Logger, _as *services.AuthService) *AuthController {
	return &AuthController{authService: _as, logger: _logger}
}

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
	
	ac.logger.Error("i am in CheckCredentials")

	userIdRaw, exists := c.Get("userID")
	if !exists {
		ac.logger.Error("userID not found in context")
		removeAuthCookie(c)
		c.JSON(400, gin.H{"message": constants.ErrUnexpected})
		return
	}

	userIdUint64, ok := userIdRaw.(uint64)
	if !ok {
		ac.logger.Error("error converting userID to uint64")
		removeAuthCookie(c)
		c.JSON(400, gin.H{"message": constants.ErrUnexpected})
		return
	}

	userIdUint := uint(userIdUint64)

	user, fetchError := ac.authService.FetchUser(userIdUint)

	if fetchError != nil {
		ac.logger.Error("Error fetching user", "error", fetchError.Error())
		removeAuthCookie(c)
		c.JSON(400, gin.H{
			"message": constants.ErrUnexpected,
		})
		return
	}

	jwtString, jwtError := utils.CreateJWT(user)

	if jwtError != nil {
		ac.logger.Error("Error on jwt", "error", jwtError.Error())
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


func (ac *AuthController) GoogleLogin(c *gin.Context){
	var googleData *dto.OAuthRequestDTO

	if err := c.ShouldBindBodyWithJSON(&googleData); err != nil {
		ac.logger.Error("AuthController - An error occured while parsing body")

		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrFaildedGoogle,
		})
		return
	}

	user, err := ac.authService.LoginWithGoogle(googleData.Code)

	if err != nil {
		ac.logger.Error("AuthController - An error occured while handling google login")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}


	jwtString, jwtError := utils.CreateJWT(user)

	if jwtError != nil {
		ac.logger.Error("Error on jwt", "error", jwtError.Error())
		c.JSON(400, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	setAuthCookie(c, jwtString)
	

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"message": constants.SuccessUserGoogleLogin,
	})
}

func (ac *AuthController) GithubLogin(c *gin.Context) {

	var githubData *dto.OAuthRequestDTO

	if err := c.ShouldBindBodyWithJSON(&githubData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrFailedGithub,
		})
	}

	user, err := ac.authService.LoginWithGithub(githubData.Code)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	jwtString, jwtError := utils.CreateJWT(user)

	if jwtError != nil {
		ac.logger.Error("Error on jwt", "error", jwtError.Error())
		c.JSON(400, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	setAuthCookie(c, jwtString)
	

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"message": constants.SuccessUserGithubLogin,
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