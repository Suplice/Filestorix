package services

import (
	"errors"
	"log/slog"

	// Needed for sorting after fetching all users when filtering friends
	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/repositories" // Import both repos
)

type LeaderboardService struct {
	leaderboardRepo *repositories.LeaderboardRepository
	logger          *slog.Logger
}

// Adjust constructor based on where getFriendIDs resides
func NewLeaderboardService(lRepo *repositories.LeaderboardRepository, logger *slog.Logger) *LeaderboardService {
	return &LeaderboardService{leaderboardRepo: lRepo,  logger: logger}
}

// Helper to add rank to DTO list
func addRank(entries []dto.LeaderboardEntryDTO) []dto.LeaderboardEntryDTO {
	if len(entries) == 0 {
		return entries
	}
	rank := 1
	entries[0].Rank = rank
	for i := 1; i < len(entries); i++ {
		// Increment rank only if the value is different from the previous user
		if entries[i].Value != entries[i-1].Value {
			rank = i + 1
		}
		// If including CompletedCourses, add tie-breaking logic based on it if needed
		// Example tie-breaker based on level if primary sort is points:
		// if entry[i].Value == entry[i-1].Value && entry[i].User.Level != entry[i-1].User.Level {
		//     rank = i + 1 // Or keep same rank based on preference
		// }
		entries[i].Rank = rank
	}
	return entries
}

func (ls *LeaderboardService) GetLeaderboard(criteria string, filter string, currentUserID uint, limit int) ([]dto.LeaderboardEntryDTO, error) {
	var friendIDs []uint
	var err error

	if filter == "friends" {
		// Fetch friend IDs using the leaderboardRepo's helper (or friendshipRepo)
		friendIDs, err = ls.leaderboardRepo.GetFriendIDs(currentUserID)
		if err != nil {
			return nil, err // Propagate error
		}
		// If user has no friends, the list will only contain currentUserID
	}
	// If filter is "all", friendIDs remains nil/empty, repository won't filter by IDs

	var results []dto.LeaderboardEntryDTO

	switch criteria {
	case "level":
		users, err := ls.leaderboardRepo.GetUsersByLevel(limit, friendIDs)
		if err != nil { return nil, err }
		results = make([]dto.LeaderboardEntryDTO, len(users))
		for i, u := range users {
			results[i] = dto.LeaderboardEntryDTO{User: u, Value: u.Level}
		}
	case "points":
		users, err := ls.leaderboardRepo.GetUsersByPoints(limit, friendIDs)
		if err != nil { return nil, err }
		results = make([]dto.LeaderboardEntryDTO, len(users))
		for i, u := range users {
			results[i] = dto.LeaderboardEntryDTO{User: u, Value: u.Points}
		}
	case "completed":
		completedResults, err := ls.leaderboardRepo.GetUsersByCompletedCourses(limit, friendIDs)
		if err != nil { return nil, err }
		results = make([]dto.LeaderboardEntryDTO, len(completedResults))
		for i, r := range completedResults {
			// Need to copy the value because r.CompletedCount is an int, but DTO expects *int
			completedCount := r.CompletedCount
			results[i] = dto.LeaderboardEntryDTO{
				User: dto.UserShortInfo{
					ID:        r.UserID,
					Username:  r.Username,
					AvatarURL: r.AvatarURL,
					Level:     r.Level,
					Points:    r.Points,
				},
				Value:           r.CompletedCount,
				CompletedCourses: &completedCount, // Assign address of the copied value
			}
		}
	default:
		return nil, errors.New("invalid leaderboard criteria")
	}

	// Add rank after fetching and potentially filtering
	results = addRank(results)

	return results, nil
}