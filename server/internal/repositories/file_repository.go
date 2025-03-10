package repositories

import (
	"errors"
	"fmt"
	"io"
	"log/slog"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

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

// UploadFiles uploads multiple files for a given user to a specified folder.
// It begins a database transaction for each file, handles the file upload,
// commits the transaction, and appends the uploaded file information to the result slice.
func (fr *FileRepository) UploadFiles(userId uint, files []*multipart.FileHeader, userFolder string, parentId *uint) ([]*models.UserFile, error) {
	var uploadedFiles []*models.UserFile



	for _, fileHeader := range files {

		tx := fr.db.Begin()

		if tx.Error != nil {
			return nil, errors.New(constants.ErrFailedSaving)
		}

		fileToUpload, err := handleUpload(fileHeader, userFolder, userId, tx, parentId)

		if err != nil {
			return nil, err
		}

		tx.Commit()

		uploadedFiles = append(uploadedFiles, fileToUpload)
	}
	

	return uploadedFiles, nil
}




// handleUpload handles the process of uploading a file. It performs the following steps:
// Checks if the file already exists for the user.
// If the file exists, it rolls back the transaction and returns an error.
// If the file does not exist, it creates a new UserFile model and uploads it to the database.
func handleUpload(fileHeader *multipart.FileHeader, userFolder string, userId uint, tx *gorm.DB, parentId *uint) (*models.UserFile, error) {
	fileName := fileHeader.Filename

	filePath := filepath.Join(userFolder, fileName)

	extension := filepath.Ext(fileHeader.Filename)

	name := strings.Split(filepath.Base(fileHeader.Filename), ".")[0]

	exists, err := FileExists(userId, fileName, tx, parentId)

	if err != nil || exists {
		tx.Rollback()
		return nil, errors.New(constants.ErrFileAlreadyExists)
	}

	fileToUpload := &models.UserFile{
		UserID : userId,
		Name: name,
		Extension: extension,
		Type: "FILE",
		Size: fileHeader.Size,
		Path: filePath,
		IsTrashed: false,
		ParentID: parentId,
		IsFavorite: false,
	}

	if err := UploadFileToDatabase(fileToUpload, tx); err != nil {
		tx.Rollback()
		return nil, err
	}

	stringFileId := fmt.Sprintf("%d", fileToUpload.ID)

	filePath = filepath.Join(userFolder, stringFileId + extension)

	fmt.Println("stringFileId", filePath)

	if err := saveFileToDisk(fileHeader, filePath); err != nil {
		tx.Rollback()
		return nil, err
	}

	return fileToUpload, nil
}

// saveFileToDisk saves the uploaded file to the specified file path on disk.
// It checks if the file already exists at the given path and returns an error if it does.
// It also handles errors related to file corruption and failure during the saving process.
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

	_,err = io.Copy(dst, src)


	if err != nil {
		return errors.New(constants.ErrFileIsCorrupt)
	}

	return nil
}

// FileExists checks if a file with the given name exists for a specific user in the database.
// It returns true if the file exists, otherwise false. If an error occurs during the database query,
// it returns the error.
func FileExists(userId uint, fileName string, db *gorm.DB, parentId *uint) (bool, error) {
	var count int64

	fmt.Print("userId", userId, "fileName", fileName, "parentId", parentId)


	query := db.Model(&models.UserFile{}).
    Where("user_id = ? AND name = ?", userId, fileName)

	if parentId == nil {
		query = query.Where("parent_id IS NULL")
	} else {
		query = query.Where("parent_id = ?", parentId)
	}

	err := query.Count(&count).Error


	fmt.Print("count", count)

	return count > 0, err

}

// UploadFileToDatabase uploads a file record to the database.
func UploadFileToDatabase(fileToUpload *models.UserFile, tx *gorm.DB) error {

	result := tx.Create(fileToUpload)

	if result.Error != nil {
		return errors.New(constants.ErrDBUnknown)
	}

	return nil
}


// CreateCatalog creates a new catalog (directory) in the file repository.
// It first checks if a catalog with the same name already exists for the user
// in the specified parent directory. If it does, an error is returned.
// If the catalog does not exist, it is created in the database.
func (fr *FileRepository) CreateCatalog(catalog *models.UserFile) (*models.UserFile, error) {

	exists, err := FileExists(catalog.UserID, catalog.Name, fr.db, catalog.ParentID)

	if err != nil || exists {
		return nil, errors.New(constants.ErrFileAlreadyExists)
	}

	result := fr.db.Create(catalog)

	if result.Error != nil {
		return nil, errors.New(constants.ErrDBUnknown)
	}

	return catalog, nil
}

func (fr *FileRepository) RenameFile(fileId uint, name string) error {
	result := fr.db.Model(&models.UserFile{}).Where("id = ?", fileId).Update("name", name)

	if result.Error != nil {
		return errors.New(result.Error.Error())
	}

	return nil
}

func (fr *FileRepository) TrashFile(fileId uint) error {
	result := fr.db.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_trashed", true)

	if result.Error != nil {
		return errors.New(constants.ErrDBUnknown)
	}

	return nil
}