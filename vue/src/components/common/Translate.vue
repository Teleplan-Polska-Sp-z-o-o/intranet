<script setup lang="ts">
import { CommonTypes } from "../../interfaces/common/CommonTypes";
import LanguageManager from "../../models/common/settings/LanguageManager";

const props = defineProps<{
  variant: "select" | "speed-dial";
  classObj?: Record<string, boolean>;
  attachSpeedDialTo?: string;
}>();

const languages: Record<string, CommonTypes.LanguageTypes.Language> =
  CommonTypes.LanguageTypes.LANGUAGES;

const manager = new LanguageManager();

const emit = defineEmits(["language-change"]);
const changeLanguage = (lang: CommonTypes.LanguageTypes.Language) => {
  manager.language = lang;
  emit("language-change");
};
</script>

<template>
  <v-speed-dial
    v-if="props.variant === 'speed-dial'"
    transition="fade-transition"
    location="bottom center"
    :attach="props.attachSpeedDialTo"
    :class="classObj"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
        v-bind="activatorProps"
        size="large"
        icon="mdi-translate"
        class="position-relative"
      ></v-fab>
    </template>

    <v-btn
      v-for="(lang, index) in languages"
      :key="index"
      :icon="true"
      :text="lang"
      @click="() => changeLanguage(lang)"
    />
  </v-speed-dial>
  <v-select
    v-if="props.variant === 'select'"
    :label="$t('common.default_layout.pages.settings.application.language.name')"
    :items="Object.values(languages)"
    variant="underlined"
    :class="classObj"
    :model-value="manager.language"
    @update:model-value="changeLanguage"
  ></v-select>
  <!-- class="w-50 mt-4" -->
</template>
