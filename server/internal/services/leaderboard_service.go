package services

import (
	"errors"
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/repositories" 
)

type LeaderboardService struct {
	leaderboardRepo *repositories.LeaderboardRepository
	logger          *slog.Logger
}

func NewLeaderboardService(lRepo *repositories.LeaderboardRepository, logger *slog.Logger) *LeaderboardService {
	return &LeaderboardService{leaderboardRepo: lRepo,  logger: logger}
}

func addRank(entries []dto.LeaderboardEntryDTO) []dto.LeaderboardEntryDTO {
	if len(entries) == 0 {
		return entries
	}
	rank := 1
	entries[0].Rank = rank
	for i := 1; i < len(entries); i++ {
		if entries[i].Value != entries[i-1].Value {
			rank = i + 1
		}
		entries[i].Rank = rank
	}
	return entries
}

func (ls *LeaderboardService) GetLeaderboard(criteria string, filter string, currentUserID uint, limit int) ([]dto.LeaderboardEntryDTO, error) {
	var friendIDs []uint
	var err error

	if filter == "friends" {
		friendIDs, err = ls.leaderboardRepo.GetFriendIDs(currentUserID)
		if err != nil {
			return nil, err 
		}
	}

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
				CompletedCourses: &completedCount, 
			}
		}
	default:
		return nil, errors.New("invalid leaderboard criteria")
	}

	results = addRank(results)

	return results, nil
}