package services

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/repositories"
)

type FriendshipService struct {
	repo   *repositories.FriendshipRepository
	logger *slog.Logger
}

func NewFriendshipService(repo *repositories.FriendshipRepository, logger *slog.Logger) *FriendshipService {
	return &FriendshipService{repo: repo, logger: logger}
}

func (fs *FriendshipService) GetAcceptedFriends(userID uint) ([]dto.FriendshipDTO, error) {
	return fs.repo.GetAcceptedFriends(userID)
}

func (fs *FriendshipService) GetSentRequests(userID uint) ([]dto.FriendshipDTO, error) {
	return fs.repo.GetSentRequests(userID)
}

func (fs *FriendshipService) GetIncomingRequests(userID uint) ([]dto.FriendshipDTO, error) {
	return fs.repo.GetIncomingRequests(userID)
}

func (fs *FriendshipService) SearchUsers(query string, currentUserID uint) ([]dto.UserShortInfo, error) {
	return fs.repo.SearchUsersByUsername(query, currentUserID)
}

func (fs *FriendshipService) SendRequest(userID, friendID uint) error {
	// Możesz dodać logikę biznesową, np. limit zaproszeń
	return fs.repo.CreateFriendRequest(userID, friendID)
}

func (fs *FriendshipService) CancelRequest(friendshipID uint, userID uint) error {
	// Możesz dodać tu dodatkową logikę, jeśli potrzebujesz
	return fs.repo.CancelFriendRequest(friendshipID, userID)
}

func (fs *FriendshipService) RespondToRequest(friendshipID uint, currentUserID uint, action string) error {
	// Mapuj akcję na status (np. "accept" -> "accepted", "decline" -> "declined")
	var newStatus string
	switch action {
	case "accept":
		newStatus = "accepted"
	case "decline":
		newStatus = "declined"
	// Możesz dodać "block" -> "blocked"
	default:
		return errors.New("invalid action")
	}
	return fs.repo.UpdateFriendshipStatus(friendshipID, currentUserID, newStatus)
}

func (fs *FriendshipService) RemoveFriend(friendshipID uint, currentUserID uint) error {
	// Możesz dodać logikę biznesową, np. logowanie aktywności
	return fs.repo.DeleteFriendship(friendshipID, currentUserID)
}