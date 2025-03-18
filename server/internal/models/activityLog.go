package models

import (
	"time"

	"gorm.io/gorm"
)

type ActivityLog struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"userId"`
	FileID 			*uint 			`gorm:";constraint:OnDelete:CASCADE" json:"fileId"`

	Action 			string 			`gorm:"size:255;not null" json:"action"`
	Details 		string 			`gorm:"size:255" json:"details"`
	PerformedAt 	time.Time 		`gorm:"autoCreateTime" json:"performedAt"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			UserFile 		`gorm:"foreignKey:FileID" json:"-"`
}