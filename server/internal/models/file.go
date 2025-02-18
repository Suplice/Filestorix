package models

import (
	"time"

	"gorm.io/gorm"
)

type File struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	UserID 			uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"user_id"`
	Name 			string 			`gorm:"size:255;not null" json:"name"`
	Type 			string 			`gorm:"size:255;not null" json:"type"`
	Size 			int64 			`gorm:"not null" json:"size"`
	Path 			string 			`gorm:"size:255;not null" json:"path"`
	ModifiedAt 		time.Time 		`gorm:"autoUpdateTime" json:"modified_at"`
	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"created_at"`
	IsTrashed 		bool 			`gorm:"not null" json:"is_trashed"`
	TrashedAt 		time.Time 		`json:"trashed_at"`
	CatalogID 		uint 			`gorm:"not null;constraint:OnDelete:CASCADE" json:"catalog_id"`

	User 			User 			`gorm:"foreignKey:UserID" json:"-"`
	Catalog 		Catalog 		`gorm:"foreignKey:CatalogID" json:"-"`

}