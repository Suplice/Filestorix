package dto

import (
	"time"
)

type UserShortInfo struct {
	ID        uint   `json:"ID"`
	Username  string `json:"username"`
	AvatarURL string `json:"avatarURL"`
	Level     int    `json:"level"`
	Points    int    `json:"points"`
}

type FriendshipDTO struct {
	ID        uint          `json:"ID"`
	Status    string        `json:"status"`
	CreatedAt time.Time     `json:"createdAt"`
	OtherUser UserShortInfo `json:"otherUser"` 
}