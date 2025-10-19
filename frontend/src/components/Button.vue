<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || loading"
    @click="emit('click')"
    class="relative w-full inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
  >
    <div v-if="!loading" class="flex items-center gap-2">
      <slot />
    </div>

    <span v-else class="flex items-center gap-2">
      <CubeTransparentIcon class="text-white size-5 animate-spin" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { CubeTransparentIcon } from "@heroicons/vue/24/solid";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface Emits {
  (e: "click"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
