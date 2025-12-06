package controllers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Suplice/Filestorix/internal/services"
	"github.com/Suplice/Filestorix/internal/utils/constants"
	"github.com/gin-gonic/gin"
)

type FriendshipController struct {
	service *services.FriendshipService
	logger  *slog.Logger
}

func NewFriendshipController(service *services.FriendshipService, logger *slog.Logger) *FriendshipController {
	return &FriendshipController{service: service, logger: logger}
}

func (fc *FriendshipController) GetAcceptedFriends(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	friends, err := fc.service.GetAcceptedFriends(uint(userID))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "undefined"})
		return
	}
	ctx.JSON(http.StatusOK, friends)
}

func (fc *FriendshipController) GetSentRequests(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	requests, err := fc.service.GetSentRequests(uint(userID))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "undefined"})
		return
	}
	ctx.JSON(http.StatusOK, requests)
}

func (fc *FriendshipController) GetIncomingRequests(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	requests, err := fc.service.GetIncomingRequests(uint(userID))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "undefined"})
		return
	}
	ctx.JSON(http.StatusOK, requests)
}

func (fc *FriendshipController) SearchUsers(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	query := ctx.Query("q") 

	users, err := fc.service.SearchUsers(query, uint(userID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not search users"})
		return
	}

	ctx.JSON(http.StatusOK, users)
}

type SendRequestPayload struct {
	FriendID uint `json:"friendId" binding:"required"`
}

func (fc *FriendshipController) SendFriendRequest(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	var payload SendRequestPayload
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	err := fc.service.SendRequest(uint(userID), payload.FriendID)
	if err != nil {
		if err.Error() == "cannot add yourself as a friend" || err.Error() == "friendship already exists or request is pending" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not send friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Friend request sent successfully"})
}

func (fc *FriendshipController) CancelFriendRequest(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	friendshipIDStr := ctx.Param("friendshipId")
	friendshipID, err := strconv.ParseUint(friendshipIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friendship ID format"})
		return
	}

	err = fc.service.CancelRequest(uint(friendshipID), uint(userID))
	if err != nil {
		if err.Error() == "request not found or you are not authorized to cancel it" {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not cancel friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Friend request cancelled successfully"})
}

type RespondRequestPayload struct {
	Action string `json:"action" binding:"required,oneof=accept decline"` 
}

func (fc *FriendshipController) RespondToFriendRequest(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	friendshipIDStr := ctx.Param("friendshipId")
	friendshipID, err := strconv.ParseUint(friendshipIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friendship ID format"})
		return
	}

	var payload RespondRequestPayload
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	err = fc.service.RespondToRequest(uint(friendshipID), uint(userID), payload.Action)
	if err != nil {
		if err.Error() == "incoming friend request not found or already actioned" || err.Error() == "invalid status provided" || err.Error() == "invalid action" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not respond to friend request"})
		}
		return
	}

	message := "Friend request accepted successfully"
	if payload.Action == "decline" {
		message = "Friend request declined successfully"
	}
	ctx.JSON(http.StatusOK, gin.H{"message": message})
}


func (fc *FriendshipController) RemoveFriend(ctx *gin.Context) {
	userID := ctx.GetUint64("userID")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": constants.ErrUnauthorized})
		return
	}

	friendshipIDStr := ctx.Param("friendshipId") 
	friendshipID, err := strconv.ParseUint(friendshipIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friendship ID format"})
		return
	}

	err = fc.service.RemoveFriend(uint(friendshipID), uint(userID))
	if err != nil {
		if err.Error() == "friendship not found or you are not part of this friendship" {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			fc.logger.Error("Error removing friend", "err", err, "friendshipID", friendshipID, "userID", userID)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not remove friend"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Friend removed successfully"})
}