package services

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/repositories"
	"golang.org/x/sync/errgroup" // For concurrent searches
)

type SearchService struct {
	repo   *repositories.SearchRepository
	logger *slog.Logger
}

func NewSearchService(repo *repositories.SearchRepository, logger *slog.Logger) *SearchService {
	return &SearchService{repo: repo, logger: logger}
}

// PerformSearch searches both users and courses concurrently
func (ss *SearchService) PerformSearch(query string, currentUserID uint, limitPerType int) (*dto.SearchResultsDTO, error) {
	var g errgroup.Group
	var users []dto.UserSearchResult
	var courses []dto.CourseSearchResult

	// Run user search in a goroutine
	g.Go(func() error {
		var err error
		users, err = ss.repo.SearchUsers(query, currentUserID, limitPerType)
		return err // Return error to errgroup
	})

	// Run course search in another goroutine
	g.Go(func() error {
		var err error
		courses, err = ss.repo.SearchCourses(query, limitPerType)
		return err // Return error to errgroup
	})

	// Wait for both searches to complete and check for errors
	if err := g.Wait(); err != nil {
		ss.logger.Error("Error during concurrent search", "err", err, "query", query)
		return nil, err
	}

	// Combine results into the final DTO
	results := &dto.SearchResultsDTO{
		Users:   users,
		Courses: courses,
	}

	return results, nil
}