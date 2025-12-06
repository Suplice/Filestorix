import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, deleteUser } from "@/lib/api/admin";
import { searchUsers } from "@/lib/api/friends";
import { UserDTO } from "@/lib/types/user";
import { RNInput, RNAvatar, RNSkeleton } from "@/components/nativeComponents";
import { Search, Trash2, ArrowLeft, RefreshCcw } from "lucide-react-native";
import { ConfirmationModal } from "@/components/admin/ConfirmationModalProps";

export default function AdminUsersScreen() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getAllUsers();
      const filtered = (results || []).filter((u) => u.ID !== currentUser?.ID);
      setUsers(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  const fetchSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const results = await searchUsers(q);
        const filtered = (results || []).filter(
          (u) => u.ID !== currentUser?.ID
        );
        setUsers(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) fetchSearch(query);
      else fetchAll();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteUser(userToDelete.ID);
      if (result.message) {
        setUsers((prev) => prev.filter((u) => u.ID !== userToDelete.ID));
        setUserToDelete(null);
      } else {
        Alert.alert("Error", result.error || "Failed to delete user");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setQuery("");
    fetchAll();
  };

  const renderItem = ({ item }: { item: UserDTO }) => (
    <View style={styles.row}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <RNAvatar
          src={item.avatarURL}
          fallback={item.username?.substring(0, 2).toUpperCase()}
          size={40}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.details}>
            ID: {item.ID} • Lvl {item.level}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setUserToDelete(item)}
        style={styles.deleteBtn}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Users</Text>
        </View>
        <TouchableOpacity onPress={onRefresh}>
          <RefreshCcw size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={{ marginRight: 10 }} />
        <RNInput
          placeholder="Search by username..."
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            borderWidth: 0,
            backgroundColor: "transparent",
            height: 40,
          }}
        />
      </View>

      {loading && !refreshing ? (
        <View style={{ padding: 16 }}>
          <RNSkeleton style={{ height: 60, marginBottom: 10, width: "100%" }} />
          <RNSkeleton style={{ height: 60, width: "100%" }} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
          }
        />
      )}

      <ConfirmationModal
        visible={!!userToDelete}
        title="Delete User?"
        message={`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setUserToDelete(null)}
        isLoading={isDeleting}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  username: { color: "#fff", fontWeight: "600", fontSize: 16 },
  details: { color: "#94a3b8", fontSize: 12 },
  deleteBtn: { padding: 8 },
  emptyText: { color: "#94a3b8", textAlign: "center", marginTop: 20 },
});
