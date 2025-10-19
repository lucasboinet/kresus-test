<template>
  <div class="px-4 py-3 border-b border-slate-200 gap-2 flex">
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
      :class="{
        'bg-green-500 text-white hover:bg-green-600': priority === undefined,
        'bg-slate-100 text-slate-700 hover:bg-slate-200':
          priority !== undefined,
      }"
      @click="handlePriorityFilterChange(undefined)"
    >
      Tous
    </button>
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
      :class="{
        'bg-green-500 text-white hover:bg-green-600':
          priority === TodoPriority.LOW,
        'bg-slate-100 text-slate-700 hover:bg-slate-200':
          priority !== TodoPriority.LOW,
      }"
      @click="handlePriorityFilterChange(TodoPriority.LOW)"
    >
      {{ TODO_PRIORITIES_NAME[TodoPriority.LOW] }}
    </button>
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
      :class="{
        'bg-green-500 text-white hover:bg-green-600':
          priority === TodoPriority.MEDIUM,
        'bg-slate-100 text-slate-700 hover:bg-slate-200':
          priority !== TodoPriority.MEDIUM,
      }"
      @click="handlePriorityFilterChange(TodoPriority.MEDIUM)"
    >
      {{ TODO_PRIORITIES_NAME[TodoPriority.MEDIUM] }}
    </button>
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
      :class="{
        'bg-green-500 text-white hover:bg-green-600':
          priority === TodoPriority.HIGH,
        'bg-slate-100 text-slate-700 hover:bg-slate-200':
          priority !== TodoPriority.HIGH,
      }"
      @click="handlePriorityFilterChange(TodoPriority.HIGH)"
    >
      {{ TODO_PRIORITIES_NAME[TodoPriority.HIGH] }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { TODO_PRIORITIES_NAME } from "../todos.constants";
import { TodoPriority } from "../todos.type";

interface Props {
  priority?: TodoPriority;
}

interface Emits {
  (e: "change", priority: TodoPriority | undefined): void;
}

const emit = defineEmits<Emits>();
defineProps<Props>();

function handlePriorityFilterChange(priority?: TodoPriority) {
  emit("change", priority);
}
</script>
