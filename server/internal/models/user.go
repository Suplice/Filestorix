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
	CreatedAt 		time.Time 		`gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt 		time.Time		`gorm:"autoUpdateTime" json:"updated_at"`
	Provider 		string 			`gorm:"size:255;not null" json:"provider"`
	AvatarURL 		string 			`gorm:"size:255;not null" json:"avatar_url"`
	Role 			string 			`gorm:"size:255;not null" json:"role"`
	PasswordHash 	string 			`gorm:"size:255" json:"password_hash"`
	LastLoginAt 	time.Time 		`json:"last_login_at"`

	
}