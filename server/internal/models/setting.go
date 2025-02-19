package models

import "time"

type Settings struct {
	UserId       	uint   		`gorm:"not null;constraint:OnDelete:CASCADE;primaryKey;autoIncrement" json:"user_id"`
	SettingKey   	string 		`gorm:"not null;primaryKey" json:"setting_key"`
	SettingValue 	string 		`gorm:"not null" json:"setting_value"`

	CreatedAt 		time.Time 	`gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt 		time.Time 	`gorm:"autoUpdateTime" json:"updated_at"`

	User 			User 		`gorm:"foreignKey:UserId" json:"-"`
}