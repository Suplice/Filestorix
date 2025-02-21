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
