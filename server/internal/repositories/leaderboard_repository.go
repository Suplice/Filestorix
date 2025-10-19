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

// Helper to get friend IDs (can be moved to FriendshipRepository if preferred)
func (lr *LeaderboardRepository) GetFriendIDs(currentUserID uint) ([]uint, error) {
	var friendIDs []uint // Slice to store the final IDs

	// --- ZMIANA: Używamy Select + Scan zamiast Pluck ---
	// Definiujemy tymczasową strukturę do przechwycenia wyniku CASE
	var results []struct {
		OtherUserID uint `gorm:"column:other_user_id"` // Match the alias used in SELECT
	}

	// Wykonujemy zapytanie
	err := lr.db.Model(&models.Friendship{}).
		Where("status = ?", "accepted"). // Only accepted friends
		Where("user_id = ? OR friend_id = ?", currentUserID, currentUserID). // Where current user is involved
		// Select wykonuje CASE WHEN i przypisuje wynik do aliasu 'other_user_id'
		Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END AS other_user_id", currentUserID).
		// Scan wczytuje wyniki do naszej tymczasowej struktury 'results'
		Scan(&results).Error
	// --- KONIEC ZMIANY ---

	// Obsłuż błąd z zapytania (ignoruj RecordNotFound, oznacza brak znajomych)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		lr.logger.Error("Failed to select friend IDs", "err", err, "currentUserID", currentUserID)
		return nil, err
	}

	// Przekształć wyniki z tymczasowej struktury do slice'a uint
	friendIDs = make([]uint, 0, len(results)+1) // Zainicjuj z odpowiednią pojemnością (+1 na siebie)
	for _, res := range results {
		friendIDs = append(friendIDs, res.OtherUserID)
	}

	// Always include the current user in the 'friends' list for ranking purposes
	friendIDs = append(friendIDs, currentUserID)

	return friendIDs, nil
}

// GetUsersByLevel retrieves users ordered by level
func (lr *LeaderboardRepository) GetUsersByLevel(limit int, friendIDs []uint) ([]dto.UserShortInfo, error) {
	var users []dto.UserShortInfo
	query := lr.db.Model(&models.User{}).
		Select("id as ID, username, avatar_url as AvatarURL, level, points"). // Select fields matching UserShortInfo
		Order("level DESC, xp DESC") // Primary sort by level, secondary by XP for tie-breaking

	// Apply friend filter if provided
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

// GetUsersByPoints retrieves users ordered by points
func (lr *LeaderboardRepository) GetUsersByPoints(limit int, friendIDs []uint) ([]dto.UserShortInfo, error) {
	var users []dto.UserShortInfo
	query := lr.db.Model(&models.User{}).
		Select("id as ID, username, avatar_url as AvatarURL, level, points").
		Order("points DESC, level DESC") // Primary sort by points, secondary by level

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

// CompletedCoursesResult defines a temporary struct for the aggregation query
type CompletedCoursesResult struct {
	UserID          uint `gorm:"column:user_id"`
	CompletedCount  int  `gorm:"column:completed_count"`
	Username        string
	AvatarURL       string `gorm:"column:avatar_url"`
	Level           int
	Points          int
}

// GetUsersByCompletedCourses retrieves users ordered by completed course count
func (lr *LeaderboardRepository) GetUsersByCompletedCourses(limit int, friendIDs []uint) ([]CompletedCoursesResult, error) {
	var results []CompletedCoursesResult

	// Base query to count completed tasks per user and join with user data
	query := lr.db.Table("user_task_progresses utp").
		Select(`utp.user_id,
                 COUNT(utp.task_id) as completed_count,
                 u.username,
                 u.avatar_url,
                 u.level,
                 u.points`).
		Joins("JOIN users u ON u.id = utp.user_id"). // Join users table
		Where("utp.is_completed = ?", true).
		Group("utp.user_id, u.username, u.avatar_url, u.level, u.points"). // Group by user details
		Order("completed_count DESC, u.level DESC") // Order by count, then level

	// Apply friend filter if provided
	if len(friendIDs) > 0 {
		query = query.Where("utp.user_id IN ?", friendIDs)
	}

	err := query.Limit(limit).Scan(&results).Error // Use Scan for aggregated results
	if err != nil {
		lr.logger.Error("Failed to get users by completed courses", "err", err)
		return nil, err
	}
	return results, nil
}