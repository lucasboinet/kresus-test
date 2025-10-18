import { defineStore } from "pinia";
import { ref } from "vue";
import { Toast, ToastType } from "./toasts.type";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let idCounter = 0;

  const addToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) => {
    const id = idCounter++;
    const toast: Toast = { id, message, type, duration };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const success = (message: string, duration?: number) => {
    return addToast(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    return addToast(message, "error", duration);
  };

  const warning = (message: string, duration?: number) => {
    return addToast(message, "warning", duration);
  };

  const info = (message: string, duration?: number) => {
    return addToast(message, "info", duration);
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
});
