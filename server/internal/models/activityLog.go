package models

import (
	"time"

	"gorm.io/gorm"
)

type ActivityLog struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"user_id"`
	FileID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"file_id"`

	Action 			string 			`gorm:"size:255;not null" json:"action"`
	PerformedAt 	time.Time 		`gorm:"autoCreateTime" json:"performed_at"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			File 			`gorm:"foreignKey:FileID" json:"-"`

}