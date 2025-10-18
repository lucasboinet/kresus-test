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
        <div v-if="todo.executionDate" class="flex items-center gap-1 text-xs">
          <CalendarIcon class="text-slate-500 size-4" />
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
import { CalendarIcon } from "@heroicons/vue/24/outline";

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
