export interface Task {
  ID: number;
  title: string;
  description: string;
  type: "QUIZ" | "CODE" | "FILL_BLANK";
  language:
    | "Python"
    | "Go"
    | "Algorithms"
    | "JavaScript"
    | "TypeScript"
    | "C#"
    | "General";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  xp: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  task_questions: TaskQuestion[];
  user_progress?: UserTaskProgress;
}

export interface TaskQuestion {
  ID: number;
  task_id: number;
  question_text: string;
  type: "QUIZ" | "CODE" | "FILL_BLANK";
  options: string[];
  correct_answer: string;
  test_input: string;
  expected_output: string;
}

export interface UserTaskProgress {
  ID: number;
  user_id: number;
  task_id: number;
  progress: number;
  attempts: number;
  mistakes: number;
  is_completed: boolean;
  completed_at?: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  ID: number;
  user_task_progress_id: number;
  task_question_id: number;
  answer_given: string;
  is_correct: boolean;
  attempts: number;
  submitted_at: string;
  task_question: TaskQuestion;
}
