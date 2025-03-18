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

	if err := CreateActivityLog(tx, userId, &fileToUpload.ID, "UPLOAD", "Uploaded file to drive."); err != nil {
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

	tx.Model(&models.ActivityLog{})

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

	tx := fr.db.Begin()

	if tx.Error != nil {
		return nil, errors.New(constants.ErrUnexpected)
	}

	result := tx.Create(catalog)

	if result.Error != nil {
		tx.Rollback()
		return nil, errors.New(constants.ErrDBUnknown)
	}

	err = CreateActivityLog(tx, catalog.UserID, &catalog.ID, "CREATE", "Created catalog")

	if err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	return catalog, nil
}

// RenameFile updates the name of a file in the database identified by the given fileId.
// It returns an error if the update operation fails.
func (fr *FileRepository) RenameFile(fileId uint, name string, userId uint) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("name", name)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(result.Error.Error())
	}

	err := CreateActivityLog(tx, userId, &fileId, "RENAME", fmt.Sprintf("Renamed file to %s", name))

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

// TrashFile marks a file as trashed in the database by setting the "is_trashed" field to true.
// It takes a fileId as a parameter, which is the unique identifier of the file to be trashed.
// If the operation is successful, it returns nil. Otherwise, it returns an error indicating the failure.
func (fr *FileRepository) TrashFile(fileId uint, userId uint) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_trashed", true)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrDBUnknown)
	}

	err := CreateActivityLog(tx, userId, &fileId, "TRASH", "File was trashed")

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

// DeleteFile permanently deletes a file record from the database and removes the corresponding file from disk.
// It takes fileId, userId, and extension as parameters, which identify the file and its location on disk.
// The operation is wrapped in a transaction to ensure consistency between the database and filesystem.
// Returns nil if successful, or an error if any step of deletion fails.
func (fr *FileRepository) DeleteFile(fileId uint, userId string, extension string) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Where("id = ?", fileId).Delete(&models.UserFile{})

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrDeletingFile)
	}

	err := DeleteFileFromDisk(fileId, userId, extension)

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

// DeleteFileFromDisk removes a file from the disk based on fileId, userId, and extension.
// It searches for files matching the pattern and attempts to delete them.
// Returns nil if successful or if no matching files are found, otherwise returns an error.
func DeleteFileFromDisk(fileId uint, userId string, extension string) error {
	stringFileId := fmt.Sprintf("%d", fileId)

	dirPath := "/server/uploads/"

	pattern := filepath.Join(dirPath, userId, stringFileId + extension) 

	files, err := filepath.Glob(pattern)
	if err != nil {
		return errors.New(constants.ErrDeletingFile)
	}

	if len(files) == 0 {
		return nil
	}

	for _, file := range files {
		err := os.Remove(file)
		if err != nil {
			fmt.Printf("Error deleting file %s: %v\n", file, err)
			return errors.New(constants.ErrDeletingFile)
		} else {
			fmt.Printf("File %s deleted successfully\n", file)
		}
	}
	return nil
}

// GetFile retrieves a file record from the database by its fileId.
// It takes a fileId as a string and returns a pointer to UserFile if found, otherwise an error.
// Returns an error if the file does not exist or if there is a database issue.
func (fr *FileRepository) GetFile(fileId string) (*models.UserFile, error) {
	var file *models.UserFile


	result := fr.db.Where("id = ?", fileId).First(&file)
	
	if result.Error != nil {
		return nil, errors.New(constants.ErrUnauthorized)
	}

	return file, nil

}

// TrashCatalog marks a catalog (folder) and all of its children (recursively) as trashed in the database.
// It takes catalogId as a parameter, which is the unique identifier of the catalog to be trashed.
// The operation is wrapped in a transaction to ensure that either all related records are updated or none.
// Returns nil if successful, or an error if any step fails.
func (fr *FileRepository) TrashCatalog(catalogId string) error {
	tx := fr.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}


	var catalog models.UserFile
	if err := tx.Where("id = ?", catalogId).First(&catalog).Error; err != nil {
		tx.Rollback()
		return err
	}


	if err := tx.Model(&models.UserFile{}).Where("id = ?", catalog.ID).Update("is_trashed", true).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := CreateActivityLog(tx, catalog.UserID, &catalog.ID, "TRASH", "Catalog was trashed."); err != nil {
		tx.Rollback()
		return err
	}


	if err := fr.trashChildrenRecursively(tx, catalog.ID); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}


