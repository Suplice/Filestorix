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

type OAuthRequestDTO struct {
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

type GithubAuthTokenResult struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
}

type GithubUser struct {
	Email    string `json:"email"`
	GithubID int    `json:"id"`
	Username string `json:"login"`
	Picture  string `json:"avatar_url"`
}

type GithubEmails struct {
	Email      string `json:"email"`
	Primary    bool   `json:"primary"`
	Verified   bool   `json:"verified"`
	Visibility string `json:"visibility"`
}