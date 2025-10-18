<template>
  <div class="flex-1 overflow-y-auto">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @click="$emit('select-todo', todo)"
    />

    <EmptyState
      v-if="todos.length === 0"
      title="Aucune todo"
      description="Vous n'avez pas encore de todos. Créez-en une pour commencer à organiser vos tâches."
      :icon="ClipboardDocumentListIcon"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";
import { Todo } from "../todos.type";
import TodoItem from "./TodoItem.vue";
import { ClipboardDocumentListIcon } from "@heroicons/vue/24/solid";

interface Props {
  todos: Todo[];
}

defineEmits(["select-todo"]);
defineProps<Props>();
</script>
