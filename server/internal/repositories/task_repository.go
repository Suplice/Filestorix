package repositories

import (
	"errors"
	"log/slog"
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type TaskForUser struct {
	ID            uint                  `json:"ID"`
	Title         string                `json:"title"`
	Description   string                `json:"description"`
	Type          string                `json:"type"`
	Language      string                `json:"language"`
	Difficulty    string                `json:"difficulty"`
	Points        int                   `json:"points"`
	XP            int                   `json:"xp"`
	IsActive      bool                  `json:"is_active"`
	CreatedAt     time.Time             `json:"created_at"`
	UpdatedAt     time.Time             `json:"updated_at"`
	TaskQuestions []models.TaskQuestion        `json:"task_questions"`
	UserProgress  *models.UserTaskProgress     `json:"user_progress"` 
}

type TaskRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewTaskRepository(_db *gorm.DB, _logger *slog.Logger) *TaskRepository {
	return &TaskRepository{db: _db, logger: _logger}
}

func (tr *TaskRepository) GetAllTasksForUserDTO(userID uint64) ([]TaskForUser, error) {
	var tasks []models.Task
	err := tr.db.Preload("TaskQuestions").
		Preload("UserProgress", "user_id = ?", userID).
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}

	result := make([]TaskForUser, len(tasks))
	for i, t := range tasks {
		var progress *models.UserTaskProgress
		if len(t.UserProgress) > 0 {
			progress = &t.UserProgress[0]
		}
		result[i] = TaskForUser{
			ID:            t.ID,
			Title:         t.Title,
			Description:   t.Description,
			Type:          t.Type,
			Language:      t.Language,
			Difficulty:    t.Difficulty,
			Points:        t.Points,
			XP:            t.XP,
			IsActive:      t.IsActive,
			CreatedAt:     t.CreatedAt,
			UpdatedAt:     t.UpdatedAt,
			TaskQuestions: t.TaskQuestions,
			UserProgress:  progress,
		}
	}
	return result, nil
}

func (tr *TaskRepository) GetTaskForUserDTO(taskID uint, userID uint) (*TaskForUser, error) {
	var task models.Task

	err := tr.db.
		Preload("TaskQuestions").
		Preload("UserProgress", "user_id = ?", userID).
		Preload("UserProgress.Answers"). 
		First(&task, taskID).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("task not found")
		}
		return nil, err
	}

	var progress *models.UserTaskProgress
	if len(task.UserProgress) > 0 {
		progress = &task.UserProgress[0]
	}

	result := &TaskForUser{
		ID:            task.ID,
		Title:         task.Title,
		Description:   task.Description,
		Type:          task.Type,
		Language:      task.Language,
		Difficulty:    task.Difficulty,
		Points:        task.Points,
		XP:            task.XP,
		IsActive:      task.IsActive,
		CreatedAt:     task.CreatedAt,
		UpdatedAt:     task.UpdatedAt,
		TaskQuestions: task.TaskQuestions,
		UserProgress:  progress, 
	}

	return result, nil
}

func (tr *TaskRepository) GetCorrectAnswer(questionID uint) (string, error) {
	var question models.TaskQuestion
	err := tr.db.Select("correct_answer").First(&question, questionID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("question not found")
		}
		return "", err
	}
	return question.CorrectAnswer, nil
}

func (tr *TaskRepository) SaveAnswerAttempt(userID, taskID, questionID uint, answerGiven string, isCorrect bool) (bool, *models.User, error) {
	var isCompleted bool = false
	var updatedUser *models.User = nil

	err := tr.db.Transaction(func(tx *gorm.DB) error {
		var progress models.UserTaskProgress
		if err := tx.FirstOrCreate(&progress, models.UserTaskProgress{UserID: userID, TaskID: taskID}).Error; err != nil {
			tr.logger.Error("Failed to find or create user task progress", "err", err, "userID", userID, "taskID", taskID)
			return err
		}

		if progress.IsCompleted {
			tr.logger.Warn("Attempt to answer already completed task", "userID", userID, "taskID", taskID)
			return errors.New("task already completed")
		}

		answer := models.UserAnswer{
			UserTaskProgressID: progress.ID,
			TaskQuestionID:     questionID,
			AnswerGiven:        answerGiven,
			IsCorrect:          isCorrect,
			Attempts:           1,
		}
		if err := tx.Create(&answer).Error; err != nil {
			tr.logger.Error("Failed to create user answer", "err", err)
			return err
		}

		updates := map[string]interface{}{
			"attempts": gorm.Expr("attempts + 1"),
		}
		if !isCorrect {
			updates["mistakes"] = gorm.Expr("mistakes + 1")
		}
		if err := tx.Model(&progress).Updates(updates).Error; err != nil {
			tr.logger.Error("Failed to update user task progress stats", "err", err, "progressID", progress.ID)
			return err
		}

		if isCorrect {
			isNowComplete, userAfterRewards, err := tr.recalculateProgressAndGrantRewards(tx, &progress)
			if err != nil {
				tr.logger.Error("Failed to recalculate progress or grant rewards", "err", err, "progressID", progress.ID)
				return err
			}
			isCompleted = isNowComplete
			updatedUser = userAfterRewards 
		}

		return nil 
	})

	return isCompleted, updatedUser, err
}

