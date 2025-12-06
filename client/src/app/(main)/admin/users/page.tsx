"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Trash2,
  Loader2,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { searchUsers } from "@/lib/api/friends";
import { deleteUser, getAllUsers } from "@/lib/api/admin";
import { UserDTO } from "@/lib/types/user";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-background border border-border w-full max-w-md rounded-lg shadow-lg p-6 space-y-4 animate-in zoom-in-95 duration-200"
        role="alertdialog"
      >
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-destructive font-semibold text-lg">
            <AlertTriangle className="w-6 h-6" />
            {title}
          </div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterResults = useCallback(
    (data: UserDTO[]) => {
      if (!currentUser) return data;
      return data.filter((u) => u.ID !== currentUser.ID);
    },
    [currentUser]
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = await getAllUsers();
    setUsers(filterResults(results || []));
    setLoading(false);
  }, [filterResults]);

  const fetchSearchResults = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      const results = await searchUsers(searchQuery);
      setUsers(filterResults(results || []));
      setLoading(false);
    },
    [filterResults]
  );

  useEffect(() => {
    if (!currentUser) return;

    if (query.length > 0) setIsTyping(true);

    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults(query);
      } else {
        fetchAll();
      }
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentUser, fetchAll, fetchSearchResults]);

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    const result = await deleteUser(userToDelete.ID);

    if (result.message) {
      toast.success(result.message);
      setUsers((prev) => prev.filter((u) => u.ID !== userToDelete.ID));
    } else {
      toast.error(result.error || "Failed to delete user");
    }

    setIsDeleting(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleRefresh = () => {
    setQuery("");
    if (query === "") fetchAll();
  };

  return (
    <div>
      <div className="w-full space-y-6 p-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isTyping}
          >
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${
                loading || isTyping ? "animate-spin" : ""
              }`}
            />
            Reset
          </Button>
        </div>

        <div className="flex gap-2 max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by username..."
              className="pl-8"
              value={query}
              onChange={handleInputChange}
            />
            {(isTyping || (loading && query)) && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Level / Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && !isTyping && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading
                      users...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading && !isTyping && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}

              {users.map((user) => (
                <TableRow
                  key={user.ID}
                  className={isTyping ? "opacity-50 transition-opacity" : ""}
                >
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarURL || undefined} />
                      <AvatarFallback>
                        {user.username
                          ? user.username.slice(0, 2).toUpperCase()
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{user.ID}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>Lvl {user.level}</span>
                      <span className="text-muted-foreground text-xs">
                        {user.points} pts
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        title="Delete User?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <strong className="text-foreground">
              {userToDelete?.username}
            </strong>{" "}
            and remove all their data (progress, badges, settings).
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setUserToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
