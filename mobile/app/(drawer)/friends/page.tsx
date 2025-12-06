import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAcceptedFriends,
  fetchSentRequests,
  fetchIncomingRequests,
} from "@/lib/api/friends";
import { FriendshipInfo } from "@/lib/types/user";
import { UserPlus } from "lucide-react-native";
import { RNButton, RNSkeleton } from "@/components/nativeComponents";
import { FriendListItem } from "@/components/friends/FriendListItem";
import { IncomingRequestItem } from "@/components/friends/IncomingRequestItem";
import { AddFriendModal } from "@/components/friends/AddFriendModal";
import { Stack } from "expo-router";

export default function FriendsScreen() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendshipInfo[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendshipInfo[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendshipInfo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllFriendData = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user) return;
      if (showLoadingSpinner) setLoading(true);

      try {
        const [acceptedData, sentData, incomingData] = await Promise.all([
          fetchAcceptedFriends(),
          fetchSentRequests(),
          fetchIncomingRequests(),
        ]);

        setFriends(
          acceptedData?.sort((a, b) =>
            a.otherUser.username.localeCompare(b.otherUser.username)
          ) ?? []
        );
        setSentRequests(
          sentData?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) ?? []
        );
        setIncomingRequests(
          incomingData?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) ?? []
        );
      } catch (error) {
        console.error("Error loading friend data:", error);
        Alert.alert("Error", "Failed to load friend lists. Please try again.");
        setFriends([]);
        setSentRequests([]);
        setIncomingRequests([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      loadAllFriendData(true);
    } else {
      setLoading(false);
      setFriends([]);
    }
  }, [user, loadAllFriendData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllFriendData(false);
  };

  const handleActionComplete = () => {
    loadAllFriendData(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Friends",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        {user && (
          <RNButton
            onPress={() => setIsModalOpen(true)}
            title="Add Friend"
            icon={
              <UserPlus size={16} color="#fff" style={{ marginRight: 6 }} />
            }
            size="sm"
            style={{ backgroundColor: "#4f46e5" }}
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={{ marginBottom: 20 }}>
                <RNSkeleton
                  style={{ width: 150, height: 24, marginBottom: 10 }}
                />
                <RNSkeleton
                  style={{ width: "100%", height: 70, marginBottom: 8 }}
                />
                <RNSkeleton style={{ width: "100%", height: 70 }} />
              </View>
            ))}
          </View>
        ) : user ? (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Incoming Requests{" "}
                <Text style={{ color: "#6366f1" }}>
                  ({incomingRequests.length})
                </Text>
              </Text>
              {incomingRequests.length === 0 ? (
                <Text style={styles.emptyText}>
                  No incoming friend requests.
                </Text>
              ) : (
                <View style={styles.listCard}>
                  {incomingRequests.map((requestInfo, index) => (
                    <IncomingRequestItem
                      key={requestInfo.ID}
                      requestInfo={requestInfo}
                      onActionComplete={handleActionComplete}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Your Friends{" "}
                <Text style={{ color: "#6366f1" }}>({friends.length})</Text>
              </Text>
              {friends.length === 0 ? (
                <Text style={styles.emptyText}>
                  You haven&apos;t added any friends yet.
                </Text>
              ) : (
                <View style={styles.listCard}>
                  {friends.map((friendshipInfo) => (
                    <FriendListItem
                      key={friendshipInfo.ID}
                      friendshipInfo={friendshipInfo}
                      onActionComplete={handleActionComplete}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Sent Requests{" "}
                <Text style={{ color: "#6366f1" }}>
                  ({sentRequests.length})
                </Text>
              </Text>
              {sentRequests.length === 0 ? (
                <Text style={styles.emptyText}>No pending requests sent.</Text>
              ) : (
                <View style={styles.listCard}>
                  {sentRequests.map((requestInfo) => (
                    <FriendListItem
                      key={requestInfo.ID}
                      friendshipInfo={requestInfo}
                      onActionComplete={handleActionComplete}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>
            Please log in to see your friends.
          </Text>
        )}
      </ScrollView>

      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          handleActionComplete();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#ffffff" },
  scrollContent: { padding: 16 },
  loadingContainer: { marginTop: 20 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 20,
  },
});
