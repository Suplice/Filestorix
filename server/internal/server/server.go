package server

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server struct {
	db 			*gorm.DB
	router 		*gin.Engine
}

func NewServer(db *gorm.DB) *Server {

	server := &Server{
		db: db,
		router: gin.Default(),
	}

	server.router.GET("/ping", func(c *gin.Context) { 
		c.String(200, "pong")
		println("pong") 
	})
	

	return server
}

func (s *Server) Run(addr string) error {
	return s.router.Run(addr)
}