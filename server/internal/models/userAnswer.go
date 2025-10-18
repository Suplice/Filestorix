package models

import (
	"time"

	"gorm.io/gorm"
)

type UserAnswer struct {
    gorm.Model
    UserTaskProgressID uint      `gorm:"not null;index" json:"user_task_progress_id"`
    TaskQuestionID     uint      `gorm:"not null;index" json:"task_question_id"`
    AnswerGiven        string    `gorm:"type:text" json:"answer_given"`
    IsCorrect          bool      `gorm:"default:false" json:"is_correct"`
    Attempts           int       `gorm:"default:1" json:"attempts"`
    SubmittedAt        time.Time `gorm:"autoCreateTime" json:"submitted_at"`

    UserTaskProgress   UserTaskProgress `gorm:"foreignKey:UserTaskProgressID" json:"-"`
    TaskQuestion       TaskQuestion     `gorm:"foreignKey:TaskQuestionID" json:"task_question"`
}
