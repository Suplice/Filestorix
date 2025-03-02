package models

import (
	"time"
)

type FavoriteFile struct {
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE;primaryKey" json:"user_id"`
	FileID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE;primaryKey" json:"file_id"`

	CreatedAt 		time.Time		`gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt 		time.Time		`gorm:"autoUpdateTime" json:"updated_at"`


	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			UserFile 		`gorm:"foreignKey:FileID" json:"-"`

}