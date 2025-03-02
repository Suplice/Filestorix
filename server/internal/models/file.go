package models

import (
	"time"
)

type UserFile struct {
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"userId"`
	Name 			string 			`gorm:"size:255;not null" json:"name"`
	Type 			string 			`gorm:"size:255;not null" json:"type"`
	Size 			int64 			`gorm:"not null" json:"size"`
	Path 			string 			`gorm:"size:255;not null" json:"path"`
	ModifiedAt 		time.Time 		`gorm:"autoUpdateTime" json:"modifiedAt"`
	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"createdAt"`
	IsTrashed 		bool 			`gorm:"not null" json:"isTrashed"`
	ParentID 		uint 			`json:"parentId"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	File 			*UserFile 		`gorm:"foreignKey:ParentID" json:"-"`

}