var xpThresholds = map[int]int{
	1: 0,
	2: 100,
	3: 250,
	4: 500,
	5: 1000,
}

func (tr *TaskRepository) recalculateProgressAndGrantRewards(tx *gorm.DB, progress *models.UserTaskProgress) (bool, *models.User, error) {
	var totalQuestions int64
	if err := tx.Model(&models.TaskQuestion{}).Where("task_id = ?", progress.TaskID).Count(&totalQuestions).Error; err != nil {
		return false, nil, err
	}

	var correctAnswers int64
	if err := tx.Model(&models.UserAnswer{}).Where("user_task_progress_id = ? AND is_correct = ?", progress.ID, true).Count(&correctAnswers).Error; err != nil {
		return false, nil, err
	}

	newProgressPercent := 0.0
	if totalQuestions > 0 {
		newProgressPercent = (float64(correctAnswers) / float64(totalQuestions)) * 100.0
	}
	isNowComplete := (totalQuestions > 0 && correctAnswers == totalQuestions)

	if !isNowComplete {
		err := tx.Model(progress).Update("progress", newProgressPercent).Error
		return false, nil, err
	}

	tr.logger.Info("Task completed!", "userID", progress.UserID, "taskID", progress.TaskID)
	now := time.Now()
	if err := tx.Model(progress).Updates(map[string]interface{}{
		"is_completed": true,
		"completed_at": &now,
		"progress":     100.0,
	}).Error; err != nil {
		return false, nil, err
	}

	var task models.Task
	if err := tx.Select("xp", "points").First(&task, progress.TaskID).Error; err != nil {
		return true, nil, err
	}
	var user models.User
	if err := tx.First(&user, progress.UserID).Error; err != nil {
		return true, nil, err
	}

	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	if user.LastActiveDate.Before(todayStart) {
		yesterdayStart := todayStart.AddDate(0, 0, -1)
		if user.LastActiveDate.After(yesterdayStart) || user.LastActiveDate.Equal(yesterdayStart) {
			user.StreakCount++
		} else {
			user.StreakCount = 1 
		}
		user.LastActiveDate = now
	}

	user.XP += task.XP
	user.Points += task.Points

	currentLevel := user.Level
	for {
		nextLevel := currentLevel + 1
		xpNeeded, exists := xpThresholds[nextLevel]
		if !exists || user.XP < xpNeeded {
			break 
		}
		currentLevel++ 
	}
	user.Level = currentLevel 

	if err := tx.Save(&user).Error; err != nil {
		return true, nil, err
	}

	go func(bgTx *gorm.DB, userID uint) {
		if err := tr.checkAndAwardBadges(tr.db, userID); err != nil {
			tr.logger.Error("Failed to check badges in background", "err", err, "userID", userID)
		}
	}(tx.Session(&gorm.Session{}), user.ID) 

	return true, &user, nil
}

func (tr *TaskRepository) checkAndAwardBadges(db *gorm.DB, userID uint) error {
	var completedTasksCount int64
	if err := db.Model(&models.UserTaskProgress{}).Where("user_id = ? AND is_completed = ?", userID, true).Count(&completedTasksCount).Error; err != nil {
		return err
	}

	var userBadgeIDs []uint
	if err := db.Model(&models.UserBadge{}).Where("user_id = ?", userID).Pluck("badge_id", &userBadgeIDs).Error; err != nil {
		return err
	}

	var badgesToCheck []models.Badge
	if err := db.Not("id", userBadgeIDs).Find(&badgesToCheck).Error; err != nil {
		return err
	}

	for _, badge := range badgesToCheck {
		earnedBadgeID := uint(0)
		switch badge.Name {
		case "Nowicjusz":
			if completedTasksCount >= 1 {
				earnedBadgeID = badge.ID
			}
		case "Uczeń":
			if completedTasksCount >= 5 {
				earnedBadgeID = badge.ID
			}
		}

		if earnedBadgeID > 0 {
			tr.logger.Info("Badge earned!", "userID", userID, "badgeName", badge.Name)
			newUserBadge := models.UserBadge{UserID: userID, BadgeID: earnedBadgeID}
			if err := db.FirstOrCreate(&newUserBadge, newUserBadge).Error; err != nil {
				tr.logger.Error("Failed to award badge", "err", err, "userID", userID, "badgeID", earnedBadgeID)
			}
		}
	}
	return nil
}