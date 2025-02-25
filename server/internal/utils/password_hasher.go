package utils

import (
	"errors"

	"github.com/Suplice/Filestorix/internal/utils/constants"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword takes a plain text password as input and returns the hashed password
// using bcrypt with a default cost of 10. If an error occurs during hashing, it is returned.
//
// Parameters:
//   - password: The plain text password to be hashed.
//
// Returns:
//   - string: The hashed password.
//   - error: An error that occurred during hashing, or nil if no error occurred.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)

	if err != nil {
		return string(bytes), errors.New(constants.ErrUnexpected)
	}

	return string(bytes), nil
}

// ComparePasswords compares a plain text password with a hashed password.
// It returns nil if the passwords match, or an error if they do not.
//
// Parameters:
//   - password: The plain text password to compare.
//   - hashedPassword: The hashed password to compare against.
//
// Returns:
//   - error: nil if the passwords match, or an error if they do not.
func ComparePasswords(password string, hashedPassword []byte) error {
	return bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
}