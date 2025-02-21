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

// NewServer creates a new instance of the Server struct, initializes the router with default settings,
// sets up CORS middleware with specified configuration, and sets up authentication routes.
// It takes a gorm.DB instance for database operations and a slog.Logger instance for logging.
// The function returns a pointer to the newly created Server instance.
//
// Parameters:
//   - db: A pointer to a gorm.DB instance for database operations.
//   - logger: A pointer to a slog.Logger instance for logging.
//
// Returns:
//   - A pointer to the newly created Server instance.
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

// Run starts the server on the specified address.
// It uses the router to handle incoming requests.
//
// Parameters:
//   addr - The address to listen on, in the form "host:port".
//
// Returns:
//   An error if the server fails to start.
func (s *Server) Run(addr string) error {
	return s.router.Run(addr)
}