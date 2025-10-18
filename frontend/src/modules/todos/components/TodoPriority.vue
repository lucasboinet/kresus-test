<template>
  <span
    class="px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap"
    :class="[
      PRIORITIES_STYLES[priority].text,
      PRIORITIES_STYLES[priority].background,
    ]"
    >{{ TODO_PRIORITIES_NAME[priority] }}</span
  >
</template>

<script setup lang="ts">
import { TODO_PRIORITIES_NAME } from "../todos.constants";
import { TodoPriority } from "../todos.type";

interface Props {
  priority: TodoPriority;
}

type TodoPriorityStyle = {
  text: string;
  background: string;
};

const PRIORITIES_STYLES: Record<TodoPriority, TodoPriorityStyle> = {
  [TodoPriority.LOW]: {
    text: "text-green-700",
    background: "bg-green-100",
  },
  [TodoPriority.MEDIUM]: {
    text: "text-orange-700",
    background: "bg-orange-100",
  },
  [TodoPriority.HIGH]: {
    text: "text-red-700",
    background: "bg-red-100",
  },
};

defineProps<Props>();
</script>
