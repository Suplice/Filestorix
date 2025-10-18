package seed

import (
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedTestData(db *gorm.DB) error {
	// ====================
	// Wyczyść tabele (Twoja logika jest OK)
	// ====================
	tables := []string{
		"user_answers",
		"user_task_progresses",
		"task_questions",
		"tasks",
		"badges",
		"friendships",
		"settings",
		"users",
	}

	for _, t := range tables {
		if err := db.Exec("TRUNCATE TABLE " + t + " RESTART IDENTITY CASCADE;").Error; err != nil {
			return err
		}
	}

	// ====================
	// 1. Użytkownicy (Twoje dane są OK)
	// ====================
	users := []models.User{
		{Username: "alice", Email: "alice@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=1", Role: "user", Level: 3, XP: 120, Points: 50, StreakCount: 5, LastActiveDate: time.Now()},
		{Username: "bob", Email: "bob@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=2", Role: "user", Level: 2, XP: 70, Points: 20, StreakCount: 2, LastActiveDate: time.Now()},
	}
	for _, u := range users {
		if err := db.Create(&u).Error; err != nil {
			return err
		}
	}

	// ====================
	// 2. Odznaki (Twoje dane są OK)
	// ====================
	// ... (kod dla odznak) ...

	// ====================
	// 3. Zadania — 4 nowe/zaktualizowane zadania
	// ====================
	tasks := []models.Task{
		// --- ZADANIE 1 (QUIZ) ---
		{
			Title:       "Podstawy Pythona",
			Description: "Quiz wielokrotnego wyboru o zmiennych i typach.",
			Type:        "QUIZ", // Poprawka na duże litery
			Language:    "Python",
			Difficulty:  "EASY",
			Points:      10,
			XP:          5,
		},
		// --- ZADANIE 2 (QUIZ) ---
		{
			Title:       "JavaScript - ES6",
			Description: "Sprawdź swoją wiedzę o funkcjach strzałkowych i `let`/`const`.",
			Type:        "QUIZ",
			Language:    "JavaScript",
			Difficulty:  "EASY",
			Points:      15,
			XP:          10,
		},
		// --- ZADANIE 3 (FILL_BLANK) ---
		{
			Title:       "Deklaracje w Go",
			Description: "Uzupełnij luki w kodzie Go.",
			Type:        "FILL_BLANK", // Nowy typ
			Language:    "Go",
			Difficulty:  "MEDIUM",
			Points:      20,
			XP:          15,
		},
		// --- ZADANIE 4 (FILL_BLANK) ---
		{
			Title:       "Instrukcje SQL",
			Description: "Dokończ popularne zapytania SQL.",
			Type:        "FILL_BLANK",
			Language:    "General", // Ogólne
			Difficulty:  "MEDIUM",
			Points:      20,
			XP:          15,
		},
	}
	// Ważne: Tworzymy zadania w transakcji, aby zachować kolejność ID (1, 2, 3, 4)
	if err := db.Create(&tasks).Error; err != nil {
		return err
	}

	// ====================
	// 4. Pytania do zadań
	// ====================
	questions := []models.TaskQuestion{
		// Pytania do Zadania 1 (ID: 1 - Python QUIZ)
		{TaskID: 1, QuestionText: "W Pythonie zmienna może zmienić swój typ w czasie działania programu.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Prawda","Fałsz"]`)), CorrectAnswer: "Prawda"},
		{TaskID: 1, QuestionText: "Które z poniższych NIE jest wbudowanym typem danych w Pythonie?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["List","Dictionary","Tuple","Array"]`)), CorrectAnswer: "Array"},
		{TaskID: 1, QuestionText: "Jakim operatorem sprawdzisz typ zmiennej `x`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["typeof(x)","type(x)","isType(x)","x.type"]`)), CorrectAnswer: "type(x)"},

		// Pytania do Zadania 2 (ID: 2 - JavaScript QUIZ)
		{TaskID: 2, QuestionText: "Które słowo kluczowe pozwala na deklarację zmiennej, której nie można ponownie przypisać?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["var","let","const","static"]`)), CorrectAnswer: "const"},
		{TaskID: 2, QuestionText: "Funkcje strzałkowe `() => {}` nie posiadają własnego kontekstu `this`.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Prawda","Fałsz"]`)), CorrectAnswer: "Prawda"},

		// Pytania do Zadania 3 (ID: 3 - Go FILL_BLANK)
		{TaskID: 3, QuestionText: "W Go, uzyj słowa `___`, aby zadeklarować nową zmienną z automatyczną inferencją typu (tylko wewnątrz funkcji).", Type: "FILL_BLANK", CorrectAnswer: ":="},
		{TaskID: 3, QuestionText: "Zadeklaruj stałą o nazwie `Version` z wartością 1.1: `___ Version = 1.1`", Type: "FILL_BLANK", CorrectAnswer: "const"},
		{TaskID: 3, QuestionText: "Słowo kluczowe do importowania pakietów to `___`.", Type: "FILL_BLANK", CorrectAnswer: "import"},

		// Pytania do Zadania 4 (ID: 4 - SQL FILL_BLANK)
		{TaskID: 4, QuestionText: "Aby pobrać wszystkie kolumny z tabeli `users`, wpisz: `SELECT ___ FROM users;`", Type: "FILL_BLANK", CorrectAnswer: "*"},
		{TaskID: 4, QuestionText: "Aby dodać nowy wiersz do tabeli `products`, wpisz: `INSERT ___ products (...) VALUES (...);`", Type: "FILL_BLANK", CorrectAnswer: "INTO"},
	}

	for _, q := range questions {
		if err := db.Create(&q).Error; err != nil {
			return err
		}
	}

	// ====================
	// 5. Przykładowy progres
	// ====================
	progress := []models.UserTaskProgress{
		// Alice (ID: 1) rozpoczęła zadanie 1 i 3
		{UserID: 1, TaskID: 1, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		{UserID: 1, TaskID: 3, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		// Bob (ID: 2) rozpoczął zadanie 2
		{UserID: 2, TaskID: 2, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
	}
	for _, p := range progress {
		if err := db.Create(&p).Error; err != nil {
			return err
		}
	}
    
    // ... (reszta Twojego kodu, np. friendships) ...
    
	return nil
}