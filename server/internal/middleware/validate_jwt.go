package middleware

import (
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/utils"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

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
