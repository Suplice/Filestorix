package models

import (
	"time"

	"gorm.io/gorm"
)



type Badge struct {
	gorm.Model
	Name         string `gorm:"size:255;not null" json:"name"`
	Description  string `gorm:"size:512" json:"description"`
	IconURL      string `gorm:"size:255" json:"icon_url"`
	Requirement  string `gorm:"size:255" json:"requirement"` 
}

type UserBadge struct {
	UserID  uint `gorm:"not null;index" json:"user_id"`
	BadgeID uint `gorm:"not null;index" json:"badge_id"`
	AchievedAt time.Time `gorm:"autoCreateTime" json:"achieved_at"`

	User  User  `gorm:"foreignKey:UserID" json:"-"`
	Badge Badge `gorm:"foreignKey:BadgeID" json:"badge"`
}