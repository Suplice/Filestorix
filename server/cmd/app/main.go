package main

import (
	"log/slog"
	"os"

	"github.com/Suplice/Filestorix/config"
	"github.com/Suplice/Filestorix/internal/database"
	"github.com/Suplice/Filestorix/internal/server"
)

func main() {
	cfg := config.LoadConfig()	

	db, err := database.Connect(cfg.DatabaseURL)
	defer database.Close(db)

	if err != nil {
		panic(err)
	} 

	err = database.Migrate(db)

	if err != nil {
		panic(err)
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	server := server.NewServer(db, logger)

	server.Run(":5000")

}