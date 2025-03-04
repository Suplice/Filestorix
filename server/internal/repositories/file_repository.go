package repositories

import (
	"errors"
	"log/slog"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/Suplice/Filestorix/internal/models"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"gorm.io/gorm"
)

type FileRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewFileRepository(_db *gorm.DB, _logger *slog.Logger) *FileRepository {
	return &FileRepository{db: _db, logger: _logger}
}

// FetchAllUserFiles retrieves all files associated with a specific user from the database.
// It takes a userId as an input parameter and returns a slice of pointers to UserFile models
// and an error if any occurs during the database query.
func (fr *FileRepository) FetchAllUserFiles(userId uint) ([]*models.UserFile, error) {
	var files []*models.UserFile
	result := fr.db.Where("user_id = ?", userId).Find(&files)
	
	if result.Error != nil {
		return nil, constants.ParseDBError(result.Error, "file")
	}

	return files, nil
}

func (fr *FileRepository) UploadFiles(userId uint, files []*multipart.FileHeader, userFolder string) ([]*models.UserFile, error) {
	var uploadedFiles []*models.UserFile



	for _, fileHeader := range files {

		tx := fr.db.Begin()

		if tx.Error != nil {
			return nil, errors.New(constants.ErrFailedSaving)
		}

		fileToUpload, err := handleUpload(fileHeader, userFolder, userId, tx)

		if err != nil {
			return nil, err
		}

		tx.Commit()

		uploadedFiles = append(uploadedFiles, fileToUpload)
	}
	

	return uploadedFiles, nil
}




func handleUpload(fileHeader *multipart.FileHeader, userFolder string, userId uint, tx *gorm.DB) (*models.UserFile, error) {
	fileName := fileHeader.Filename
	filePath := filepath.Join(userFolder, fileName)


	exists, err := FileExists(userId, fileName, tx)

	if err != nil || exists {
		tx.Rollback()
		return nil, errors.New(constants.ErrFileAlreadyExists)
	}

	fileToUpload := &models.UserFile{
		UserID : userId,
		Name: fileHeader.Filename,
		Type: "FILE",
		Size: fileHeader.Size,
		Path: filePath,
		IsTrashed: false,
		ParentID: nil,
	}

	if err := UploadFileToDatabase(fileToUpload, tx); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := saveFileToDisk(fileHeader, filePath); err != nil {
		tx.Rollback()
		return nil, err
	}

	return fileToUpload, nil
}

func saveFileToDisk(fileHeader *multipart.FileHeader, filePath string) error {
	if _, err := os.Stat(filePath); err == nil {
		return errors.New(constants.ErrFileAlreadyExists)
	}

	src, err := fileHeader.Open()
	if err != nil {
		return errors.New(constants.ErrFileIsCorrupt)
	}

	defer src.Close()

	dst, err := os.Create(filePath)
	if err != nil {
		return errors.New(constants.ErrFailedSaving)
	}

	defer dst.Close()

	_, err = dst.ReadFrom(src)

	if err != nil {
		return errors.New(constants.ErrFileIsCorrupt)
	}

	return nil
}

func FileExists(userId uint, fileName string, db *gorm.DB) (bool, error) {
	var count int64

	err := db.Model(&models.UserFile{}).Where("user_id = ? AND name = ?", userId, fileName).Count(&count).Error

	return count > 0, err

}

func UploadFileToDatabase(fileToUpload *models.UserFile, tx *gorm.DB) error {

	result := tx.Create(fileToUpload)

	if result.Error != nil {
		return errors.New(constants.ErrDBUnknown)
	}

	return nil
}