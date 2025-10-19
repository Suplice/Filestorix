package dto

// UserSearchResult - Basic info for search results
type UserSearchResult struct {
	ID        uint   `json:"ID"`
	Username  string `json:"username"`
	AvatarURL string `json:"avatarURL"`
}

// CourseSearchResult - Basic info for search results
type CourseSearchResult struct {
	ID       uint   `json:"ID"`
	Title    string `json:"title"`
	Language string `json:"language"` // Add language for context
}

// SearchResultsDTO - Combined results for the API response
type SearchResultsDTO struct {
	Users   []UserSearchResult   `json:"users"`
	Courses []CourseSearchResult `json:"courses"`
}