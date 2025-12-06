package models

import (
	"time"

	"gorm.io/gorm"
)


type CodeSubmission struct {
	gorm.Model
	UserID      uint      `gorm:"not null;index" json:"user_id"`
	TaskID      uint      `gorm:"not null;index" json:"task_id"`
	Code        string    `gorm:"type:text" json:"code"`
	Language    string    `gorm:"size:50" json:"language"`
	Status      string    `gorm:"size:50" json:"status"` 
	Output      string    `gorm:"type:text" json:"output"`
	ErrorMsg    string    `gorm:"type:text" json:"error_msg"`
	SubmittedAt time.Time `gorm:"autoCreateTime" json:"submitted_at"`

	User        User      `gorm:"foreignKey:UserID" json:"-"`
	Task        Task      `gorm:"foreignKey:TaskID" json:"task"`
}