package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

// GetJWTSecret retrieves the JWT secret from the environment variables.
// If the application is not running inside a Docker container, it attempts to load
// environment variables from a .env file located two directories up from the current file.
// If the JWT_SECRET environment variable is not set, it returns an error.
//
// Returns:
//   - []byte: The JWT secret as a byte slice.
//   - error: An error if the JWT_SECRET environment variable is not set or if there is an issue loading the .env file.
func GetJWTSecret() ([]byte, error) {
	if os.Getenv("IN_DOCKER") != "true" {
		if err := godotenv.Load("../../.env"); err != nil {
			log.Println("No .env file found")
		} 
	} 

	jwtSecret := os.Getenv("JWT_SECRET")

	if jwtSecret == "" {
		return []byte(""), errors.New("an error occured please try again later")
	}

	return []byte(jwtSecret), nil
}

// CreateJWT generates a new JSON Web Token (JWT) for the given user.
// The token is signed using the HS256 signing method and includes the user's ID,
// an expiration time of 24 hours from the time of creation, and the issued at time.
//
// Parameters:
//   - user: A pointer to the User model containing the user's information.
//
// Returns:
//   - A string representing the signed JWT if successful.
//   - An error if there is an issue generating the JWT or retrieving the secret.
func CreateJWT(user *models.User) (string, error) {

	jwtSecret, err := GetJWTSecret()

	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		return "", err
	}

	return tokenString, nil

}

