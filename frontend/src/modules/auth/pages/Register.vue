<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <Card class="max-w-96">
      <form @submit.prevent="handleRegister">
        <h2 class="text-2xl font-semibold mb-4 text-center">Créer un compte</h2>

        <div class="space-y-3 mb-6">
          <TextInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Email"
            :error="getError('email')"
            :disabled="loading"
          />

          <TextInput
            v-model="form.password"
            label="Mot de passe"
            type="password"
            :placeholder="`Mot de passe (min ${PASSWORD_LENGTH})`"
            :error="getError('password')"
            :disabled="loading"
          />

          <TextInput
            v-model="form.confirmPassword"
            label="Confirmez votre mot de passer"
            type="password"
            placeholder="Mot de passe"
            :error="getError('confirmPassword')"
            :disabled="loading"
          />
        </div>

        <Button type="submit" :loading="loading">S'enregistrer</Button>

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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/auth.store";
import Button from "@/components/Button.vue";
import axios from "axios";
import TextInput from "@/components/TextInput.vue";
import Card from "@/components/Card.vue";
import { PASSWORD_LENGTH } from "../auth.constants";
import {
  FORM_VALIDATION_RULES,
  useFormValidation,
} from "@/composables/useFormValidation";

const form = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const { getError, validateForm, resetErrors } = useFormValidation(form, {
  email: [
    FORM_VALIDATION_RULES.required("L'email est requis"),
    FORM_VALIDATION_RULES.email(),
  ],
  password: [
    FORM_VALIDATION_RULES.required("Le mot de passe est requis"),
    FORM_VALIDATION_RULES.minLength(PASSWORD_LENGTH),
  ],
  confirmPassword: [
    FORM_VALIDATION_RULES.required("Veuillez confirmer votre mot de passe"),
    FORM_VALIDATION_RULES.match(
      form.confirmPassword,
      "Les mots de passe ne correspondent pas",
    ),
  ],
});

const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();

const handleRegister = async () => {
  resetErrors();

  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    await auth.register({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
    router.push("/");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data?.message);
    } else {
      console.log("L'enregistrement à échoué, veuillez réessayer");
    }
  } finally {
    loading.value = false;
  }
};
</script>
