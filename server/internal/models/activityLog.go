package models

import (
	"time"

	"gorm.io/gorm"
)



type ActivityLog struct {
	gorm.Model
	UserID     uint      `gorm:"not null;index" json:"user_id"`
	ActionType string    `gorm:"size:255;not null" json:"action_type"` 
	Description string   `gorm:"size:512" json:"description"`
	PointsEarned int     `json:"points_earned"`
	XPEarned     int     `json:"xp_earned"`
	Timestamp    time.Time `gorm:"autoCreateTime" json:"timestamp"`

	User User `gorm:"foreignKey:UserID" json:"-"`
}