import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/plugins/axios";
import { Todo } from "./todos.type";

export const useTodosStore = defineStore("todos", () => {
  const todos = ref<Todo[]>([]);

  async function fetchTodos() {
    const res = await api.get("/todos");
    todos.value = res.data;
  }

  async function updateTodo(todoId: Todo["id"], payload: Partial<Todo>) {
    const res = await api.put(`/todos/${todoId}`, {
      ...payload,
      ...(payload.executionDate
        ? { executionDate: new Date(payload.executionDate).toISOString() }
        : {}),
    });
    const todoIndex = todos.value.findIndex((t) => t.id === res.data.id);
    todos.value[todoIndex] = res.data;
  }

  async function deleteTodo(todoId: Todo["id"]) {
    await api.delete(`/todos/${todoId}`);
    todos.value = todos.value.filter((t) => t.id !== todoId);
  }

  async function createTodo(payload: Partial<Todo>) {
    const res = await api.post(`/todos`, {
      ...payload,
      executionDate: payload.executionDate
        ? new Date(payload.executionDate).toISOString()
        : null,
    });
    todos.value = [...todos.value, res.data];
  }

  return {
    todos,
    fetchTodos,
    updateTodo,
    deleteTodo,
    createTodo,
  };
});
