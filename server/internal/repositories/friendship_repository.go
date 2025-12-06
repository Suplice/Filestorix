package repositories

import (
	"errors"
	"log/slog"
	"strings" 

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type FriendshipRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewFriendshipRepository(_db *gorm.DB, _logger *slog.Logger) *FriendshipRepository {
	return &FriendshipRepository{db: _db, logger: _logger}
}

func (fr *FriendshipRepository) GetAcceptedFriends(currentUserID uint) ([]dto.FriendshipDTO, error) {
	var friendships []models.Friendship
	var results []dto.FriendshipDTO

	err := fr.db.
		Preload("User").  
		Preload("Friend"). 
		Where("(user_id = ? OR friend_id = ?) AND status = ?", currentUserID, currentUserID, "accepted").
		Find(&friendships).Error

	if err != nil {
		fr.logger.Error("Failed to get accepted friends", "err", err, "userID", currentUserID)
		return nil, err
	}

	results = make([]dto.FriendshipDTO, 0, len(friendships))
	for _, f := range friendships {
		otherUser := f.Friend 
		if f.FriendID == currentUserID { 
			otherUser = f.User
		}
		results = append(results, dto.FriendshipDTO{
			ID:        f.ID,
			Status:    f.Status,
			CreatedAt: f.CreatedAt,
			OtherUser: dto.UserShortInfo{
				ID:        otherUser.ID,
				Username:  otherUser.Username,
				AvatarURL: otherUser.AvatarURL,
				Level:     otherUser.Level,
				Points:    otherUser.Points,
			},
		})
	}
	return results, nil
}

func (fr *FriendshipRepository) GetSentRequests(currentUserID uint) ([]dto.FriendshipDTO, error) {
	var friendships []models.Friendship
	var results []dto.FriendshipDTO

	err := fr.db.
		Preload("Friend"). 
		Where("user_id = ? AND status = ?", currentUserID, "pending").
		Find(&friendships).Error

	if err != nil {
		fr.logger.Error("Failed to get sent requests", "err", err, "userID", currentUserID)
		return nil, err
	}

	results = make([]dto.FriendshipDTO, 0, len(friendships))
	for _, f := range friendships {
		results = append(results, dto.FriendshipDTO{
			ID:        f.ID,
			Status:    f.Status,
			CreatedAt: f.CreatedAt,
			OtherUser: dto.UserShortInfo{
				ID:        f.Friend.ID,
				Username:  f.Friend.Username,
				AvatarURL: f.Friend.AvatarURL,
				Level:     f.Friend.Level,
				Points:    f.Friend.Points,
			},
		})
	}
	return results, nil
}

func (fr *FriendshipRepository) GetIncomingRequests(currentUserID uint) ([]dto.FriendshipDTO, error) {
	var friendships []models.Friendship
	var results []dto.FriendshipDTO

	err := fr.db.
		Preload("User"). 
		Where("friend_id = ? AND status = ?", currentUserID, "pending").
		Find(&friendships).Error

	if err != nil {
		fr.logger.Error("Failed to get incoming requests", "err", err, "userID", currentUserID)
		return nil, err
	}

	results = make([]dto.FriendshipDTO, 0, len(friendships))
	for _, f := range friendships {
		results = append(results, dto.FriendshipDTO{
			ID:        f.ID,
			Status:    f.Status,
			CreatedAt: f.CreatedAt,
			OtherUser: dto.UserShortInfo{
				ID:        f.User.ID,
				Username:  f.User.Username,
				AvatarURL: f.User.AvatarURL,
				Level:     f.User.Level,
				Points:    f.User.Points,
			},
		})
	}
	return results, nil
}

func (fr *FriendshipRepository) SearchUsersByUsername(query string, currentUserID uint) ([]dto.UserShortInfo, error) {
	var users []dto.UserShortInfo 
	trimmedQuery := strings.TrimSpace(query)
	if trimmedQuery == "" {
		return users, nil
	}
	var results []struct{ OtherUserID uint }
	err := fr.db.Model(&models.Friendship{}).
		Where("user_id = ? OR friend_id = ?", currentUserID, currentUserID).
		Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END AS other_user_id", currentUserID).
		Scan(&results).Error
    if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) { return nil, err }
    relatedUserIDs := make([]uint, 0, len(results))
	for _, res := range results { relatedUserIDs = append(relatedUserIDs, res.OtherUserID) }
	relatedUserIDs = append(relatedUserIDs, currentUserID)


	searchPattern := "%" + trimmedQuery + "%"
	err = fr.db.Model(&models.User{}). 
		Where("username ILIKE ? AND id NOT IN ?", searchPattern, relatedUserIDs).
		Select("id as ID, username, avatar_url as AvatarURL, level, points"). 
		Limit(10).
		Find(&users).Error 

	if err != nil {
		fr.logger.Error("Failed to search users", "err", err, "query", query)
		return nil, err
	}
	return users, nil
}
func (fr *FriendshipRepository) CreateFriendRequest(userID, friendID uint) error {
	if userID == friendID {
		return errors.New("cannot add yourself as a friend")
	}

	var existing int64
	fr.db.Model(&models.Friendship{}).
		Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
			userID, friendID, friendID, userID).
		Count(&existing)

	if existing > 0 {
		return errors.New("friendship already exists or request is pending")
	}

	request := models.Friendship{
		UserID:   userID, 
		FriendID: friendID, 
		Status:   "pending",
	}

	err := fr.db.Create(&request).Error
	if err != nil {
		fr.logger.Error("Failed to create friend request", "err", err, "userID", userID, "friendID", friendID)
		return err
	}
	return nil
}

