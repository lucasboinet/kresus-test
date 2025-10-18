<template>
  <div
    class="flex flex-col items-center justify-center p-8 text-center opacity-65"
  >
    <div
      v-if="icon"
      class="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4"
    >
      <component :is="icon" class="w-6 h-6 text-slate-400" />
    </div>

    <h3 class="text font-semibold text-slate-800 mb-2">
      {{ title }}
    </h3>

    <p class="text-slate-600 max-w-sm mb-6 text-sm">
      {{ description }}
    </p>

    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { Component } from "vue";

interface Props {
  title: string;
  description: string;
  icon?: Component;
}

defineProps<Props>();
</script>
