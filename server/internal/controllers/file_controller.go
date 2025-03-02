package controllers

import (
	"log/slog"
	"net/http"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type FileController struct {
	fileService *services.FileService
	logger      *slog.Logger
}

func NewFileController(_logger *slog.Logger, _fileService *services.FileService) *FileController {
	return &FileController{fileService: _fileService, logger: _logger}
}


func (fc *FileController) FetchAllUserFiles(c *gin.Context) {
	userId := c.Param("userId")

	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	files, err := fc.fileService.FetchAllUserFiles(userId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"files": files})

}