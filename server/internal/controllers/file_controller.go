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


// RenameFile handles the renaming of a file based on the provided JSON request data.
// It binds the JSON request to a RenameFileRequest DTO and calls the file service to rename the file.
// If the JSON binding fails, it responds with an unauthorized status and an error message.
// If the renaming operation fails, it responds with a bad request status and the error message.
// On success, it responds with an OK status and a success message.
func (fc *FileController) RenameFile(c *gin.Context) {

	var requestData dto.RenameFileRequest

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrInvalidFileData,
		})
		return
	}

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.RenameFile(requestData, stringUserId)

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

// TrashFile handles the request to move a file to the trash.
// It retrieves the file ID from the URL parameters and calls the TrashFile method
// of the file service. If an error occurs, it responds with a bad request status
// and the error message. Otherwise, it responds with a success message.
func (fc *FileController) TrashFile(c *gin.Context) {

	fileId := c.Param("fileId")

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)


	err := fc.fileService.TrashFile(fileId, stringUserId)

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



// GetFile handles the HTTP request to retrieve a file based on the provided file name.
// It expects a "fileName" parameter in the URL and a "stringUserID" in the context.
// If the "stringUserID" is not found, it responds with an unauthorized status.
// If the file retrieval fails, it responds with a bad request status and the error message.
// On success, it serves the requested file to the client.
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

// DeleteFile handles the HTTP request to delete a file both from the database and disk.
// It expects a "fileId" parameter in the URL and a "stringUserID" value in the context for authorization.
// If the user is unauthorized, it responds with an HTTP 401 status and an appropriate error message.
// If deletion fails at any point, it responds with HTTP 400 and the error message.
// On success, it responds with HTTP 200 and a success message confirming the deletion.
func (fc *FileController) DeleteFile(c *gin.Context) {
	fileId := c.Param("fileId")

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.DeleteFile(fileId, stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessDeletingFile,
	})
}

// TrashCatalog handles the HTTP request to mark a catalog (folder) and all its contents as trashed.
// It expects a "catalogId" parameter in the URL to identify the catalog to be trashed.
// If the catalog ID is missing, it responds with HTTP 400 and an appropriate error message.
// If the trashing operation fails, it responds with HTTP 400 and the error message.
// On success, it responds with HTTP 200 and a success message confirming the catalog was trashed.
func (fc *FileController) TrashCatalog(c *gin.Context) {
	catalogId := c.Param("catalogId")

	if catalogId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrInvalidCatalogData,
		})
		return;
	}

	err := fc.fileService.TrashCatalog(catalogId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessTrashingCatalog,
	})
}

// DeleteCatalog handles the HTTP request to permanently delete a catalog (folder) from the database.
// It expects a "catalogId" parameter in the URL to identify the catalog to be deleted.
// If the catalog ID is missing, it responds with HTTP 400 and an appropriate error message.
// If the deletion operation fails, it responds with HTTP 400 and the error message.
// On success, it responds with HTTP 200 and a success message confirming the deletion of the catalog.
func (fc *FileController) DeleteCatalog(c *gin.Context) {
	catalogId := c.Param("catalogId")

	if catalogId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrInvalidCatalogData,
		})
		return
	}

	err := fc.fileService.DeleteCatalog(catalogId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"message": constants.SuccessDeleteCatalog,
	})

} 

// RestoreFile handles the HTTP request to restore a previously trashed file and its parent catalog structure.
// It expects "fileId" and "parentId" parameters in the URL to identify the file to be restored and its parent folder.
// If any of the required parameters are missing, it responds with HTTP 400 and an appropriate error message.
// If the restore operation fails, it responds with HTTP 400 and the error message.
// On success, it responds with HTTP 200 and a success message confirming the restoration of the file.
func (fc *FileController) RestoreFile(c *gin.Context) {
	fileId := c.Param("fileId")
	parentId := c.Param("parentId")

	if fileId == "" || parentId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrInvalidFileData,
		})
		return
	}

	err := fc.fileService.RestoreFile(fileId, parentId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessRestoreFile,
	})
}

func (fc *FileController) RemoveFavorite(c *gin.Context) {
	fileId := c.Param("fileId")

	if fileId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}
	
	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.RemoveFavorite(fileId, stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrRemoveFavorite,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessRemoveFavorite,
	})

}

func (fc *FileController) AddFavorite(c *gin.Context) {
	fileId := c.Param("fileId")

	if fileId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.AddFavorite(fileId, stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessAddFavorite,
	})

}

func (fc *FileController) HideFile(c *gin.Context) {
	fileId := c.Param("fileId")

	if fileId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.HideFile(fileId, stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessHideFile,
	})
}

func (fc *FileController) RevealFile(c *gin.Context) {
	fileId := c.Param("fileId")

	if fileId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": constants.ErrUnexpected,
		})
		return
	}

	userId, exists := c.Get("stringUserID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": constants.ErrUnauthorized,
		})
		return
	}

	stringUserId := fmt.Sprintf("%s", userId)

	err := fc.fileService.RevealFile(fileId, stringUserId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": constants.SuccessRevealFile,
	})
}