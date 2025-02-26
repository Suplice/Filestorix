package dto

type RegisterRequestDTO struct {
	Email           string `json:"email" binding:"required,email,min=5,max=255"`
	Password        string `json:"password" binding:"required,min=6,max=255"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=Password"`
}

type LoginRequestDTO struct {
	Email    string `json:"email" binding:"required,email,min=5,max=255"`
	Password string `json:"password" binding:"required,min=6,max=255"`
}

type GoogleRequestDTO struct {
	Code string `json:"code"`
}

type GoogleAuthTokenResult struct {
	AccessToken string `json:"access_token"`
	IdToken     string `json:"id_token"`
}

type GoogleUser struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Sub     string `json:"sub"`
	Picture string `json:"picture"`
}