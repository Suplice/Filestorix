package utils

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

var (
	ErrRecordAlreadyExists = errors.New("this e-mail is already in use")
	ErrRecordNotFound      = errors.New("provider data is incorrect")
	ErrUnknown             = errors.New("an error occurred, please try again later")
)

// ParseDBError parses the provided database error and returns a more specific error type.
// It returns nil if the provided error is nil.
// If the error is a gorm.ErrRecordNotFound, it returns ErrRecordNotFound.
// If the error message contains "duplicate key" or "unique constraint", it returns ErrRecordAlreadyExists.
// For any other error, it returns ErrUnknown.
//
// Parameters:
//   err (error): The error to parse.
//
// Returns:
//   error: A more specific error type based on the provided error.
func ParseDBError(err error) error {
	if err == nil {
		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrRecordNotFound
	}

	lowerErr := strings.ToLower(err.Error())
	if strings.Contains(lowerErr, "duplicate key") || strings.Contains(lowerErr, "unique constraint") {
		return ErrRecordAlreadyExists
	}

	return ErrUnknown
}
