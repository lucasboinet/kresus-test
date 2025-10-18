import { useToastStore } from "@/modules/toasts/toasts.store";

export function useToast() {
  const store = useToastStore();
  return {
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
  };
}
