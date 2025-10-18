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
	UserProgress  *models.UserTaskProgress     `json:"user_progress"` // single object
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
	// Pobieramy tylko pole `correct_answer`, żeby było wydajnie
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

		// Krok 3: Zaktualizuj statystyki (próby, błędy)
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

		// Krok 4: Przelicz progres i przyznaj nagrody (tylko za poprawną odpowiedź)
		if isCorrect {
			isNowComplete, userAfterRewards, err := tr.recalculateProgressAndGrantRewards(tx, &progress)
			if err != nil {
				tr.logger.Error("Failed to recalculate progress or grant rewards", "err", err, "progressID", progress.ID)
				return err
			}
			// Ustaw zmienne, które zwrócimy poza transakcją
			isCompleted = isNowComplete
			updatedUser = userAfterRewards // Będzie nil, jeśli zadanie nie jest ukończone
		}

		return nil // Commituj transakcję
	})

	return isCompleted, updatedUser, err
}

// Definicja progów XP dla poziomów
var xpThresholds = map[int]int{
	1: 0,
	2: 100,
	3: 250,
	4: 500,
	5: 1000,
	// ...dodaj więcej poziomów
}

// NOWA FUNKCJA POMOCNICZA: Przelicza progres, przyznaje nagrody i zwraca (czyUkończono, zaktualizowanyUser, błąd)
func (tr *TaskRepository) recalculateProgressAndGrantRewards(tx *gorm.DB, progress *models.UserTaskProgress) (bool, *models.User, error) {
	// 4.1: Oblicz procentowy postęp
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

	// 4.2: Jeśli zadanie NIE jest jeszcze ukończone
	if !isNowComplete {
		err := tx.Model(progress).Update("progress", newProgressPercent).Error
		return false, nil, err
	}

	// 4.3: Jeśli zadanie WŁAŚNIE ZOSTAŁO UKOŃCZONE
	tr.logger.Info("Task completed!", "userID", progress.UserID, "taskID", progress.TaskID)
	now := time.Now()
	if err := tx.Model(progress).Updates(map[string]interface{}{
		"is_completed": true,
		"completed_at": &now,
		"progress":     100.0,
	}).Error; err != nil {
		return false, nil, err
	}

	// 4.4: Pobierz Task (dla XP/Punktów) i User (do aktualizacji)
	var task models.Task
	if err := tx.Select("xp", "points").First(&task, progress.TaskID).Error; err != nil {
		return true, nil, err
	}
	var user models.User
	if err := tx.First(&user, progress.UserID).Error; err != nil {
		return true, nil, err
	}

	// 4.5: Logika Streaka
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	// Sprawdź, czy ostatnia aktywność była PRZED dzisiejszym porankiem
	if user.LastActiveDate.Before(todayStart) {
		yesterdayStart := todayStart.AddDate(0, 0, -1)
		// Sprawdź, czy ostatnia aktywność była wczoraj
		if user.LastActiveDate.After(yesterdayStart) || user.LastActiveDate.Equal(yesterdayStart) {
			user.StreakCount++ // Kontynuuj streaka
		} else {
			user.StreakCount = 1 // Resetuj streaka (bo >1 dzień przerwy)
		}
		user.LastActiveDate = now // Ustaw nową datę aktywności
	}
	// Jeśli LastActiveDate jest dzisiaj, nie rób nic (już zdobył streaka)

	// 4.6: Przyznaj nagrody (XP i Punkty)
	user.XP += task.XP
	user.Points += task.Points

	// 4.7: Sprawdź awans (Level Up)
	currentLevel := user.Level
	for {
		nextLevel := currentLevel + 1
		xpNeeded, exists := xpThresholds[nextLevel]
		if !exists || user.XP < xpNeeded {
			break // Osiągnięto max poziom lub za mało XP
		}
		currentLevel++ // AWANS!
	}
	user.Level = currentLevel // Ustaw nowy (lub ten sam) poziom

	// Zapisz zmiany w użytkowniku
	if err := tx.Save(&user).Error; err != nil {
		return true, nil, err
	}

	// 4.8: Sprawdź odznaki (w tle, błąd nie powinien zatrzymać transakcji)
	go func(bgTx *gorm.DB, userID uint) {
		// Użyj nowego połączenia DB lub klona transakcji dla operacji w tle
		// Tu dla prostoty użyjemy tr.db, ale bezpieczniej byłoby przekazać nowe *gorm.DB
		if err := tr.checkAndAwardBadges(tr.db, userID); err != nil {
			tr.logger.Error("Failed to check badges in background", "err", err, "userID", userID)
		}
	}(tx.Session(&gorm.Session{}), user.ID) // Przekaż klon sesji transakcji

	// Zwróć info o ukończeniu ORAZ zaktualizowany obiekt użytkownika
	return true, &user, nil
}

// NOWA FUNKCJA POMOCNICZA: Sprawdzanie odznak
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
			// Użyj FirstOrCreate, aby uniknąć błędów duplikacji
			if err := db.FirstOrCreate(&newUserBadge, newUserBadge).Error; err != nil {
				tr.logger.Error("Failed to award badge", "err", err, "userID", userID, "badgeID", earnedBadgeID)
			}
		}
	}
	return nil
}