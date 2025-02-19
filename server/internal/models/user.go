package models

import (
	"time"

	"gorm.io/gorm"
)



type User struct {
	gorm.Model
	ID 				uint 			`gorm:"primaryKey;autoIncrement" json:"id"`	
	Username 		string 			`gorm:"size:255;not null" json:"username"`
	Email 			string 			`gorm:"size:255;uniqueIndex;not null" json:"email"`
	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt 		time.Time		`gorm:"autoUpdateTime" json:"updatedAt"`
	Provider 		string 			`gorm:"size:255;not null" json:"provider"`
	AvatarURL 		string 			`gorm:"size:255;not null" json:"avatarURL"`
	Role 			string 			`gorm:"size:255;not null" json:"role"`
	PasswordHash 	string 			`gorm:"size:255" json:"passwordHash"`
	LastLoginAt 	time.Time 		`json:"lastLoginAt"`

	
}