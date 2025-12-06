package repositories

import (
	"log/slog"
	"strings"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type SearchRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewSearchRepository(_db *gorm.DB, _logger *slog.Logger) *SearchRepository {
	return &SearchRepository{db: _db, logger: _logger}
}

func (sr *SearchRepository) SearchUsers(query string, currentUserID uint, limit int) ([]dto.UserSearchResult, error) {
	var users []dto.UserSearchResult
	trimmedQuery := strings.TrimSpace(query)
	if trimmedQuery == "" {
		return users, nil
	}

	searchPattern := "%" + trimmedQuery + "%"
	err := sr.db.Model(&models.User{}).
		Where("username ILIKE ? AND id != ?", searchPattern, currentUserID). 
		Select("id as ID, username, avatar_url as AvatarURL").            
		Limit(limit).
		Find(&users).Error

	if err != nil {
		sr.logger.Error("Failed to search users for command", "err", err, "query", query)
		return nil, err
	}
	return users, nil
}

func (sr *SearchRepository) SearchCourses(query string, limit int) ([]dto.CourseSearchResult, error) {
	var courses []dto.CourseSearchResult
	trimmedQuery := strings.TrimSpace(query)
	if trimmedQuery == "" {
		return courses, nil
	}

	searchPattern := "%" + trimmedQuery + "%"
	err := sr.db.Model(&models.Task{}).
		Where("title ILIKE ?", searchPattern).
		Select("id as ID, title, language").
		Limit(limit).
		Order("updated_at DESC"). 
		Find(&courses).Error

	if err != nil {
		sr.logger.Error("Failed to search courses for command", "err", err, "query", query)
		return nil, err
	}
	return courses, nil
}