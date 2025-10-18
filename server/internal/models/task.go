package models

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	UserID       uint       `gorm:"not null;index" json:"user_id"`
	Title        string     `gorm:"size:255;not null" json:"title"`
	Description  string     `gorm:"size:512" json:"description"`
	Type         string     `gorm:"size:50;not null" json:"type"` 
	Points       int        `gorm:"default:0" json:"points"`
	XP           int        `gorm:"default:0" json:"xp"`
	IsCompleted  bool       `gorm:"default:false" json:"is_completed"`
	CompletedAt  *time.Time `json:"completed_at"`

	User         User       `gorm:"foreignKey:UserID" json:"-"`
}