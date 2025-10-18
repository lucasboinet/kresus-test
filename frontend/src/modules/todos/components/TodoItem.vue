<template>
  <div
    class="border-slate-200 p-4 hover:bg-slate-50 cursor-pointer transition"
    :class="{ 'opacity-60': isCompleted }"
  >
    <div class="flex items-start gap-3">
      <CheckboxInput
        :checked="isCompleted"
        @change="handleCompleteTodo"
        class="w-4 h-4 mt-[1px]"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3
            class="font-semibold text-slate-800 text-sm truncate"
            :class="{ 'line-through': isCompleted }"
          >
            {{ todo.title }}
          </h3>
          <TodoPriority :priority="todo.priority" />
        </div>
        <p
          class="text-xs text-slate-600 line-clamp-2 mb-2"
          :class="{ 'line-through': isCompleted }"
        >
          {{ todo.content }}
        </p>
        <div
          v-if="todo.executionDate"
          class="flex items-center gap-1 text-xs text-slate-500"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          {{ new Date(todo.executionDate).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Todo } from "../todos.type";
import { useTodosStore } from "../todos.store";
import TodoPriority from "./TodoPriority.vue";
import CheckboxInput from "@/components/CheckboxInput.vue";

interface Props {
  todo: Todo;
}

const props = defineProps<Props>();
const todos = useTodosStore();

const isCompleted = computed(() => !!props.todo.completedAt);

async function handleCompleteTodo(checked: boolean) {
  try {
    await todos.updateTodo(props.todo.id, {
      completedAt: checked ? new Date() : null,
    });
  } catch (err) {
    console.log(err);
  }
}
</script>
