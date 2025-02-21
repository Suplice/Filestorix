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

