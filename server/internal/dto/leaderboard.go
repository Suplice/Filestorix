package dto
// LeaderboardEntryDTO represents a single user's entry in the leaderboard
type LeaderboardEntryDTO struct {
	Rank            int           `json:"rank"`
	User            UserShortInfo `json:"user"`
	Value           int           `json:"value"`            // The value being ranked (Level, Points, or Completed Count)
	CompletedCourses *int          `json:"completedCourses,omitempty"` // Pointer to int, only included for completed ranking
}

// You might still need FriendshipDTO if used elsewhere, but not directly for leaderboard fetching.