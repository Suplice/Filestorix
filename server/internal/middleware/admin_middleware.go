package middleware

import (
	"net/http"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/gin-gonic/gin"
)

// AdminOnly sprawdza czy zalogowany użytkownik ma rolę 'admin'
// Wymaga wstrzyknięcia UserService, aby pobrać rolę użytkownika z bazy
func AdminOnly(userService *services.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDRaw, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		userID, ok := userIDRaw.(uint64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
			c.Abort()
			return
		}

		// Pobieramy usera, żeby sprawdzić rolę
		user, err := userService.GetUserById(uint(userID))
		if err != nil || user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		if user.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}