func (fr *FriendshipRepository) CancelFriendRequest(friendshipID uint, userID uint) error {
	var request models.Friendship
	err := fr.db.Where("id = ? AND user_id = ? AND status = ?", friendshipID, userID, "pending").First(&request).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("request not found or you are not authorized to cancel it")
		}
		return err 
	}

	result := fr.db.Delete(&request)
	if result.Error != nil {
		fr.logger.Error("Failed to delete friend request", "err", result.Error, "friendshipID", friendshipID)
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("failed to cancel request, record might have changed")
	}

	return nil
}

func (fr *FriendshipRepository) UpdateFriendshipStatus(friendshipID uint, currentUserID uint, newStatus string) error {
	if newStatus != "accepted" && newStatus != "declined" { 
		return errors.New("invalid status provided to repository")
	}

	return fr.db.Transaction(func(tx *gorm.DB) error {
		var request models.Friendship
		result := tx.Where("id = ? AND friend_id = ? AND status = ?", friendshipID, currentUserID, "pending").First(&request)

		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				return errors.New("incoming friend request not found or you are not authorized to respond")
			}
			fr.logger.Error("DB error finding friend request to update", "err", result.Error, "friendshipID", friendshipID, "userID", currentUserID)
			return result.Error
		}

		var actionErr error
		if newStatus == "declined" {
			actionResult := tx.Delete(&request)
			actionErr = actionResult.Error
			if actionErr == nil && actionResult.RowsAffected == 0 {
				actionErr = errors.New("failed to decline request, record might have changed unexpectedly")
			}
			if actionErr == nil {
				fr.logger.Info("Friend request declined (deleted)", "friendshipID", friendshipID, "userID", currentUserID)
			}
		} else { 
			actionResult := tx.Model(&request).Update("status", "accepted")
			actionErr = actionResult.Error
			if actionErr == nil && actionResult.RowsAffected == 0 {
				actionErr = errors.New("failed to accept request, record might have changed unexpectedly")
			}
			if actionErr == nil {
				fr.logger.Info("Friend request accepted", "friendshipID", friendshipID, "userID", currentUserID)
			}
		}

		if actionErr != nil {
			fr.logger.Error("Failed to perform action on friendship status", "err", actionErr, "friendshipID", friendshipID, "newStatus", newStatus)
			return actionErr 
		}

		return nil
	})
}

func (fr *FriendshipRepository) DeleteFriendship(friendshipID uint, currentUserID uint) error {
	var friendship models.Friendship
	err := fr.db.Where("id = ? AND (user_id = ? OR friend_id = ?) AND status = ?",
		friendshipID, currentUserID, currentUserID, "accepted").
		First(&friendship).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("friendship not found or you are not part of this friendship")
		}
		fr.logger.Error("DB error finding friendship to delete", "err", err, "friendshipID", friendshipID, "userID", currentUserID)
		return err 
	}

	result := fr.db.Delete(&friendship)
	if result.Error != nil {
		fr.logger.Error("Failed to delete friendship", "err", result.Error, "friendshipID", friendshipID)
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("failed to delete friendship, record might have changed")
	}

	fr.logger.Info("Friendship deleted", "friendshipID", friendshipID, "userID", currentUserID)
	return nil
}