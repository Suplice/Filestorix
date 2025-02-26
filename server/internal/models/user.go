package models

import (
	"time"

	"gorm.io/gorm"
)



type User struct {
	gorm.Model
	Username 		string 			`gorm:"size:255;not null" json:"username"`
	Email 			string 			`gorm:"size:255;uniqueIndex;not null" json:"email"`
	Provider 		string 			`gorm:"size:255;not null" json:"provider"`
	AvatarURL 		string 			`gorm:"size:255;not null" json:"avatarURL"`
	Role 			string 			`gorm:"size:255;not null" json:"role"`
	PasswordHash 	string 			`gorm:"size:255" json:"passwordHash"`
	LastLoginAt 	time.Time 		`gorm:"autoCreateTime;autoUpdateTime" json:"lastLoginAt"`
	GoogleID		string			`gorm:"size:255" json:"googleId"`
}