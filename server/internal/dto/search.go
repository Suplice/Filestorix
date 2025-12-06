package dto

type UserSearchResult struct {
	ID        uint   `json:"ID"`
	Username  string `json:"username"`
	AvatarURL string `json:"avatarURL"`
}

type CourseSearchResult struct {
	ID       uint   `json:"ID"`
	Title    string `json:"title"`
	Language string `json:"language"`
}

type SearchResultsDTO struct {
	Users   []UserSearchResult   `json:"users"`
	Courses []CourseSearchResult `json:"courses"`
}