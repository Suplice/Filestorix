"use client";

import { useTaskFilters } from "@/hooks/use-task-filters";
import { TaskListSkeleton } from "./taskListSkeleton";
import { useTasks } from "@/hooks/use-tasks";
import { TaskFilterControls } from "./taskFilterControls";
import { TaskItem } from "./taskItem";
import { useAuth } from "@/context/AuthContext";

export default function TasksListWithFilters() {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();

  const { filteredTasks, filters, setters, clearFilters } = useTaskFilters(
    tasks,
    user
  );

  if (loading) {
    return <TaskListSkeleton />;
  }

  console.log(filteredTasks);

  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <TaskFilterControls
        filters={filters}
        setters={setters}
        clearFilters={clearFilters}
      />

      <div className="flex flex-col gap-2 w-full">
        {filteredTasks.map((task) => (
          <TaskItem key={task.ID} task={task} />
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No tasks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
