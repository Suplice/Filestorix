package models

import (
	"time"

	"gorm.io/gorm"
)

type Thrash struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"user_id"`
	FileID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"file_id"`

	ThrashedAt 		time.Time 		`json:"trashed_at"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			File 			`gorm:"foreignKey:FileID" json:"-"`

}