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
        <TrashIcon class="text-red-600 size-5" />
        Supprimer
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 bg-slate-50">
      <div class="max-w-3xl mx-auto space-y-6">
        <TodoPriority :priority="todo.priority" />

        <div v-if="todo.executionDate" class="flex items-center gap-2">
          <CalendarIcon class="text-slate-600 size-5" />
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
import { CalendarIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useToast } from "@/composables/useToast";
import { useApiError } from "@/composables/useApiError";

interface Props {
  todo: Todo;
}

const props = defineProps<Props>();
const todos = useTodosStore();
const toast = useToast();
const apiError = useApiError();

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
    toast.success("Todo mis à jour avec succès");
  } catch (err) {
    apiError.handle(
      err,
      "Une erreur innatendu s'est produit lors de la mise à jour de la todo",
    );
  } finally {
    loading.value = false;
  }
}

async function handleDeleteTodo() {
  loading.value = true;
  try {
    await todos.deleteTodo(props.todo.id);
    toast.success("Todo supprimé avec succès");
  } catch (err) {
    apiError.handle(
      err,
      "Une erreur s'est produit lors de la suppression de la todo",
    );
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
