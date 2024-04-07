<script setup lang="ts">
import { computed, ref, watch } from "vue";
import axios from "axios";
import { useTheme } from "vuetify";
import { nodeConfig } from "../../../config/env";
import { Endpoints } from "../../../config/Endpoints";
import { ISettings } from "../../../interfaces/user/ISettings";
import { Settings } from "../../../models/user/Settings";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../../models/common/ResponseStatus";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useI18n } from "vue-i18n";

const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

const responseStatus = ref<IResponseStatus | null>(null);
const emit = defineEmits(["response-status"]);

const { t, locale } = useI18n();

// theme
const useT = useTheme();
const theme = ref<string>(settings.theme);
const themeLabel = computed(() => t("common.default_layout.pages.settings.application.theme.name"));
const themeOptions = ref<Array<{ title: string; value: string }>>([
  { title: t("common.default_layout.pages.settings.application.theme.dark"), value: "dark" },
  { title: t("common.default_layout.pages.settings.application.theme.light"), value: "light" },
]);

watch(theme, () => {
  settings.theme = theme.value;
  useT.global.name.value = settings.theme;
  settingsStore.set(settings);

  const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserSettingsLanguage}`;
  const reqData: Partial<ISettings> = new Settings(settings);

  axios
    .put(reqUrl, reqData)
    .then(function (response) {
      responseStatus.value = new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
      emit("response-status", responseStatus.value);
    })
    .catch(function (error) {
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
      emit("response-status", responseStatus.value);
    });
});

// languages
const language = ref<typeof settings.language>(settings.language);
const languageLabel = computed(() =>
  t("common.default_layout.pages.settings.application.language.name")
);
const languageOptions = ref<Array<{ title: string; value: string }>>([
  { title: t("common.default_layout.pages.settings.application.language.english"), value: "en" },
  { title: t("common.default_layout.pages.settings.application.language.polish"), value: "pl" },
  {
    title: t("common.default_layout.pages.settings.application.language.ukrainian"),
    value: "ua",
  },
]);

watch(language, () => {
  settings.language = language.value;
  locale.value = settings.language;
  settingsStore.set(settings);

  const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserSettingsLanguage}`;
  const reqData: Partial<ISettings> = new Settings(settings);

  axios
    .put(reqUrl, reqData)
    .then(function (response) {
      responseStatus.value = new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
      emit("response-status", responseStatus.value);
    })
    .catch(function (error) {
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
      emit("response-status", responseStatus.value);
    });
});

watch(locale, () => {
  themeOptions.value = [
    { title: t("common.default_layout.pages.settings.application.theme.dark"), value: "dark" },
    {
      title: t("common.default_layout.pages.settings.application.theme.light"),
      value: "light",
    },
  ];
  languageOptions.value = [
    { title: t("common.default_layout.pages.settings.application.language.english"), value: "en" },
    { title: t("common.default_layout.pages.settings.application.language.polish"), value: "pl" },
    {
      title: t("common.default_layout.pages.settings.application.language.ukrainian"),
      value: "ua",
    },
  ];
});
</script>

<template>
  <v-select
    v-model="theme"
    :label="themeLabel"
    :items="themeOptions"
    item-title="title"
    item-value="value"
    variant="underlined"
    class="w-50 mx-auto"
  ></v-select>
  <v-select
    v-model="language"
    :label="languageLabel"
    :items="languageOptions"
    item-title="title"
    item-value="value"
    variant="underlined"
    class="w-50 mx-auto"
  ></v-select>
</template>
