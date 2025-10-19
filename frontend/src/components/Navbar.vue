<template>
  <div
    class="fixed h-14 shadow top-0 z-50 bg-white flex items-center justify-between gap-2 p-3 w-full"
  >
    <h3 class="font-medium text-xl">Todo List</h3>

    <div class="flex items-center gap-4">
      <span class="border rounded bg-slate-50 px-2" :title="auth.user?.email"
        >{{ auth.user?.firstName }} {{ auth.user?.lastName }}</span
      >
      <button @click="handleLogout">
        <ArrowLeftStartOnRectangleIcon
          class="size-5 text-red-500"
        ></ArrowLeftStartOnRectangleIcon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { useRouter } from "vue-router";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/solid";
import { useToast } from "@/composables/useToast";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

function handleLogout() {
  auth.logout();
  router.push("/login");
  toast.success("Déconnecté avec succès");
}
</script>
