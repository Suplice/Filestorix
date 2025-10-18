package models

import (
	"time"

	"gorm.io/gorm"
)

type UserTaskProgress struct {
    gorm.Model
    UserID      uint       `gorm:"not null;index" json:"user_id"`
    TaskID      uint       `gorm:"not null;index" json:"task_id"`

    // Ogólny procent ukończenia zadania
    Progress    float64    `gorm:"default:0" json:"progress"`

    // Liczba błędów / prób
    Attempts    int        `gorm:"default:0" json:"attempts"`
    Mistakes    int        `gorm:"default:0" json:"mistakes"`

    // Czy zakończone
    IsCompleted bool       `gorm:"default:false" json:"is_completed"`
    CompletedAt *time.Time `json:"completed_at"`

    User        User       `gorm:"foreignKey:UserID" json:"-"`
    Task        Task       `gorm:"foreignKey:TaskID" json:"task"`

    // Relacja do szczegółowych odpowiedzi
    Answers     []UserAnswer `gorm:"foreignKey:UserTaskProgressID" json:"answers"`
}
