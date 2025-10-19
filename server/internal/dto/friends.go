package dto

import (
	"time"
)

// UserShortInfo - Podstawowe info o użytkowniku do wyświetlania na listach
type UserShortInfo struct {
	ID        uint   `json:"ID"`
	Username  string `json:"username"`
	AvatarURL string `json:"avatarURL"`
	Level     int    `json:"level"`
	Points    int    `json:"points"`
}

// FriendshipDTO - Struktura zwracana przez API dla znajomych i zaproszeń
type FriendshipDTO struct {
	ID        uint          `json:"ID"` // ID samej relacji Friendship
	Status    string        `json:"status"`
	CreatedAt time.Time     `json:"createdAt"`
	OtherUser UserShortInfo `json:"otherUser"` // Zawsze zawiera dane DRUGIEJ osoby
}