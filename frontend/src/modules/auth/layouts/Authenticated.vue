<template>
  <div>
    <div v-if="!loading" class="min-h-screen bg-gray-50">
      <Navbar />
      <router-view></router-view>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <CubeTransparentIcon class="text-green-500 size-10 animate-spin" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/auth.store";
import Navbar from "@/components/Navbar.vue";
import { CubeTransparentIcon } from "@heroicons/vue/24/outline";

const auth = useAuthStore();
const router = useRouter();
const loading = ref(true);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    await auth.fetchUser();
    loading.value = false;
  } catch {
    auth.logout();
    router.push("/login");
  }
});
</script>
