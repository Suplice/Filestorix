package controllers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type TaskController struct {
	taskService *services.TaskService
	logger      *slog.Logger
}

func NewTaskController(_logger *slog.Logger, _taskService *services.TaskService) *TaskController {
	return &TaskController{taskService: _taskService, logger: _logger}
}

func (tc *TaskController) GetAllTasksForUser(ctx *gin.Context) {
	userIDStr := ctx.Param("id") 

	userID64, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format in URL"})
		return
	}

	authenticatedUserID := ctx.GetUint64("userID")
	if authenticatedUserID != userID64 {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to view this user's tasks"})
		return
	}

	tasks, err := tc.taskService.GetAllTasksForUser(userID64)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	ctx.JSON(http.StatusOK, tasks)
}

func (tc *TaskController) GetTaskForUser(ctx *gin.Context) {
	taskIDStr := ctx.Param("taskId")
	userIDStr := ctx.Param("userId")

	taskID, err := strconv.ParseUint(taskIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID format"})
		return
	}

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}
	task, err := tc.taskService.GetTaskForUser(uint(taskID), uint(userID))
	if err != nil {
		if err.Error() == "task not found" {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve task details"})
		return
	}

	// Krok 3: Zwróć wynik
	ctx.JSON(http.StatusOK, task)
}


type SubmitAnswerRequest struct {
	TaskID      uint   `json:"taskId" binding:"required"`
	QuestionID  uint   `json:"questionId" binding:"required"`
	AnswerGiven string `json:"answer" binding:"required"`
}

// NOWA METODA: SubmitAnswer
func (tc *TaskController) SubmitAnswer(ctx *gin.Context) {
	userID64 := ctx.GetUint64("userID")

	if userID64 == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	var req SubmitAnswerRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	result, err := tc.taskService.SubmitAnswer(
		uint(userID64), 
		req.TaskID,
		req.QuestionID,
		req.AnswerGiven,
	)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}