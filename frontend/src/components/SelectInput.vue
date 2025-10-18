<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <select
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
    >
      <option v-for="(item, index) in items" :value="item.value" :key="index">
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
type SelectItem = {
  value: number | string | undefined | boolean;
  label: string;
};

interface Props {
  modelValue: string | undefined;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  items: SelectItem[];
}

defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
</script>
