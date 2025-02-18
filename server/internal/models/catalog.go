package models

import (
	"gorm.io/gorm"

	"time"
)

type Catalog struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`
	Name 			string 			`gorm:"size:255;not null" json:"name"`

	ParentID 		uint 			`json:"parent_id"`


	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt 		time.Time		`gorm:"autoUpdateTime" json:"updated_at"`

	Catalog 		*Catalog 		`gorm:"foreignKey:ParentID" json:"catalog"`

}