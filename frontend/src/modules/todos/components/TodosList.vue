<template>
  <div class="flex-1 overflow-y-auto">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @click="$emit('select-todo', todo)"
    />

    <span v-if="loading" class="flex items-center justify-center">
      <CubeTransparentIcon class="text-white size-6 animate-spin" />
    </span>

    <div ref="target" class="h-5"></div>

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
import { onMounted, ref } from "vue";
import { useTodosStore } from "../todos.store";
import { CubeTransparentIcon } from "@heroicons/vue/24/outline";
import { useApiError } from "@/composables/useApiError";

interface Props {
  todos: Todo[];
}

interface Emits {
  (e: "select-todo", todo: Todo): void;
}

defineEmits<Emits>();
defineProps<Props>();

const apiError = useApiError();
const todoStore = useTodosStore();

const loading = ref(false);
const target = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

async function fetchTodos() {
  loading.value = true;
  try {
    await todoStore.fetchTodos();
  } catch (err) {
    apiError.handle(
      err,
      "Un problème est survenu lors de la récupération des todos",
    );
  } finally {
    loading.value = false;
  }
}

function initIntersectionObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        !loading.value &&
        todoStore.pagination.hasMore
      ) {
        fetchTodos();
      }
    },
    {
      root: null,
      rootMargin: "30px",
      threshold: 0.1,
    },
  );

  if (target.value) {
    observer.value.observe(target.value);
  }
}

onMounted(() => {
  todoStore.resetPagination();
  fetchTodos();

  initIntersectionObserver();
});
</script>
