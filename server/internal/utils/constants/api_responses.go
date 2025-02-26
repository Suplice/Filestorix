package constants

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

// Api info messages
const (
	// Success message, when user successfully logged in
	SuccessUserLoggedIn		= "USER_LOGGED_IN"
	// Success message, when user successfully logged out
	SuccessUserLoggedOut	= "LOGGED_OUT"
	// Success message, when user successfully registered
	SuccessUserRegistered	= "USER_REGISTERED"
)

// Api error messages
const (
	// Error message, when user does not exist in database
	ErrUserExists   		= "USER_ALREADY_EXISTS" 
	// Error message, when record is not found in database
	ErrRecordNotFound 		= "INVALID_DATA"
	// Error message, when unexpected error occured in database
	ErrDBUnknown    		= "DB_UNKNOWN_ERROR"
	// Error message, when provided data is invalid 
	ErrInvalidData 			= "INVALID_DATA"
	// Error message, when an unexpected error occurs
	ErrUnexpected 			= "UNEXPECTED_ERROR"
	// Error message, when user is not authorized
	ErrUnauthorized			= "UNAUTHORIZED"
	// Error message, when user session has expired
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
