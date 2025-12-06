"use client";

import { useEffect, useState } from "react";
import { Task } from "@/lib/types/task";
import { GetAllTasksForUser } from "@/lib/api/task";
import { useAuth } from "@/context/AuthContext";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;
    (async () => {
      setLoading(true);
      const data = await GetAllTasksForUser(user.ID);
      if (isMounted && data) {
        setTasks(data);
      }
      if (isMounted) {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { tasks, loading };
}
