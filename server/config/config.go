package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
}

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