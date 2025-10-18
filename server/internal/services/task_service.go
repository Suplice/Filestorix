package services

import (
	"log/slog"
	"strings"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/repositories"
)

type TaskService struct {
	taskRepository *repositories.TaskRepository
	logger            *slog.Logger
}

func NewTaskService(_taskRepository *repositories.TaskRepository, _logger *slog.Logger) *TaskService {
	return &TaskService{taskRepository: _taskRepository, logger: _logger}
}

func (ts *TaskService) GetAllTasksForUser(userID uint64) ([]repositories.TaskForUser, error) {
	return ts.taskRepository.GetAllTasksForUserDTO(userID)
}

func (ts *TaskService) GetTaskForUser(taskID uint, userID uint) (*repositories.TaskForUser, error) {
	return ts.taskRepository.GetTaskForUserDTO(taskID, userID)
}

// NOWA METODA: SubmitAnswer
type SubmitAnswerResponse struct {
	IsCorrect   bool         `json:"is_correct"`
	IsCompleted bool         `json:"is_completed"`
	UpdatedUser *models.User `json:"updated_user,omitempty"` 
}

// ZAKTUALIZOWANA FUNKCJA: Przekazuje dane z repozytorium
func (ts *TaskService) SubmitAnswer(userID, taskID, questionID uint, answerGiven string) (*SubmitAnswerResponse, error) {
	// Krok 1: Pobierz poprawną odpowiedź
	correctAnswer, err := ts.taskRepository.GetCorrectAnswer(questionID)
	if err != nil {
		ts.logger.Error("Could not get correct answer", "err", err, "questionID", questionID)
		return nil, err
	}

	// Krok 2: Porównaj odpowiedzi
	isCorrect := strings.EqualFold(
		strings.TrimSpace(answerGiven),
		strings.TrimSpace(correctAnswer),
	)

	// Krok 3: Zapisz próbę (ta funkcja robi teraz całą magię)
	isCompleted, updatedUser, err := ts.taskRepository.SaveAnswerAttempt(userID, taskID, questionID, answerGiven, isCorrect)
	if err != nil {
		ts.logger.Error("Could not save answer attempt", "err", err, "userID", userID, "taskID", taskID)
		return nil, err
	}

	// Krok 4: Zwróć pełną odpowiedź
	return &SubmitAnswerResponse{
		IsCorrect:   isCorrect,
		IsCompleted: isCompleted,
		UpdatedUser: updatedUser, // Będzie nil, jeśli zadanie nie jest ukończone
	}, nil
}