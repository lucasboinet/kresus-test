<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 transform translate-y-10"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-10"
        >
          <div
            v-if="open"
            class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            @click.stop
          >
            <div
              class="flex items-center justify-between p-6 border-b border-slate-200"
            >
              <h2 class="text-2xl font-bold text-slate-800">
                Créer une nouvelle todo
              </h2>
              <button
                @click="closeModal"
                class="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                type="button"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <TextInput
                  v-model="form.title"
                  :error="errors.title"
                  :disabled="loading"
                  label="Titre"
                  placeholder="Titre de la todo"
                  required
                />

                <SelectInput
                  v-model="form.priority"
                  :disabled="loading"
                  label="Priorité"
                  :items="PRIORITIES"
                />

                <TextInput
                  v-model="form.executionDate"
                  :disabled="loading"
                  label="Date d'éxécution"
                  type="datetime-local"
                />

                <div>
                  <label
                    for="content"
                    class="text-sm font-medium text-gray-700"
                  >
                    Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="form.content"
                    name="content"
                    required
                    :disabled="loading"
                    rows="5"
                    placeholder="Description de la todo"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                  ></textarea>
                  <p v-if="errors.content" class="mt-1 text-sm text-red-500">
                    {{ errors.content }}
                  </p>
                </div>

                <div class="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    :loading="loading"
                    class="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Créer
                  </Button>
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="loading"
                    class="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import SelectInput from "@/components/SelectInput.vue";
import TextInput from "@/components/TextInput.vue";
import { ref, reactive, watch } from "vue";
import { Todo, TodoPriority } from "../todos.type";
import { useTodosStore } from "../todos.store";
import Button from "@/components/Button.vue";
import {
  PRIORITIES,
  TODO_DESCRIPTION_LENGTH,
  TODO_TITLE_LENGTH,
} from "../todos.constants";
import axios from "axios";

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const todos = useTodosStore();

const loading = ref(false);

const form = reactive({
  title: "",
  content: "",
  priority: TodoPriority.MEDIUM,
  executionDate: null,
});

const errors = reactive({
  title: "",
  content: "",
});

const resetForm = () => {
  form.title = "";
  form.content = "";
  form.priority = TodoPriority.MEDIUM;
  form.executionDate = null;
  errors.title = "";
  errors.content = "";
};

const validateForm = () => {
  errors.title = "";
  errors.content = "";

  if (form.title.length >= TODO_TITLE_LENGTH) {
    errors.title = `Le titre ne doit pas dépasser ${TODO_TITLE_LENGTH} caractères`;
  }

  if (form.content.length >= TODO_DESCRIPTION_LENGTH) {
    errors.content = `Le description ne doit pas dépasser ${TODO_DESCRIPTION_LENGTH} caractères`;
  }

  return !Object.values(errors).find((e) => !!e || e !== "");
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const data: Partial<Todo> = {
      title: form.title.trim(),
      content: form.content.trim(),
      priority: form.priority,
      executionDate: form.executionDate ?? null,
    };

    await todos.createTodo(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data?.message);
    } else {
      console.error(error);
    }
  } finally {
    loading.value = false;
    closeModal();
  }
};

const closeModal = () => {
  if (!loading.value) {
    emit("close");
    resetForm();
  }
};

const handleBackdropClick = () => {
  closeModal();
};

watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  },
);
</script>
