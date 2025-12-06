import { BaseResponse } from "@/lib/types/common";
import { UserDTO } from "../types/user";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type SystemStats = {
  total_users: number;
  total_tasks: number;
  total_completed_tasks: number;
};

export const fetchSystemStats = async (): Promise<SystemStats | null> => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return await response.json();
  } catch (error) {
    console.error("Admin stats error:", error);
    return null;
  }
};

export const deleteUser = async (userId: number): Promise<BaseResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      return { message: "User deleted successfully" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Network error while deleting user" };
  }
};

export const deleteTask = async (taskId: number): Promise<BaseResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      return { message: "Task deleted successfully" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete task error:", error);
    return { error: "Network error while deleting task" };
  }
};

export const getAllUsers = async (): Promise<UserDTO[] | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/admin/users`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Get all users error:", error);
    return null;
  }
};
