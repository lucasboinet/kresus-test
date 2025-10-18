<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <Card class="max-w-96">
      <form @submit.prevent="handleLogin">
        <h2 class="text-2xl font-semibold mb-4 text-center">Se connecter</h2>

        <div class="space-y-3 mb-6">
          <TextInput
            v-model="email"
            type="email"
            placeholder="Email"
            required
            :disabled="loading"
          />

          <TextInput
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
            :disabled="loading"
          />
        </div>

        <Button type="submit" :loading="loading">Se connecter</Button>

        <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

        <p class="mt-4 text-sm text-center">
          Pas encore de compte?
          <router-link to="/register" class="text-green-600"
            >S'enregistrer</router-link
          >
        </p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import TextInput from "@/components/TextInput.vue";
import Card from "@/components/Card.vue";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string>("");
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  error.value = "";
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push("/");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message;
    } else {
      error.value = "La connection à échoué, veuillez réessayer";
    }
  } finally {
    loading.value = false;
  }
};
</script>
