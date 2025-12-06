import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { FriendshipInfo } from "@/lib/types/user";
import { X, Trash2 } from "lucide-react-native";
import { cancelFriendRequest, removeFriend } from "@/lib/api/friends";
import { useRouter } from "expo-router";
import { RNAvatar, RNBadge, RNButton } from "../nativeComponents";

type FriendListItemProps = {
  friendshipInfo: FriendshipInfo;
  onActionComplete: () => void;
};

export function FriendListItem({
  friendshipInfo,
  onActionComplete,
}: FriendListItemProps) {
  const router = useRouter();
  const otherUserData = friendshipInfo.otherUser;
  const [loading, setLoading] = useState(false);

  if (!otherUserData) return null;

  const fallbackName = otherUserData.username
    ? otherUserData.username.substring(0, 2).toUpperCase()
    : "?";

  const handlePressProfile = () => {
    router.push({
      pathname: "/profile/[id]",
      params: { id: otherUserData.ID },
    });
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    const result = await cancelFriendRequest(friendshipInfo.ID);
    if (result.success) {
      Alert.alert("Success", result.message);
      onActionComplete();
    } else {
      Alert.alert("Error", result.message);
    }
    setLoading(false);
  };

  const handleRemoveFriend = async () => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${otherUserData.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const result = await removeFriend(friendshipInfo.ID);
            if (result.success) {
              onActionComplete();
            } else {
              Alert.alert("Error", result.message);
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handlePressProfile} style={styles.container}>
      <View style={styles.leftSide}>
        <RNAvatar src={otherUserData.avatarURL} fallback={fallbackName} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUserData.username}
          </Text>
          <Text style={styles.details} numberOfLines={1}>
            Lv. {otherUserData.level} • {otherUserData.points} pts
          </Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        {friendshipInfo.status === "pending" && (
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ marginBottom: 4 }}>
              <RNBadge text="Pending" />
            </View>
            <RNButton
              size="sm"
              variant="destructive"
              title="Cancel"
              onPress={handleCancelRequest}
              disabled={loading}
              icon={<X size={12} color="#fff" style={{ marginRight: 4 }} />}
              style={{ height: 32, paddingVertical: 4 }}
            />
          </View>
        )}

        {friendshipInfo.status === "accepted" && (
          <RNButton
            size="sm"
            variant="destructive"
            onPress={handleRemoveFriend}
            disabled={loading}
            icon={<Trash2 size={16} color="#fff" />}
            style={{ width: 36, height: 36, paddingHorizontal: 0 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  info: { marginLeft: 12, flex: 1 },
  name: {
    fontWeight: "600",
    fontSize: 16,
    color: "#ffffff",
  },
  details: {
    fontSize: 12,
    color: "#94a3b8",
  },
  rightSide: { flexDirection: "row", alignItems: "center" },
});
