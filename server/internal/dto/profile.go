package dto

import (
	"github.com/Suplice/Filestorix/internal/models"
)

// FriendshipStatusDTO opisuje relację między zalogowanym użytkownikiem a właścicielem profilu
type FriendshipStatusDTO struct {
	Status       string `json:"status"` // "not_friends", "friends", "request_sent", "request_received"
	FriendshipID uint   `json:"friendshipId,omitempty"` // ID relacji, potrzebne do akcji (anuluj, usuń, odpowiedz)
}

// ProfileDTO to główny obiekt zwracany przez API profilu
type ProfileDTO struct {
	User               models.User        `json:"user"`              // Pełne dane użytkownika profilu
	TotalCompleted     int64              `json:"totalCompleted"`    // Łączna liczba ukończonych zadań
	TotalMistakes      int64              `json:"totalMistakes"`     // Łączna liczba błędów
	TasksWithProgress  []TaskForUserDTO   `json:"tasksWithProgress"` // Lista zadań z postępem
	FriendshipWithView *FriendshipStatusDTO `json:"friendshipWithView,omitempty"` // Status znajomości z oglądającym (nil dla własnego profilu)
}

// TaskForUserDTO (możesz użyć tego, co masz w friendship_repository lub zdefiniować ponownie)
type TaskForUserDTO struct {
	ID           uint                      `json:"ID"`
	Title        string                    `json:"title"`
	Language     string                    `json:"language"`
	Difficulty   string                    `json:"difficulty"`
	Points       int                       `json:"points"`
	XP           int                       `json:"xp"`
	UserProgress *models.UserTaskProgress  `json:"user_progress"`
}