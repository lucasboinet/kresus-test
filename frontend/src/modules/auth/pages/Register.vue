<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <Card class="max-w-96">
      <form @submit.prevent="handleRegister">
        <h2 class="text-2xl font-semibold mb-4 text-center">Créer un compte</h2>

        <div class="space-y-3 mb-6">
          <div class="flex gap-3">
            <TextInput
              v-model="form.firstName"
              label="Prénom"
              placeholder="Toto"
              :error="getError('firstName')"
              :disabled="loading"
            />

            <TextInput
              v-model="form.lastName"
              label="Nom"
              placeholder="Kresus"
              :error="getError('lastName')"
              :disabled="loading"
            />
          </div>

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

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/auth.store";
import Button from "@/components/Button.vue";
import TextInput from "@/components/TextInput.vue";
import Card from "@/components/Card.vue";
import { PASSWORD_LENGTH } from "../auth.constants";
import {
  FORM_VALIDATION_RULES,
  useFormValidation,
} from "@/composables/useFormValidation";
import { useToast } from "@/composables/useToast";
import { useApiError } from "@/composables/useApiError";

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const { getError, validateForm, resetErrors } = useFormValidation(form, {
  firstName: [FORM_VALIDATION_RULES.required("Le prénom est requis")],
  lastName: [FORM_VALIDATION_RULES.required("Le nom est requis")],
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
      () => form.password,
      "Les mots de passe ne correspondent pas",
    ),
  ],
});

const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const apiError = useApiError();

const handleRegister = async () => {
  resetErrors();

  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    await auth.register({ ...form });
    router.push("/");
    toast.success("Bienvenue");
  } catch (err) {
    apiError.handle(err, "L'enregistrement à échoué, veuillez réessayer");
  } finally {
    loading.value = false;
  }
};
</script>
