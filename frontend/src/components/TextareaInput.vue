<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <textarea
      :value="modelValue"
      name="editContent"
      :disabled="disabled"
      :required="required"
      rows="5"
      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    ></textarea>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
type ModelValue = string | undefined;

interface Props {
  modelValue: ModelValue;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

interface Emits {
  (e: "update:modelValue", modelValue: ModelValue): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
