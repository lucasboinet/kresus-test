<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div
      class="p-6 border-b border-slate-200 flex items-center justify-between bg-white w-full"
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <CheckboxInput
          :checked="!!form.completedAt"
          @change="handleCheckedChange"
          class="w-5 h-5"
        />
        <h2 class="text-2xl font-bold text-slate-800 flex-1 truncate mb-2">
          {{ todo.title }}
        </h2>
      </div>
      <button
        class="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition flex items-center gap-2 shrink-0"
        @click="handleDeleteTodo"
        :loading="loading"
        :disabled="loading"
      >
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
        Supprimer
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 bg-slate-50">
      <div class="max-w-3xl mx-auto space-y-6">
        <TodoPriority :priority="todo.priority" />

        <div
          v-if="todo.executionDate"
          class="flex items-center gap-2 text-slate-600"
        >
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>{{ new Date(todo.executionDate).toLocaleString() }}</span>
        </div>

        <Card>
          <h3
            class="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide"
          >
            Description
          </h3>
          <p class="text-slate-800 leading-relaxed">
            {{ todo.content }}
          </p>
        </Card>

        <Card title="Modifier la todo">
          <form class="space-y-4" @submit.prevent="handleUpdateTodo">
            <TextInput
              v-model="form.title"
              label="Titre"
              :error="getError('title')"
            />
            <div class="flex gap-2 items-center">
              <TextInput
                v-model="form.executionDate"
                :disabled="loading"
                label="Date d'éxécution"
                type="datetime-local"
                :error="getError('executionDate')"
              />

              <div class="w-56">
                <SelectInput
                  v-model="form.priority"
                  label="Priorité"
                  :items="PRIORITIES"
                  :disabled="loading"
                />
              </div>
            </div>

            <TextareaInput
              v-model="form.content"
              label="Description"
              :error="getError('content')"
              :disabled="loading"
            />
            <Button type="submit" :loading="loading">Sauvegarder</Button>
          </form>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/Button.vue";
import { Todo } from "../todos.type";
import TodoPriority from "./TodoPriority.vue";
import { TodoPriority as TodoPriorityType } from "../todos.type";
import Card from "@/components/Card.vue";
import TextInput from "@/components/TextInput.vue";
import { reactive, ref, watchEffect } from "vue";
import { useTodosStore } from "../todos.store";
import CheckboxInput from "@/components/CheckboxInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import {
  PRIORITIES,
  TODO_DESCRIPTION_LENGTH,
  TODO_TITLE_LENGTH,
} from "../todos.constants";
import {
  FORM_VALIDATION_RULES,
  useFormValidation,
} from "@/composables/useFormValidation";
import TextareaInput from "@/components/TextareaInput.vue";

interface Props {
  todo: Todo;
}

const props = defineProps<Props>();
const todos = useTodosStore();

const loading = ref(false);

const form = reactive<Omit<Todo, "id" | "userId">>({
  title: "",
  content: "",
  priority: TodoPriorityType.LOW,
  executionDate: null,
  completedAt: null,
});

const { getError, validateForm, resetErrors } = useFormValidation(form, {
  title: [
    FORM_VALIDATION_RULES.required("Le titre est requis"),
    FORM_VALIDATION_RULES.maxLength(TODO_TITLE_LENGTH),
  ],
  content: [
    FORM_VALIDATION_RULES.required("La description est requise"),
    FORM_VALIDATION_RULES.maxLength(TODO_DESCRIPTION_LENGTH),
  ],
  priority: [FORM_VALIDATION_RULES.required("La priorité est requise")],
});

async function handleUpdateTodo() {
  resetErrors();

  if (!validateForm()) return;

  loading.value = true;
  try {
    await todos.updateTodo(props.todo.id, {
      ...form,
      executionDate: form.executionDate ?? null,
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

async function handleDeleteTodo() {
  loading.value = true;
  try {
    await todos.deleteTodo(props.todo.id);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

function handleCheckedChange(checked: boolean) {
  form.completedAt = checked ? new Date() : null;
}

watchEffect(() => {
  form.title = props.todo.title;
  form.content = props.todo.content;
  form.priority = props.todo.priority;
  form.completedAt = props.todo.completedAt ?? null;

  if (props.todo.executionDate) {
    const executionDate = new Date(props.todo.executionDate);
    executionDate.setMinutes(
      executionDate.getMinutes() - executionDate.getTimezoneOffset(),
    );

    form.executionDate = executionDate.toISOString().slice(0, 16);
  }
});
</script>
