package server

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server struct {
	db 			*gorm.DB
	router 		*gin.Engine
}

func NewServer(db *gorm.DB, logger *slog.Logger) *Server {

	server := &Server{
		db: db,
		router: gin.Default(),
	}

	server.router.Use(cors.New(cors.Config{
		AllowOrigins: 		[]string{"http://localhost:3000"},
		AllowMethods: 		[]string{"GET","POST","PUT","DELETE","PATCH","OPTIONS"},
		AllowHeaders: 		[]string{"Origin","Content-Type","Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupAuthRoutes(server.router, server.db, logger)
	

	return server
}

func (s *Server) Run(addr string) error {
	return s.router.Run(addr)
}