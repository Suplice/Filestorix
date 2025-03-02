package models

import (
	"time"
)

type Thrash struct {
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"user_id"`
	FileID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"file_id"`

	ThrashedAt 		time.Time 		`json:"trashed_at"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			UserFile 		`gorm:"foreignKey:FileID" json:"-"`

}