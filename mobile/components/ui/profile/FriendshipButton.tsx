import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FriendshipStatus } from "@/lib/types/profile";
import {
  sendFriendRequest,
  cancelFriendRequest,
  removeFriend,
  respondToFriendRequest,
} from "@/lib/api/friends";

type FriendshipButtonProps = {
  profileUserId: number;
  friendshipStatus: FriendshipStatus;
  onActionComplete: () => void;
};

export function FriendshipButton({
  profileUserId,
  friendshipStatus,
  onActionComplete,
}: FriendshipButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (
    actionFn: () => Promise<any>,
    confirmMessage?: string
  ) => {
    if (confirmMessage) {
      Alert.alert("Confirmation", confirmMessage, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            await executeAction(actionFn);
          },
        },
      ]);
    } else {
      await executeAction(actionFn);
    }
  };

  const executeAction = async (actionFn: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await actionFn();
      if (result.success) {
        onActionComplete();
      } else {
        Alert.alert("Error", result.message || "Action failed");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.button, styles.buttonLoading]}>
        <ActivityIndicator color="white" size="small" />
      </View>
    );
  }

  switch (friendshipStatus.status) {
    case "friends":
      return (
        <TouchableOpacity
          style={[styles.button, styles.buttonDestructive]}
          onPress={() =>
            handleAction(
              () => removeFriend(friendshipStatus.friendshipId!),
              "Are you sure you want to remove this friend?"
            )
          }
        >
          <Feather
            name="user-minus"
            size={16}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.text}>Remove Friend</Text>
        </TouchableOpacity>
      );

    case "request_sent":
      return (
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() =>
            handleAction(() =>
              cancelFriendRequest(friendshipStatus.friendshipId!)
            )
          }
        >
          <Feather name="x" size={16} color="white" style={styles.icon} />
          <Text style={styles.text}>Cancel Request</Text>
        </TouchableOpacity>
      );

    case "request_received":
      return (
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              { flex: 1, marginRight: 8 },
            ]}
            onPress={() =>
              handleAction(() =>
                respondToFriendRequest(friendshipStatus.friendshipId!, "accept")
              )
            }
          >
            <Feather name="check" size={16} color="white" style={styles.icon} />
            <Text style={styles.text}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDestructive, { flex: 1 }]}
            onPress={() =>
              handleAction(() =>
                respondToFriendRequest(
                  friendshipStatus.friendshipId!,
                  "decline"
                )
              )
            }
          >
            <Feather name="x" size={16} color="white" style={styles.icon} />
            <Text style={styles.text}>Decline</Text>
          </TouchableOpacity>
        </View>
      );

    case "not_friends":
    default:
      return (
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => handleAction(() => sendFriendRequest(profileUserId))}
        >
          <Feather
            name="user-plus"
            size={16}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.text}>Add Friend</Text>
        </TouchableOpacity>
      );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 140,
  },
  buttonLoading: {
    backgroundColor: "#334155",
  },
  buttonPrimary: {
    backgroundColor: "#4f46e5",
  },
  buttonSecondary: {
    backgroundColor: "#475569",
  },
  buttonDestructive: {
    backgroundColor: "#ef4444",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
