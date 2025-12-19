package services

import (
	"log/slog"
	"math"
	"sort"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
)

const (
	WeightDifficulty = 0.4
	WeightAffinity   = 0.3
	WeightStreak     = 0.2
	WeightVariety    = 0.1
)

type RecommendationService struct {
	taskRepo *repositories.TaskRepository
	userRepo *repositories.UserRepository 
	logger   *slog.Logger
}

func NewRecommendationService(tr *repositories.TaskRepository, ur *repositories.UserRepository, l *slog.Logger) *RecommendationService {
	return &RecommendationService{taskRepo: tr, userRepo: ur, logger: l}
}

type ScoredTask struct {
	Task  repositories.TaskForUser
	Score float64
}

func (rs *RecommendationService) GetRecommendedTasks(userID uint64) ([]repositories.TaskForUser, error) {
	user, err := rs.userRepo.GetUserWithHistory(userID) 
	if err != nil {
		return nil, err
	}

	candidateTasks, err := rs.taskRepo.GetUnfinishedTasks(userID)
	if err != nil {
		return nil, err
	}

	affinityMap := rs.calculateLanguageAffinity(user.TaskProgress)
	lastTaskType := rs.getLastTaskType(user.TaskProgress)

	var scoredTasks []ScoredTask

	for _, task := range candidateTasks {
		score := 0.0

		diffScore := rs.calculateDifficultyScore(user.Level, task.Difficulty)
		score += diffScore * WeightDifficulty

		affScore := rs.calculateAffinityScore(affinityMap, task.Language)
		score += affScore * WeightAffinity

		streakMod := rs.calculateStreakModifier(user.StreakCount, task.Difficulty)
		score += streakMod * WeightStreak

		if task.Type != lastTaskType {
			score += 1.0 * WeightVariety
		}

		scoredTasks = append(scoredTasks, ScoredTask{Task: task, Score: score})
	}

	sort.Slice(scoredTasks, func(i, j int) bool {
		return scoredTasks[i].Score > scoredTasks[j].Score
	})

	result := make([]repositories.TaskForUser, len(scoredTasks))
	for i, st := range scoredTasks {
		result[i] = st.Task
	}

	return result, nil
}

func (rs *RecommendationService) calculateLanguageAffinity(history []models.UserTaskProgress) map[string]float64 {
	counts := make(map[string]int)
	total := 0
	for _, h := range history {
		if h.IsCompleted {
			counts[h.Task.Language]++
			total++
		}
	}

	affinity := make(map[string]float64)
	if total == 0 {
		return affinity 
	}

	for lang, count := range counts {
		affinity[lang] = float64(count) / float64(total)
	}
	return affinity
}

func (rs *RecommendationService) calculateDifficultyScore(userLevel int, taskDiff string) float64 {
	diffVal := 1 // EASY
	if taskDiff == "MEDIUM" {
		diffVal = 2
	} else if taskDiff == "HARD" {
		diffVal = 3
	}

	targetDiff := 1
	if userLevel >= 3 && userLevel <= 4 {
		targetDiff = 2
	} else if userLevel >= 5 {
		targetDiff = 3
	}

	distance := math.Abs(float64(targetDiff - diffVal))

	if distance == 0 {
		return 1.0
	} else if distance == 1 {
		return 0.5
	}
	return 0.1
}

func (rs *RecommendationService) calculateAffinityScore(affinity map[string]float64, taskLang string) float64 {
	val, exists := affinity[taskLang]
	if !exists {
		return 0.2
	}
	return val
}

func (rs *RecommendationService) calculateStreakModifier(streak int, taskDiff string) float64 {
	if streak > 5 {
		if taskDiff == "HARD" {
			return 1.0
		}
		if taskDiff == "MEDIUM" {
			return 0.7
		}
		return 0.3 
	}

	if streak < 3 {
		if taskDiff == "EASY" {
			return 1.0
		}
		if taskDiff == "MEDIUM" {
			return 0.5
		}
		return 0.0 
	}

	return 0.5
}

func (rs *RecommendationService) getLastTaskType(history []models.UserTaskProgress) string {
	if len(history) == 0 {
		return ""
	}
	return history[len(history)-1].Task.Type
}