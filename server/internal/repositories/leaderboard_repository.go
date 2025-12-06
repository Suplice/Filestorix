package repositories

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type LeaderboardRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewLeaderboardRepository(_db *gorm.DB, _logger *slog.Logger) *LeaderboardRepository {
	return &LeaderboardRepository{db: _db, logger: _logger}
}

func (lr *LeaderboardRepository) GetFriendIDs(currentUserID uint) ([]uint, error) {
	var friendIDs []uint 

	var results []struct {
		OtherUserID uint `gorm:"column:other_user_id"` 
	}

	err := lr.db.Model(&models.Friendship{}).
		Where("status = ?", "accepted"). 
		Where("user_id = ? OR friend_id = ?", currentUserID, currentUserID). 
		Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END AS other_user_id", currentUserID).
		Scan(&results).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		lr.logger.Error("Failed to select friend IDs", "err", err, "currentUserID", currentUserID)
		return nil, err
	}

	friendIDs = make([]uint, 0, len(results)+1) 
	for _, res := range results {
		friendIDs = append(friendIDs, res.OtherUserID)
	}

	friendIDs = append(friendIDs, currentUserID)

	return friendIDs, nil
}

func (lr *LeaderboardRepository) GetUsersByLevel(limit int, friendIDs []uint) ([]dto.UserShortInfo, error) {
	var users []dto.UserShortInfo
	query := lr.db.Model(&models.User{}).
		Select("id as ID, username, avatar_url as AvatarURL, level, points").
		Order("level DESC, xp DESC") 

	if len(friendIDs) > 0 {
		query = query.Where("id IN ?", friendIDs)
	}

	err := query.Limit(limit).Find(&users).Error
	if err != nil {
		lr.logger.Error("Failed to get users by level", "err", err)
		return nil, err
	}
	return users, nil
}

func (lr *LeaderboardRepository) GetUsersByPoints(limit int, friendIDs []uint) ([]dto.UserShortInfo, error) {
	var users []dto.UserShortInfo
	query := lr.db.Model(&models.User{}).
		Select("id as ID, username, avatar_url as AvatarURL, level, points").
		Order("points DESC, level DESC") 

	if len(friendIDs) > 0 {
		query = query.Where("id IN ?", friendIDs)
	}

	err := query.Limit(limit).Find(&users).Error
	if err != nil {
		lr.logger.Error("Failed to get users by points", "err", err)
		return nil, err
	}
	return users, nil
}

type CompletedCoursesResult struct {
	UserID          uint `gorm:"column:user_id"`
	CompletedCount  int  `gorm:"column:completed_count"`
	Username        string
	AvatarURL       string `gorm:"column:avatar_url"`
	Level           int
	Points          int
}

func (lr *LeaderboardRepository) GetUsersByCompletedCourses(limit int, friendIDs []uint) ([]CompletedCoursesResult, error) {
	var results []CompletedCoursesResult
	query := lr.db.Table("user_task_progresses utp").
		Select(`utp.user_id,
                 COUNT(utp.task_id) as completed_count,
                 u.username,
                 u.avatar_url,
                 u.level,
                 u.points`).
		Joins("JOIN users u ON u.id = utp.user_id"). 
		Where("utp.is_completed = ?", true).
		Group("utp.user_id, u.username, u.avatar_url, u.level, u.points"). 
		Order("completed_count DESC, u.level DESC") 

	if len(friendIDs) > 0 {
		query = query.Where("utp.user_id IN ?", friendIDs)
	}

	err := query.Limit(limit).Scan(&results).Error 
	if err != nil {
		lr.logger.Error("Failed to get users by completed courses", "err", err)
		return nil, err
	}
	return results, nil
}