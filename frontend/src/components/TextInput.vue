<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      class="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed border-gray-300 transition"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
type ModelValue = string | undefined | null | Date;

interface Props {
  modelValue: ModelValue;
  label?: string;
  placeholder?: string;
  type?: string;
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
