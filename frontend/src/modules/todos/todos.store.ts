import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "@/plugins/axios";
import { FetchTodosResponse, Todo } from "./todos.type";

interface Pagination {
  page: number;
  total: number;
  hasMore: boolean;
}

export const useTodosStore = defineStore("todos", () => {
  const todos = ref<Todo[]>([]);
  const pagination = reactive<Pagination>({
    page: 0,
    total: 0,
    hasMore: true,
  });

  async function fetchTodos(limit: number = 15) {
    if (!pagination.hasMore) return;

    const res = await api.get<FetchTodosResponse>("/todos", {
      params: { page: pagination.page + 1, limit },
    });

    todos.value.push(...res.data.data);
    pagination.total = res.data.total;
    pagination.hasMore = res.data.hasMore;
    pagination.page = res.data.page;
  }

  async function updateTodo(todoId: Todo["id"], payload: Partial<Todo>) {
    const res = await api.put<Todo>(`/todos/${todoId}`, {
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
    const res = await api.post<Todo>(`/todos`, {
      ...payload,
      executionDate: payload.executionDate
        ? new Date(payload.executionDate).toISOString()
        : null,
    });
    todos.value = [...todos.value, res.data];
  }

  function resetPagination() {
    pagination.page = 0;
    pagination.hasMore = true;
    pagination.total = 0;
    todos.value = [];
  }

  return {
    todos,
    fetchTodos,
    updateTodo,
    deleteTodo,
    createTodo,
    pagination,
    resetPagination,
  };
});
