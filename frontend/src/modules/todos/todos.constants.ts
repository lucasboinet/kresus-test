import { TodoPriority } from "./todos.type";

export const TODO_PRIORITIES_NAME: Record<TodoPriority, string> = {
  [TodoPriority.LOW]: "Bas",
  [TodoPriority.MEDIUM]: "Moyen",
  [TodoPriority.HIGH]: "Haut",
};

export const PRIORITIES = [
  {
    value: TodoPriority.LOW,
    label: TODO_PRIORITIES_NAME[TodoPriority.LOW],
  },
  {
    value: TodoPriority.MEDIUM,
    label: TODO_PRIORITIES_NAME[TodoPriority.MEDIUM],
  },
  {
    value: TodoPriority.HIGH,
    label: TODO_PRIORITIES_NAME[TodoPriority.HIGH],
  },
];

export const TODO_TITLE_LENGTH = 50;
export const TODO_DESCRIPTION_LENGTH = 50;
