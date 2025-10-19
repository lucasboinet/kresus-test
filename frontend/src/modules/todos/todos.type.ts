export type Todo = {
  id: number;
  title: string;
  content: string;
  priority: TodoPriority;
  executionDate?: Date | string | null;
  completedAt?: Date | null;
  userId: string;
};

export enum TodoPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type FetchTodosResponse = {
  data: Todo[];
  total: number;
  hasMore: boolean;
  page: number;
};
