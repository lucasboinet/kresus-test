<template>
  <div class="flex-1 overflow-y-auto">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @click="$emit('select-todo', todo)"
    />
  </div>
</template>

<script setup lang="ts">
import { Todo } from "../todos.type";
import TodoItem from "./TodoItem.vue";

interface Props {
  todos?: Todo[];
}

defineEmits(["select-todo"]);
defineProps<Props>();
</script>
