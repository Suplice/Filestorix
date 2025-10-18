package models

import (
	"time"

	"gorm.io/gorm"
)

type UserTaskProgress struct {
    gorm.Model
    UserID uint `gorm:"not null;index" json:"user_id"`
    TaskID uint `gorm:"not null;index" json:"task_id"`

    Progress    float64    `gorm:"default:0" json:"progress"`
    Attempts    int        `gorm:"default:0" json:"attempts"`
    Mistakes    int        `gorm:"default:0" json:"mistakes"`
    IsCompleted bool       `gorm:"default:false" json:"is_completed"`
    CompletedAt *time.Time `json:"completed_at"`

    Answers []UserAnswer `gorm:"foreignKey:UserTaskProgressID" json:"answers"`

    Task Task `gorm:"foreignKey:TaskID" json:"task"`
}