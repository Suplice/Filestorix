"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Code,
  FileQuestion,
  BookOpen,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { deleteTask } from "@/lib/api/admin";
import { toast } from "sonner";
import { Task } from "@/lib/types/task";
import { TaskListSkeleton } from "@/components/ui/taskList/taskListSkeleton";
import { TaskFilterControls } from "@/components/ui/taskList/taskFilterControls";
import { useState } from "react";

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

function AdminTaskItem({
  task,
  onDeleteClick,
}: {
  task: Task;
  onDeleteClick: (task: Task) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-secondary rounded-md">
          {task.type === "CODE" && <Code className="w-5 h-5 text-blue-500" />}
          {task.type === "QUIZ" && (
            <BookOpen className="w-5 h-5 text-green-500" />
          )}
          {task.type === "FILL_BLANK" && (
            <FileQuestion className="w-5 h-5 text-orange-500" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{task.title}</h3>
            <Badge variant="outline" className="text-xs">
              {task.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {task.language}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {task.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right text-sm text-muted-foreground hidden md:block">
          <div>ID: {task.ID}</div>
          <div>
            {task.points} pts / {task.xp} XP
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDeleteClick(task)}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminTasksPage() {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { filteredTasks, filters, setters, clearFilters } = useTaskFilters(
    tasks,
    user
  );

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    const result = await deleteTask(taskToDelete.ID);

    if (result.message) {
      toast.success(result.message);
      if (typeof window !== "undefined") window.location.reload();
    } else {
      toast.error(result.error || "Failed to delete task");
    }

    setIsDeleting(false);
    setTaskToDelete(null);
  };

  if (loading)
    return (
      <div>
        <TaskListSkeleton />
      </div>
    );

  return (
    <div>
      <div className="w-full  space-y-6 p-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Management</h1>
        </div>

        <TaskFilterControls
          filters={filters}
          setters={setters}
          clearFilters={clearFilters}
        />

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTasks.length} tasks
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              No tasks found matching filters.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <AdminTaskItem
                key={task.ID}
                task={task}
                onDeleteClick={(t) => setTaskToDelete(t)}
              />
            ))
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!taskToDelete}
        title="Delete Task?"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{taskToDelete?.title}</strong>?
            This will also delete all questions associated with this task and
            user progress history.
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
