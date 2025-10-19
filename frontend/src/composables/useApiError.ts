import axios from "axios";
import { useToast } from "./useToast";

export function useApiError() {
  const toast = useToast();

  function handle(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || fallback);
    } else {
      toast.error(fallback);
    }
  }

  return { handle };
}
