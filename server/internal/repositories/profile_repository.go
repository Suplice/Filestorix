package repositories

import (
	"log/slog"

	"github.com/Suplice/Filestorix/internal/dto"
	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/gorm"
)

type ProfileRepository struct {
	db     *gorm.DB
	logger *slog.Logger
}

func NewProfileRepository(_db *gorm.DB, _logger *slog.Logger) *ProfileRepository {
	return &ProfileRepository{db: _db, logger: _logger}
}

// GetProfileData pobiera wszystkie dane potrzebne do strony profilu
func (pr *ProfileRepository) GetProfileData(profileUserID, currentUserID uint) (*dto.ProfileDTO, error) {
	var profileUser models.User
	// 1. Pobierz pełne dane użytkownika, którego profil oglądamy
	if err := pr.db.First(&profileUser, profileUserID).Error; err != nil {
		pr.logger.Error("User not found for profile", "err", err, "userID", profileUserID)
		return nil, err // Zwróć błąd, jeśli użytkownik nie istnieje
	}

	// 2. Oblicz zagregowane statystyki (ukończone zadania, błędy)
	var totalCompleted, totalMistakes int64
	pr.db.Model(&models.UserTaskProgress{}).Where("user_id = ? AND is_completed = ?", profileUserID, true).Count(&totalCompleted)
	pr.db.Model(&models.UserTaskProgress{}).Where("user_id = ?", profileUserID).Select("COALESCE(SUM(mistakes), 0)").Scan(&totalMistakes)

	// 3. Pobierz wszystkie zadania z postępem tego użytkownika (podobne do GetAllTasksForUserDTO)
	var tasks []models.Task
	if err := pr.db.Preload("UserProgress", "user_id = ?", profileUserID).Find(&tasks).Error; err != nil {
		return nil, err
	}
	tasksDTO := make([]dto.TaskForUserDTO, len(tasks))
	for i, t := range tasks {
		var progress *models.UserTaskProgress
		if len(t.UserProgress) > 0 {
			progress = &t.UserProgress[0]
		}
		tasksDTO[i] = dto.TaskForUserDTO{
			ID:           t.ID,
			Title:        t.Title,
			Language:     t.Language,
			Difficulty:   t.Difficulty,
			Points:       t.Points,
			XP:           t.XP,
			UserProgress: progress,
		}
	}


	// 4. Określ status znajomości, jeśli oglądamy profil kogoś innego
	var friendshipStatus *dto.FriendshipStatusDTO
	if profileUserID != currentUserID {
		var friendship models.Friendship
		err := pr.db.Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
			currentUserID, profileUserID, profileUserID, currentUserID).
			First(&friendship).Error

		if err != nil && err != gorm.ErrRecordNotFound {
			return nil, err // Prawdziwy błąd bazy danych
		}

		if err == gorm.ErrRecordNotFound {
			friendshipStatus = &dto.FriendshipStatusDTO{Status: "not_friends"}
		} else {
			status := ""
			if friendship.Status == "accepted" {
				status = "friends"
			} else if friendship.Status == "pending" {
				if friendship.UserID == currentUserID {
					status = "request_sent" // My wysłaliśmy
				} else {
					status = "request_received" // My otrzymaliśmy
				}
			}
			friendshipStatus = &dto.FriendshipStatusDTO{
				Status:       status,
				FriendshipID: friendship.ID, // Dołącz ID do akcji
			}
		}
	}

	// 5. Złóż DTO
	profileDTO := &dto.ProfileDTO{
		User:               profileUser,
		TotalCompleted:     totalCompleted,
		TotalMistakes:      totalMistakes,
		TasksWithProgress:  tasksDTO,
		FriendshipWithView: friendshipStatus,
	}

	return profileDTO, nil
}