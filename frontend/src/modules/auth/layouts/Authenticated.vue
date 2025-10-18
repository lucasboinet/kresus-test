<template>
  <div>
    <div v-if="isReady" class="min-h-screen bg-gray-50">
      <Navbar />
      <router-view></router-view>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/auth.store";
import Navbar from "@/components/Navbar.vue";

const auth = useAuthStore();
const router = useRouter();
const isReady = ref(false);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    await auth.fetchUser();
    isReady.value = true;
  } catch {
    auth.logout();
    router.push("/login");
  }
});
</script>
