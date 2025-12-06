import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { UserPlus, X } from "lucide-react-native";
import { searchUsers, sendFriendRequest } from "@/lib/api/friends";
import { UserDTO } from "@/lib/types/user";
import { RNAvatar, RNButton, RNInput, RNSkeleton } from "../nativeComponents";

type AddFriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddFriend = async (friendId: number) => {
    setSendingRequest((prev) => ({ ...prev, [friendId]: true }));
    const result = await sendFriendRequest(friendId);
    if (result.success) {
      Alert.alert("Success", result.message);
      setSearchResults((prev) => prev.filter((user) => user.ID !== friendId));
    } else {
      Alert.alert("Error", result.message);
      setSendingRequest((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSendingRequest({});
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <UserPlus size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Add New Friend</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>Search for users by username.</Text>

          <View style={styles.searchContainer}>
            <RNInput
              placeholder="Enter username..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ paddingLeft: 12, color: "#ffffff" }}
            />
          </View>

          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View>
                <RNSkeleton
                  style={{ height: 50, marginBottom: 10, width: "100%" }}
                />
                <RNSkeleton style={{ height: 50, width: "100%" }} />
              </View>
            ) : searchResults.length === 0 && searchQuery ? (
              <Text style={styles.infoText}>No users found.</Text>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                  <View style={styles.userRow}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <RNAvatar
                        src={item.avatarURL}
                        fallback={item.username?.substring(0, 2).toUpperCase()}
                        size={32}
                      />
                      <Text style={styles.username}>{item.username}</Text>
                    </View>
                    <RNButton
                      size="sm"
                      variant="outline"
                      title="Add"
                      onPress={() => handleAddFriend(item.ID)}
                      disabled={sendingRequest[item.ID]}
                      icon={
                        !sendingRequest[item.ID] && (
                          <UserPlus
                            size={14}
                            color="#ffffff"
                            style={{ marginRight: 4 }}
                          />
                        )
                      }
                    />
                  </View>
                )}
              />
            )}
          </View>

          <RNButton
            variant="outline"
            title="Close"
            onPress={handleClose}
            style={{ marginTop: 10, borderColor: "#334155" }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#ffffff" },
  description: { color: "#94a3b8", marginBottom: 16 },
  searchContainer: { marginBottom: 16 },
  resultsContainer: { height: 250 },
  infoText: { textAlign: "center", color: "#64748b", marginTop: 20 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  username: {
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 14,
    color: "#ffffff",
  },
});
