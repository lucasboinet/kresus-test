import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { User } from "@/types/user.types";
import { LoginPayload, RegisterPayload } from "@/modules/auth/auth.types";
import api from "@/plugins/axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | undefined>(undefined);
  const access_token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!access_token.value);

  async function login(payload: LoginPayload) {
    const res = await api.post("/auth/login", { ...payload });
    access_token.value = res.data.access_token;
    user.value = res.data.user;
    localStorage.setItem("token", access_token.value || "");
  }

  async function register(payload: RegisterPayload) {
    const res = await api.post("/auth/register", { ...payload });
    access_token.value = res.data.access_token;
    user.value = res.data.user;
    localStorage.setItem("token", access_token.value || "");
  }

  async function fetchUser() {
    const res = await api.get("/auth/me");
    user.value = res.data;
  }

  function logout() {
    access_token.value = null;
    localStorage.removeItem("token");
  }

  return {
    user,
    isAuthenticated,
    login,
    access_token,
    fetchUser,
    logout,
    register,
  };
});
