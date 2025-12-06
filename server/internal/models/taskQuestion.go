package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type TaskQuestion struct {
	gorm.Model
	TaskID         uint           `gorm:"not null;index" json:"task_id"`
	QuestionText   string         `gorm:"type:text;not null" json:"question_text"`
	Type           string         `gorm:"size:50;not null" json:"type"` 
	Options        datatypes.JSON `json:"options"`
	CorrectAnswer  string         `gorm:"size:255" json:"correct_answer"`
	TestInput      string         `gorm:"type:text" json:"test_input"`
	ExpectedOutput string         `gorm:"type:text" json:"expected_output"`

	Task Task `gorm:"foreignKey:TaskID" json:"-"`
}
