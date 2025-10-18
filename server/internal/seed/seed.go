package seed

import (
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

// SeedTestData wrzuca przykładowe dane dla testów gamifikacji
func SeedTestData(db *gorm.DB) error {
	// ====================
	// 1. Użytkownicy
	// ====================
	users := []models.User{
		{
			Username:      "alice",
			Email:         "alice@example.com",
			Provider:      "local",
			AvatarURL:     "https://i.pravatar.cc/150?img=1",
			Role:          "user",
			Level:         3,
			XP:            120,
			Points:        50,
			StreakCount:   5,
			LastActiveDate: time.Now(),
		},
		{
			Username:      "bob",
			Email:         "bob@example.com",
			Provider:      "local",
			AvatarURL:     "https://i.pravatar.cc/150?img=2",
			Role:          "user",
			Level:         2,
			XP:            70,
			Points:        20,
			StreakCount:   2,
			LastActiveDate: time.Now(),
		},
	}

	for _, u := range users {
		if err := db.FirstOrCreate(&u, models.User{Email: u.Email}).Error; err != nil {
			return err
		}
	}

	// ====================
	// 2. Odznaki
	// ====================
	badges := []models.Badge{
		{Name: "Novice", Description: "Complete first task", Requirement: "Complete 1 task"},
		{Name: "Intermediate", Description: "Reach level 5", Requirement: "Level 5"},
	}

	for _, b := range badges {
		if err := db.FirstOrCreate(&b, models.Badge{Name: b.Name}).Error; err != nil {
			return err
		}
	}

	// ====================
	// 3. Zadania
	// ====================
	tasks := []models.Task{
		{
			UserID:      1,
			Title:       "Quiz 1",
			Description: "Simple true/false quiz",
			Type:        "quiz",
			Points:      10,
			XP:          5,
		},
		{
			UserID:      2,
			Title:       "Fill in the blanks",
			Description: "Uzupełnij brakujące wartości",
			Type:        "fill",
			Points:      15,
			XP:          10,
		},
		{
			UserID:      1,
			Title:       "Code Challenge",
			Description: "Write a function to reverse a string",
			Type:        "code",
			Points:      25,
			XP:          20,
		},
	}

	for _, t := range tasks {
		if err := db.Create(&t).Error; err != nil {
			return err
		}
	}

	// ====================
	// 4. Pytania / testy
	// ====================
	questions := []models.TaskQuestion{
		{
			TaskID:       1,
			QuestionText: "2 + 2 = 4?",
			Type:         "quiz",
			Options:      `["True","False"]`,
			CorrectAnswer: "True",
		},
		{
			TaskID:       2,
			QuestionText: "Fill: 5 + ___ = 8",
			Type:         "fill",
			CorrectAnswer: "3",
		},
		{
			TaskID:       3,
			QuestionText: "Write function reverseString(s string) string",
			Type:         "code",
			CorrectAnswer: "reversed string",
		},
	}

	for _, q := range questions {
		if err := db.Create(&q).Error; err != nil {
			return err
		}
	}

	// ====================
	// 5. Progres użytkowników + odpowiedzi
	// ====================
	progress := []models.UserTaskProgress{
		{
			UserID:    1,
			TaskID:    1,
			Progress:  50,
			Attempts:  1,
			Mistakes:  1,
			IsCompleted: false,
			Answers: []models.UserAnswer{
				{TaskQuestionID: 1, AnswerGiven: "True", IsCorrect: true, Attempts: 1},
			},
		},
		{
			UserID:    2,
			TaskID:    2,
			Progress:  0,
			Attempts:  0,
			Mistakes:  0,
			IsCompleted: false,
		},
		{
			UserID:    1,
			TaskID:    3,
			Progress:  0,
			Attempts:  0,
			Mistakes:  0,
			IsCompleted: false,
		},
	}

	for _, p := range progress {
		if err := db.Create(&p).Error; err != nil {
			return err
		}
		// Dodajemy odpowiedzi osobno, żeby GORM je połączył
		for _, ans := range p.Answers {
			ans.UserTaskProgressID = p.ID
			if err := db.Create(&ans).Error; err != nil {
				return err
			}
		}
	}

	// ====================
	// 6. Znajomi
	// ====================
	friendships := []models.Friendship{
		{UserID: 1, FriendID: 2, Status: "accepted"},
	}

	for _, f := range friendships {
		if err := db.FirstOrCreate(&f, models.Friendship{UserID: f.UserID, FriendID: f.FriendID}).Error; err != nil {
			return err
		}
	}

	return nil
}
