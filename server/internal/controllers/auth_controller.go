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

// Logout handles the user logout process by removing the authentication cookie
// and returning a JSON response indicating successful logout.
func (ac *AuthController) Logout(c *gin.Context) {
	removeAuthCookie(c)

	c.JSON(200, gin.H{
		"message": constants.SuccessUserLoggedOut,
	})
}

// CheckCredentials is a method of AuthController that verifies the user's credentials.
// It retrieves the userID from the context, fetches the user from the authService, 
// and generates a JWT token if the user is successfully fetched. 
// If any error occurs during these steps, it logs the error, removes the authentication cookie, 
// and responds with a 400 status code and an error message.
// On success, it sets the authentication cookie with the generated JWT token and responds with the user data.
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


// GoogleLogin handles the Google OAuth login process.
// It binds the incoming JSON request body to an OAuthRequestDTO, 
// and uses the authService to log in with the provided Google OAuth code.
// If successful, it generates a JWT token and sets it as an authentication cookie.
// It returns a JSON response with the user information and a success message.
// In case of errors, it logs the error and returns an appropriate JSON error response.
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

// GithubLogin handles the GitHub OAuth login process.
// It binds the incoming JSON request body to an OAuthRequestDTO, 
// and uses the authService to log in with the provided GitHub OAuth code.
// If successful, it generates a JWT token and sets it as an authentication cookie.
// It returns a JSON response with the user information and a success message.
// In case of errors, it logs the error and returns an appropriate JSON error response.
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



// removeAuthCookie removes the authentication cookie from the client's browser.
// It sets the "user_auth" cookie with an empty value and a max age of -1 to expire it immediately.
// The cookie is set for the "localhost" domain with the path "/".
// The cookie is marked as Secure and HttpOnly.
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

// setAuthCookie sets a secure HTTP-only cookie with the given JWT string.
// The cookie is named "user_auth" and is valid for one day. It is restricted
// to the localhost domain and the root path.
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