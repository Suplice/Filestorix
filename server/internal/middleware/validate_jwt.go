package middleware

import (
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/utils"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// ValidateJWT is a middleware function for the Gin framework that validates
// the JWT token from the "user_auth" cookie. If the token is valid, it extracts
// the user ID from the token claims and sets it in the context. If the token is
// invalid or missing, it aborts the request with an appropriate HTTP status code
// and error message.
func ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("user_auth")

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrSessionExpired})
			return
		}

		tokenString := cookie

		jwtSecret, err := utils.GetJWTSecret()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": constants.ErrUnauthorized})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}

		res, err := claims.GetSubject()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
			return
		}

		userID, err := strconv.ParseUint(res, 10, 0)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		}
		
		c.Set("stringUserID", res)

		c.Set("userID", userID)

		c.Next()
	}
}
