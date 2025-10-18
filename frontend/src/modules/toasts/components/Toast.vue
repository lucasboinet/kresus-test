<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 min-w-[320px] max-w-md px-4 py-3 rounded-lg shadow-lg pointer-events-auto"
          :class="toastClasses[toast.type]"
        >
          <component
            :is="toastIcons[toast.type]"
            class="w-5 h-5 flex-shrink-0"
          />

          <p class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </p>

          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 hover:opacity-70 transition"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import { Component } from "vue";
import { ToastType } from "@/modules/toasts/toasts.type";
import { useToastStore } from "@/modules/toasts/toasts.store";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const { removeToast } = toastStore;

const toastClasses: Record<ToastType, string> = {
  success: "bg-green-50 text-green-800 border border-green-200",
  error: "bg-red-50 text-red-800 border border-red-200",
  warning: "bg-orange-50 text-orange-800 border border-orange-200",
  info: "bg-blue-50 text-blue-800 border border-blue-200",
};

const toastIcons: Record<ToastType, Component> = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};
</script>
