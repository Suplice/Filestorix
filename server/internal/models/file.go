package models

import (
	"time"
)

type UserFile struct {
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"userId"`
	Name 			string 			`gorm:"size:255;not null" json:"name"`
	Extension		string			`gorm:"size:10" json:"extension"`
	Type 			string 			`gorm:"size:255;not null" json:"type"`
	Size 			int64 			`gorm:"not null" json:"size"`
	Path 			string 			`gorm:"size:255;not null" json:"path"`
	ModifiedAt 		time.Time 		`gorm:"autoUpdateTime" json:"modifiedAt"`
	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"createdAt"`
	IsTrashed 		bool 			`gorm:"not null" json:"isTrashed"`
	ParentID 		*uint 			`gorm:"constraint:OnDelete:SET NULL;" json:"parentId"`
	IsFavorite		bool			`gorm:"not null;default:false" json:"isFavorite"`
	IsHidden		bool			`gorm:"not null;default:false" json:"isHidden"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	Children    	[]UserFile 		`gorm:"foreignKey:ParentID" json:"-"` 

}