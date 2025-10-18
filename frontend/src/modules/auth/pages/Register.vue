<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <Card class="max-w-96">
      <form @submit.prevent="handleRegister">
        <h2 class="text-2xl font-semibold mb-4 text-center">Créer un compte</h2>

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
            placeholder="Mot de passe (min 6)"
            required
            :disabled="loading"
          />

          <TextInput
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmer votre mot de passe"
            required
            :disabled="loading"
          />
        </div>

        <Button type="submit" :loading="loading">S'enregistrer</Button>

        <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

        <p class="mt-4 text-sm text-center">
          Déjà un compte?
          <router-link to="/login" class="text-green-600"
            >Se connecter</router-link
          >
        </p>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/auth.store";
import Button from "@/components/Button.vue";
import axios from "axios";
import TextInput from "@/components/TextInput.vue";
import Card from "@/components/Card.vue";
import { PASSWORD_LENGTH } from "../auth.constants";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref(null);
const router = useRouter();
const auth = useAuthStore();

const handleRegister = async () => {
  error.value = null;
  loading.value = true;
  try {
    if (password.value.length < PASSWORD_LENGTH) {
      error.value = `Le mot de passe doit faire au moins ${PASSWORD_LENGTH} caractères`;
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = "Les mots de passe doivent être les mêmes";
      return;
    }

    await auth.register({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
    router.push("/");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message;
    } else {
      error.value = "L'enregistrement à échoué, veuillez réessayer";
    }
  } finally {
    loading.value = false;
  }
};
</script>
