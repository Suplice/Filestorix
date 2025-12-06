package dto
type LeaderboardEntryDTO struct {
	Rank            int           `json:"rank"`
	User            UserShortInfo `json:"user"`
	Value           int           `json:"value"`          
	CompletedCourses *int          `json:"completedCourses,omitempty"` 
}
