package dto

type RegisterRequestDTO struct {
	Email           string `json:"email" binding:"required,email,min=5,max=255"`
	Password        string `json:"password" binding:"required,min=6,max=255"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=Password"`
}