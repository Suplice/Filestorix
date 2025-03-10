package controllers

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Suplice/Filestorix/internal/dto"
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

	userId, exists := c.Get("stringUserID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	fmt.Println("userId", stringUserId)

	files, err := fc.fileService.FetchAllUserFiles(stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"files": files})

}


// UploadFiles handles the uploading of files for a specific user.
// It retrieves the userId from the URL parameters and the parentId from the form data.
// The function checks if the tokenUserId from the context matches the userId parameter.
// If they do not match, it returns an unauthorized error response.
// If the IDs match, it calls the fileService's UploadFiles method to handle the file upload.
// If the upload is successful, it returns a JSON response with the uploaded files and a success message.
// If there is an error during the upload, it returns a bad request error response.
func (fc *FileController) UploadFiles(c * gin.Context) {
	parentId := c.PostForm("parentId")

	userId, exists := c.Get("stringUserID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)


	files, err := fc.fileService.UploadFiles(c, stringUserId, parentId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : err.Error()})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"files": files,
		"message": constants.SuccessUploadFiles,
	})

}


// CreateCatalog handles the creation of a new catalog for a user.
// It expects a JSON payload with the catalog details and a userId parameter in the URL.
// The function performs the following steps:
// It Binds the JSON payload to the AddCatalogRequest struct.
// It Validates the userId from the URL against the tokenUserId from the context.
// It Calls the fileService to create the catalog.
// It Returns a JSON response with the created catalog or an error message.
func (fc *FileController) CreateCatalog(c *gin.Context) {

	userId, exists := c.Get("stringUserID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	var requestData dto.AddCatalogRequest

    if err := c.ShouldBindJSON(&requestData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": constants.ErrInvalidData})
        return
    }

	catalog, err := fc.fileService.CreateCatalog(requestData.Name, requestData.ParentID, stringUserId)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": 	constants.SuccessCreateCatalog,
		"catalog":	catalog,
	})


}


func (fc *FileController) RenameFile(c *gin.Context) {

	var requestData dto.RenameFileRequest

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrInvalidFileData,
		})
		return
	}

	err := fc.fileService.RenameFile(requestData)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessRenamingFile,
	})
}

func (fc *FileController) TrashFile(c *gin.Context) {

	fileId := c.Param("fileId")


	err := fc.fileService.TrashFile(fileId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessTrashingFile,
	})
}



func (fc *FileController) GetFile(c *gin.Context) {
	fileName := c.Param("fileName")


	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)


	filePath, err := fc.fileService.GetFile(fileName, stringUserId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}


	c.File(filePath)
}