// trashChildrenRecursively marks all child files and catalogs of a given parentId as trashed recursively.
// It is an internal helper function used by TrashCatalog to handle nested structures.
// Returns nil if successful, or an error if any child update fails.
func (fr *FileRepository) trashChildrenRecursively(tx *gorm.DB, parentId uint) error {
	var children []models.UserFile
	if err := tx.Where("parent_id = ?", parentId).Find(&children).Error; err != nil {
		return err
	}

	for _, child := range children {

		if err := tx.Model(&models.UserFile{}).Where("id = ?", child.ID).Update("is_trashed", true).Error; err != nil {
			return err
		}

		if child.Type == "CATALOG" {
			if err := CreateActivityLog(tx, child.UserID, &child.ID, "TRASH", "Catalog was trashed"); err != nil {
				tx.Rollback()
				return err
			}

			if err := fr.trashChildrenRecursively(tx, child.ID); err != nil {
				return err
			}
		} else {
			if err := CreateActivityLog(tx, child.UserID, &child.ID, "TRASH", "File was trashed"); err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return nil
}

// DeleteCatalog permanently deletes a catalog (folder) record from the database.
// Before deletion, it sets the parent_id of all children to null to prevent orphan references.
// The operation is wrapped in a transaction to maintain data integrity.
// Takes catalogId as a parameter, which is the ID of the catalog to delete.
// Returns nil if successful, or an error if any operation fails.
func (fr *FileRepository) DeleteCatalog(catalogId string) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUnexpected)
	}

	fileResult := tx.Model(&models.UserFile{}).Where("parent_id = ?", catalogId).Update("parent_id", nil)

	if fileResult.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrDeleteCatalog)
	}

	result := tx.Where("id = ?", catalogId).Delete(&models.UserFile{})

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrDeleteCatalog)
	}

	tx.Commit()

	return nil
}

// RestoreFile restores a file from the trash by setting its "is_trashed" field to false.
// Additionally, it restores all parent directories of that file (recursively up) if they are also trashed.
// It takes fileId and parentId as parameters. parentId is not directly used but can be kept for possible future use.
// The operation is wrapped in a transaction to ensure atomicity.
// Returns nil if successful, or an error if any operation fails.
func (fr *FileRepository) RestoreFile(fileId string, parentId string) error {
	var file *models.UserFile

	tx := fr.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Where("id = ?", fileId).First(&file)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUnexpected)
	}

	fileResult := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_trashed", false)

	if fileResult.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrRestoreFile)
	}

	if file.Type == "CATALOG" {
		if err := CreateActivityLog(tx, file.UserID, &file.ID, "RESTORE", "Catalog restored successfully"); err != nil {
			tx.Rollback()
			return err
		}
	} else {
		if err := CreateActivityLog(tx, file.UserID, &file.ID, "RESTORE", "File restored successfully"); err != nil {
			tx.Rollback()
			return err
		}
	}

	

	currentParentId := file.ParentID


	for currentParentId != nil  {

		var parentFile models.UserFile

		result = tx.Where("id = ?", currentParentId).First(&parentFile)

		if result.Error != nil {
			tx.Rollback()
			fmt.Println("error", result.Error.Error())
			return errors.New(constants.ErrRestoreFile)
		}

		result = tx.Model(&models.UserFile{}).Where("id = ?", parentFile.ID).Update("is_trashed", false)

		if result.Error != nil {
			tx.Rollback()
			fmt.Println("error", result.Error.Error())
			return errors.New(constants.ErrRestoreFile)
		}

		if err := CreateActivityLog(tx, file.UserID, &file.ID, "RESTORE", "Catalog restored successfully"); err != nil {
			tx.Rollback()
			return err
		}

		currentParentId = parentFile.ParentID
	}

	tx.Commit()

	return nil

}

func (fr *FileRepository) RemoveFavorite(fileId uint, userId uint) error {

	tx := fr.db.Begin()


	if tx.Error != nil {
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_favorite", false)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrRemoveFavorite)
	}


	if err := CreateActivityLog(tx, userId, &fileId, "FAVORITE", "Removed favorite mark from file"); err != nil {
		tx.Rollback()
		return err
	}


	tx.Commit()
	return nil
}

func (fr *FileRepository) AddFavorite(fileId uint, userId uint) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_favorite", true)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrAddFavorite)
	}

	if err := CreateActivityLog(tx, userId, &fileId, "FAVORITE", "Marked file as favorite"); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

func (fr *FileRepository) HideFile(fileId uint, userId uint) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_hidden", true)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrHideFile)
	}

	if err := CreateActivityLog(tx, userId, &fileId, "HIDE", "Marked file as hidden"); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

func (fr *FileRepository) RevealFile(fileId uint, userId uint) error {

	tx := fr.db.Begin()

	if tx.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrUnexpected)
	}

	result := tx.Model(&models.UserFile{}).Where("id = ?", fileId).Update("is_hidden", false)

	if result.Error != nil {
		tx.Rollback()
		return errors.New(constants.ErrRevealFile)
	}

	if err := CreateActivityLog(tx, userId, &fileId, "REVEAL", "Revealed file from being hidden"); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}


func CreateActivityLog(tx *gorm.DB, userId uint, fileId *uint, action, details string ) error {
	activityLog := models.ActivityLog {
		UserID: userId,
		FileID: fileId,
		Action: action,
		Details: details,
	}

	if err := tx.Create(&activityLog).Error; err != nil {
		return errors.New(constants.ErrUnexpected)
	}

	return nil
}