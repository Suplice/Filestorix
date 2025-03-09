package dto

type AddCatalogRequest struct {
	Name     string `json:"name" binding:"required"`
	ParentID *uint  `json:"parentId"`
}

type RenameFileRequest struct {
	Name   string `json:"name" binding:"required"`
	FileId uint   `json:"fileId" binding:"required"`
}

type TrashFileRequest struct {
	UserId string `json:"userId" binding:"required"`
}