import { Task } from "@/lib/types/task";
import { User } from "@/lib/types/user";

export const GetAllTasksForUser = async (
  userId: number
): Promise<Task[] | null> => {
  console.log(userId);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/tasks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error("Błąd przy pobieraniu tasków:", response.statusText);
      return null;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Błąd:", error);
    return null;
  }
};

export async function GetTaskByIdForUser(
  taskId: number,
  userId: number
): Promise<Task | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/tasks/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData = await response.json();
    if (response.ok) {
      return responseData as Task;
    }

    return null;
  } catch (error) {
    console.error("Error fetching task details:", error);
    return null;
  }
}

type SubmitAnswerResponse = {
  is_correct: boolean;
  is_completed: boolean;
  updated_user?: User;
};

export async function SubmitAnswerForTask(
  taskId: number,
  questionId: number,
  answer: string
): Promise<SubmitAnswerResponse | null> {
  try {
    const requestBody = JSON.stringify({
      taskId: taskId,
      questionId: questionId,
      answer: answer,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/submit-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        credentials: "include",
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return responseData as SubmitAnswerResponse;
    } else {
      const errorText = await response.text();
      console.error(`API error on submit: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.error("Network error while submitting answer:", error);
    return null;
  }
}
