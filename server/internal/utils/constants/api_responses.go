package constants

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

// Api info messages
const (
	SuccessUserLoggedIn		= "USER_LOGGED_IN"
	SuccessUserLoggedOut	= "LOGGED_OUT"
	SuccessUserRegistered	= "USER_REGISTERED"
)

// Api error messages
const (
	ErrUserExists   		= "USER_ALREADY_EXISTS"
	ErrRecordNotFound 		= "INVALID_DATA"
	ErrDBUnknown    		= "DB_UNKNOWN_ERROR"
	ErrInvalidData 			= "INVALID_DATA"
	ErrUnexpected 			= "UNEXPECTED_ERROR"
	ErrUnauthorized			= "UNAUTHORIZED"
	ErrSessionExpired		= "SESSION_EXPIRED"
)

// ParseDBError parses the provided database error based on the given context.
func ParseDBError(err error, context string) error {
	if err == nil {
		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New(ErrRecordNotFound)
	}

	lowerErr := strings.ToLower(err.Error())
	if strings.Contains(lowerErr, "duplicate key") || strings.Contains(lowerErr, "unique constraint") {

		switch context {
		case "user":
			return errors.New(ErrUserExists)
		default:
			return errors.New(ErrDBUnknown) 
		}
	}

	return errors.New(ErrDBUnknown)
}
