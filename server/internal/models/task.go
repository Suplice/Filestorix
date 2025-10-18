package models

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Title        string     `gorm:"size:255;not null" json:"title"`
	Description  string     `gorm:"size:512" json:"description"`
	Type         string     `gorm:"size:50;not null" json:"type"` 
	Language     string     `gorm:"size:50;not null" json:"language"` 
	Difficulty 	 string 	`gorm:"size:50;not null" json:"difficulty"`
	Points       int        `gorm:"default:0" json:"points"`
	XP           int        `gorm:"default:0" json:"xp"`
	IsActive     bool       `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoUpdateTime" json:"updated_at"`

	TaskQuestions []TaskQuestion    `gorm:"foreignKey:TaskID" json:"questions"`
	UserProgress  []UserTaskProgress `gorm:"foreignKey:TaskID" json:"user_progress"`
}
