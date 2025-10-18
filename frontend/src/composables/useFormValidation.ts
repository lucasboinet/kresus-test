import { ref, computed } from "vue";

type FormValidationRule<T = unknown> = {
  validate: (value: T) => boolean;
  message: string;
};

type FormFieldRules<T> = {
  [K in keyof T]?: FormValidationRule<T[K]>[];
};

export function useFormValidation<T extends Record<string, unknown>>(
  form: T,
  rules: FormFieldRules<T>
) {
  const errors = ref<Record<string, string>>({});

  const validateField = (field: keyof T): boolean => {
    const fieldKey = String(field);
    errors.value[fieldKey] = "";
    const fieldRules = rules[field];

    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validate(form[field])) {
        errors.value[fieldKey] = rule.message;
        return false;
      }
    }

    return true;
  };

  const validateForm = (): boolean => {
    let isValid = true;

    for (const field in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, field)) {
        if (!validateField(field as keyof T)) {
          isValid = false;
        }
      }
    }

    return isValid;
  };

  const resetErrors = () => {
    errors.value = {};
  };

  const hasErrors = computed(() => {
    return Object.values(errors.value).some((error) => error !== "");
  });

  const getError = (field: keyof T): string => {
    return errors.value[String(field)] || "";
  };

  return {
    errors: errors.value,
    getError,
    validateField,
    validateForm,
    resetErrors,
    hasErrors,
  };
}

export const FORM_VALIDATION_RULES = {
  required: (message = "Ce champ est requis"): FormValidationRule<unknown> => ({
    validate: (value) => {
      if (typeof value === "string") return value.trim().length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  minLength: (min: number, message?: string): FormValidationRule<string> => ({
    validate: (value) => !value || value.length >= min,
    message: message || `Doit contenir au moins ${min} caractères`,
  }),

  maxLength: (max: number, message?: string): FormValidationRule<string> => ({
    validate: (value) => !value || value.length <= max,
    message: message || `Ne doit pas dépasser ${max} caractères`,
  }),

  email: (message = "Email invalide"): FormValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  match: <T>(
    otherValue: T,
    message = "Les valeurs ne correspondent pas"
  ): FormValidationRule<T> => ({
    validate: (value) => value === otherValue,
    message,
  }),
};
