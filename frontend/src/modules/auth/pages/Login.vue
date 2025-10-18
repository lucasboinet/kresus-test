<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <Card class="max-w-96">
      <form @submit.prevent="handleLogin">
        <h2 class="text-2xl font-semibold mb-4 text-center">Se connecter</h2>

        <div class="space-y-3 mb-6">
          <TextInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="Email"
            :disabled="loading"
            :error="getError('email')"
          />

          <TextInput
            v-model="form.password"
            type="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            :error="getError('password')"
            :disabled="loading"
          />
        </div>

        <Button type="submit" :loading="loading">Se connecter</Button>

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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import TextInput from "@/components/TextInput.vue";
import Card from "@/components/Card.vue";
import {
  FORM_VALIDATION_RULES,
  useFormValidation,
} from "@/composables/useFormValidation";
import { useToast } from "@/composables/useToast";

const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const form = reactive({
  email: "",
  password: "",
});

const { getError, validateForm, resetErrors } = useFormValidation(form, {
  email: [
    FORM_VALIDATION_RULES.required("L'email est requis"),
    FORM_VALIDATION_RULES.email(),
  ],
  password: [FORM_VALIDATION_RULES.required("Le mot de passe est requis")],
});

const handleLogin = async () => {
  resetErrors();
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    await auth.login({ ...form });
    router.push("/");
    toast.success("Connecté avec succès");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.message);
    } else {
      toast.error("La connection à échoué, veuillez réessayer");
    }
  } finally {
    loading.value = false;
  }
};
</script>
