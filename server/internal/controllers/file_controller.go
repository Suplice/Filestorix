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


// FetchAllUserFiles handles the HTTP request to fetch all files for a specific user.
// It retrieves the user ID from the URL parameters and uses the file service to fetch the files.
// If the user ID is not provided, it responds with a 400 Bad Request status and an error message.
// If an error occurs while fetching the files, it responds with a 400 Bad Request status and the error message.
// On success, it responds with a 200 OK status and the list of files.
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


func (fc *FileController) UploadFiles(c * gin.Context) {
	userId := c.Param("userId")

	files, err := fc.fileService.UploadFiles(c, userId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : err.Error()})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"files": files,
		"message": constants.SuccessUploadFiles,
	})



}