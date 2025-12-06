package dto

import (
	"github.com/Suplice/Filestorix/internal/models"
)

type FriendshipStatusDTO struct {
	Status       string `json:"status"` 
	FriendshipID uint   `json:"friendshipId,omitempty"` 
}

type ProfileDTO struct {
	User               models.User        `json:"user"`              
	TotalCompleted     int64              `json:"totalCompleted"`    
	TotalMistakes      int64              `json:"totalMistakes"`     
	TasksWithProgress  []TaskForUserDTO   `json:"tasksWithProgress"` 
	FriendshipWithView *FriendshipStatusDTO `json:"friendshipWithView,omitempty"` 
}

type TaskForUserDTO struct {
	ID           uint                      `json:"ID"`
	Title        string                    `json:"title"`
	Language     string                    `json:"language"`
	Difficulty   string                    `json:"difficulty"`
	Points       int                       `json:"points"`
	XP           int                       `json:"xp"`
	UserProgress *models.UserTaskProgress  `json:"user_progress"`
}