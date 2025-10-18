<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen overflow-hidden">
      <div class="w-96 border-r border-slate-200 bg-white flex flex-col">
        <div class="p-4 border-b border-slate-200">
          <Button @click="openCreateTodoModal = true">Nouvelle todo</Button>
        </div>

        <TodosPriorityFilter
          :priority="selectedPriority"
          @change="selectedPriority = $event"
        />

        <TodosList
          v-memo="filteredTodos"
          :todos="filteredTodos"
          @select-todo="handleSelectTodo"
        />
      </div>

      <TodoUpdateForm v-if="selectedTodo" :todo="selectedTodo" />

      <div v-else class="flex-1 flex items-center justify-center p-8">
        <div class="text-center max-w-md">
          <div
            class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">
            Selectionnez une todo
          </h2>
          <p class="text-slate-600 mb-6">
            Choisissez une todo de la liste pour voir les details et faire des
            changements, ou créez en une nouvelle pour commencer.
          </p>
          <Button class="w-fit" @click="openCreateTodoModal = true">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Créer une nouvelle todo
          </Button>
        </div>
      </div>
    </div>

    <CreateTodoModal
      :open="openCreateTodoModal"
      @close="openCreateTodoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import TodosPriorityFilter from "../components/TodosPriorityFilter.vue";
import TodosList from "../components/TodosList.vue";
import { computed, onMounted, ref } from "vue";
import { useTodosStore } from "../todos.store";
import { Todo, TodoPriority } from "../todos.type";
import TodoUpdateForm from "../components/TodoUpdateForm.vue";
import Button from "@/components/Button.vue";
import CreateTodoModal from "../components/CreateTodoModal.vue";

const todos = useTodosStore();

const selectedTodoId = ref<number | undefined>(undefined);
const selectedPriority = ref<TodoPriority | undefined>(undefined);
const openCreateTodoModal = ref(false);

const selectedTodo = computed(() =>
  todos.todos.find((todo) => todo.id === selectedTodoId.value),
);

const filteredTodos = computed(() =>
  selectedPriority.value
    ? todos.todos.filter((t) => t.priority === selectedPriority.value)
    : todos.todos,
);

onMounted(() => {
  fetchTodos();
});

async function fetchTodos() {
  try {
    await todos.fetchTodos();
  } catch (err) {
    console.log(err);
  }
}

function handleSelectTodo(todo: Todo) {
  selectedTodoId.value = todo.id;
}
</script>
