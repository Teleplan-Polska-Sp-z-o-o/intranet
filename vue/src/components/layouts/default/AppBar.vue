<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppBarNotifications from "./AppBarNotifications.vue";

const emits = defineEmits(["toggle-drawer"]);

const toggleDrawer = () => emits("toggle-drawer");

const { t } = useI18n();

const intranet = computed(() => t("common.default_layout.bar"));
</script>

<template>
  <v-app-bar class="layout-app-bar bg-primary-container text-on-primary-container" elevation="0">
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-app-bar-title class="text-h5">{{ intranet }}</v-app-bar-title>
    <template v-slot:append>
      <app-bar-notifications></app-bar-notifications>
    </template>
  </v-app-bar>
</template>
