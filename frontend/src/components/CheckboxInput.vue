<template>
  <label class="text-sm font-medium text-gray-700">
    <input
      class="hidden"
      type="checkbox"
      :disabled="disabled"
      :checked="checked"
      @change="handleCheckedChange"
    />

    <div
      class="p-[2px] bg-green-500 rounded cursor-pointer"
      :class="$attrs.class"
    >
      <div
        class="w-full h-full rounded-sm flex items-center justify-center"
        :class="{ 'bg-green-500': checked, 'bg-white': !checked }"
      >
        <CheckIcon v-if="checked" class="size-3.5 text-white" />
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/solid";

interface Props {
  checked: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: "change", checked: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function handleCheckedChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("change", target.checked);
}
</script>
