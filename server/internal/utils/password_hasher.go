package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

func ComparePasswords(password string, hashedPassword []byte) (error) {
	return bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
}