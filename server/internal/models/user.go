package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username       string    `gorm:"size:255;not null" json:"username"`
	Email          string    `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Provider       string    `gorm:"size:255;not null" json:"provider"`
	AvatarURL      string    `gorm:"size:255;not null" json:"avatarURL"`
	Role           string    `gorm:"size:255;not null" json:"role"`
	PasswordHash   string    `gorm:"size:255" json:"passwordHash"`
	LastLoginAt    time.Time `gorm:"autoCreateTime;autoUpdateTime" json:"lastLoginAt"`
	GoogleID       string    `gorm:"size:255" json:"googleId"`
	GithubID       string    `gorm:"size:255" json:"githubId"`

	Level          int       `gorm:"default:1" json:"level"`
	XP             int       `gorm:"default:0" json:"xp"`
	Points         int       `gorm:"default:0" json:"points"`
	StreakCount    int       `gorm:"default:0" json:"streakCount"`
	LastActiveDate time.Time `json:"lastActiveDate"`

	TaskProgress []UserTaskProgress `gorm:"foreignKey:UserID" json:"task_progress"`
	Friends      []Friendship       `gorm:"foreignKey:UserID" json:"friends"`
	Badges       []UserBadge        `json:"badges"`
	Activities   []ActivityLog      `json:"activities"`

	Tasks []Task `gorm:"many2many:user_task_progresses;joinForeignKey:UserID;joinReferences:TaskID" json:"tasks"`
}
