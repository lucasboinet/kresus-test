<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full">
    <h3 v-if="title" class="text-lg font-semibold text-gray-800 mb-2">
      {{ title }}
    </h3>
    <div class="text-gray-700">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>
