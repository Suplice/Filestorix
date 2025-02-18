package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
}

func LoadConfig() *Config {

	err := godotenv.Load("../../.env")

	if err != nil {
		panic(err)
	}

	databaseUrl := "host=" + os.Getenv("DATABASE_HOST") +
		" user=" + os.Getenv("DATABASE_USER") + " password=" +
		os.Getenv("DATABASE_PASSWORD") + " dbname=" +
		os.Getenv("DATABASE_NAME") + " port=" +
		os.Getenv("DATABASE_PORT") + " sslmode=" +
		os.Getenv("DATABASE_SSL_MODE")

		println(databaseUrl)

	 return &Config {
		DatabaseURL: databaseUrl,
	 }
}