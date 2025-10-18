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
                class="p-2 group hover:bg-slate-100 rounded-lg transition"
                type="button"
              >
                <XMarkIcon
                  class="size-4 text-slate-600 group-hover:text-slate-800"
                />
              </button>
            </div>

            <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <TextInput
                  v-model="form.title"
                  :disabled="loading"
                  label="Titre"
                  :error="getError('title')"
                  placeholder="Titre de la todo"
                />

                <SelectInput
                  v-model="form.priority"
                  :disabled="loading"
                  label="Priorité"
                  :error="getError('priority')"
                  :items="PRIORITIES"
                />

                <TextInput
                  v-model="form.executionDate"
                  :disabled="loading"
                  label="Date d'éxécution"
                  type="datetime-local"
                />

                <TextareaInput
                  v-model="form.content"
                  label="Description"
                  :error="getError('content')"
                  :disabled="loading"
                />

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
import {
  FORM_VALIDATION_RULES,
  useFormValidation,
} from "@/composables/useFormValidation";
import TextareaInput from "@/components/TextareaInput.vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useToast } from "@/composables/useToast";

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const toast = useToast();
const todos = useTodosStore();
const loading = ref(false);

const form = reactive({
  title: "",
  content: "",
  priority: TodoPriority.MEDIUM,
  executionDate: null,
});

const resetForm = () => {
  form.title = "";
  form.content = "";
  form.priority = TodoPriority.MEDIUM;
  form.executionDate = null;
};

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

const handleSubmit = async () => {
  resetErrors();
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
    toast.success("Todo crée avec succès");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error(
        "Une erreur innatendu s'est produit lors de la création de la todo",
      );
    }
  } finally {
    loading.value = false;
    closeModal();
  }
};

const closeModal = () => {
  if (!loading.value) {
    emit("close");
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
      resetErrors();
    }
  },
);
</script>
