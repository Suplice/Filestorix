package dto

type AddCatalogRequest struct {
	Name     string `json:"name" binding:"required"`
	ParentID *uint  `json:"parentId"`
}
