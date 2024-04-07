<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "vuetify";
import { useSettingsStore } from "./stores/settingsStore";
import { ISettings } from "./interfaces/user/ISettings";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const useT = useTheme();

const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

onMounted(() => {
  useT.global.name.value = settings.theme;
  locale.value = settings.language;
});
</script>

<template>
  <v-app class="bg-background">
    <!-- vue-router -->
    <router-view></router-view>
  </v-app>
</template>
