package models

import (
	"time"

	"gorm.io/gorm"
)

type FavoriteFile struct {
	gorm.Model
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"user_id"`
	FileID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"file_id"`

	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"created_at"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			File 			`gorm:"foreignKey:FileID" json:"-"`

}