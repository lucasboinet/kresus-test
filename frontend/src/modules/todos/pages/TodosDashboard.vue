<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen overflow-hidden pt-14">
      <div class="w-96 border-r border-slate-200 bg-white flex flex-col">
        <div class="p-4 border-b border-slate-200">
          <Button @click="openCreateTodoModal = true">
            <PlusIcon class="text-white size-6" /> Nouvelle todo</Button
          >
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
            class="bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ClipboardIcon class="size-10" />
          </div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">
            Selectionnez une todo
          </h2>
          <p class="text-slate-600 mb-6">
            Choisissez une todo de la liste pour voir les details et faire des
            changements, ou créez en une nouvelle pour commencer.
          </p>
          <Button class="w-fit" @click="openCreateTodoModal = true">
            <PlusIcon class="text-white size-6" />
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
import { computed, ref } from "vue";
import { useTodosStore } from "../todos.store";
import { Todo, TodoPriority } from "../todos.type";
import TodoUpdateForm from "../components/TodoUpdateForm.vue";
import Button from "@/components/Button.vue";
import CreateTodoModal from "../components/CreateTodoModal.vue";
import { ClipboardIcon, PlusIcon } from "@heroicons/vue/24/outline";

const todoStore = useTodosStore();

const selectedTodoId = ref<number | undefined>(undefined);
const selectedPriority = ref<TodoPriority | undefined>(undefined);
const openCreateTodoModal = ref(false);

const selectedTodo = computed(() =>
  todoStore.todos.find((todo) => todo.id === selectedTodoId.value),
);

const filteredTodos = computed(() =>
  selectedPriority.value
    ? todoStore.todos.filter((t) => t.priority === selectedPriority.value)
    : todoStore.todos,
);

function handleSelectTodo(todo: Todo) {
  selectedTodoId.value = todo.id;
}
</script>
