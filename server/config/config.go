package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
}

// LoadConfig loads the configuration for the application.
// It returns a pointer to a Config struct containing the database URL.
func LoadConfig() *Config {

	if os.Getenv("IN_DOCKER") != "true" {
		if err := godotenv.Load("../../.env"); err != nil {
			log.Println("No .env file found")
		} 
	} 

	databaseUrl := getDatabaseURL()
	
	 return &Config {
		DatabaseURL: databaseUrl,
	 }
}

// getDatabaseURL constructs a database connection URL from environment variables.
// The function prints the constructed URL and returns it as a string.
func getDatabaseURL() string {
	databaseUrl := "host=" + os.Getenv("DATABASE_HOST") +
	" user=" + os.Getenv("DATABASE_USER") + " password=" +
	os.Getenv("DATABASE_PASSWORD") + " dbname=" +
	os.Getenv("DATABASE_NAME") + " port=" +
	os.Getenv("DATABASE_PORT") + " sslmode=" +
	os.Getenv("DATABASE_SSL_MODE")

	println(databaseUrl)
	
	return databaseUrl
}