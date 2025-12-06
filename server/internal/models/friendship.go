package models

import (
	"time"
)


type Friendship struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     uint      `gorm:"not null;index" json:"user_id"`
	FriendID   uint      `gorm:"not null;index" json:"friend_id"`
	Status     string    `gorm:"size:50;not null" json:"status"` 
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`

	User   User `gorm:"foreignKey:UserID" json:"-"`
	Friend User `gorm:"foreignKey:FriendID" json:"friend"`
}