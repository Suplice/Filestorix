import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FriendshipInfo } from "@/lib/types/user";
import { Check, X } from "lucide-react-native";
import { respondToFriendRequest } from "@/lib/api/friends";
import { useRouter } from "expo-router";
import { RNAvatar } from "../nativeComponents";

type IncomingRequestItemProps = {
  requestInfo: FriendshipInfo;
  onActionComplete: () => void;
};

export function IncomingRequestItem({
  requestInfo,
  onActionComplete,
}: IncomingRequestItemProps) {
  const router = useRouter();
  const senderData = requestInfo.otherUser;
  const [loadingAction, setLoadingAction] = useState<
    "accept" | "decline" | null
  >(null);

  if (!senderData) return null;

  const fallbackName = senderData.username
    ? senderData.username.substring(0, 2).toUpperCase()
    : "?";

  const handleResponse = async (action: "accept" | "decline") => {
    setLoadingAction(action);
    const result = await respondToFriendRequest(requestInfo.ID, action);
    if (result.success) {
      onActionComplete();
    } else {
      Alert.alert("Error", result.message);
      setLoadingAction(null);
    }
  };

  const handlePressProfile = () => {
    router.push({
      pathname: "/profile/[id]",
      params: { id: senderData?.ID },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressProfile} style={styles.leftSide}>
        <RNAvatar src={senderData.avatarURL} fallback={fallbackName} />
        <View style={styles.info}>
          <Text style={styles.name}>{senderData.username}</Text>
          <Text style={styles.subtext}>wants to be your friend</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn]}
          onPress={() => handleResponse("accept")}
          disabled={!!loadingAction}
        >
          {loadingAction === "accept" ? (
            <ActivityIndicator size="small" color="#22c55e" />
          ) : (
            <Check size={20} color="#22c55e" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.declineBtn]}
          onPress={() => handleResponse("decline")}
          disabled={!!loadingAction}
        >
          {loadingAction === "decline" ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <X size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  leftSide: { flexDirection: "row", alignItems: "center", flex: 1 },
  info: { marginLeft: 12 },
  name: { fontWeight: "600", fontSize: 16, color: "#ffffff" },
  subtext: { fontSize: 12, color: "#94a3b8" },
  actions: { flexDirection: "row", gap: 8 },
  btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  acceptBtn: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  declineBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
});
