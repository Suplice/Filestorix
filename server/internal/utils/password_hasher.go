package utils

import (
	"errors"

	"github.com/Suplice/Filestorix/internal/utils/constants"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)

	if err != nil {
		return string(bytes), errors.New(constants.ErrUnexpected)
	}

	return string(bytes), nil
}

func ComparePasswords(password string, hashedPassword []byte) error {
	return bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
}