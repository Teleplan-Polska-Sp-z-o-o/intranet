<script setup lang="ts">
import { ref, watch } from "vue";
import { useTheme } from "vuetify";
import { Endpoints } from "../../../config/axios/Endpoints";
import { ISettings } from "../../../interfaces/user/UserTypes";
import { Settings } from "../../../models/user/Settings";
import { ResponseStatus } from "../../../models/common/ResponseStatus";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useAlertStore } from "../../../stores/alertStore";
import Translate from "../../common/Translate.vue";
import LanguageManager from "../../../models/common/settings/LanguageManager";
import jwtAxios from "../../../config/axios/jwtAxios";

const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

// theme
const useT = useTheme();
const theme = ref<string>(settings.theme);

watch(theme, () => {
  settings.theme = theme.value;
  useT.global.name.value = settings.theme;
  settingsStore.set(settings);

  jwtAxios
    .put(Endpoints.UserSettingsLanguage, new Settings(settings))
    .then(function (response) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    })
    .catch(function (error) {
      useAlertStore().process(
        new ResponseStatus({
          code: error.response.status,
          message: error.response.data.statusMessage,
        })
      );
    });
});

const handleLanguageChange = () => {
  new LanguageManager().updateLanguageSettings(true);
};
</script>

<template>
  <v-card class="rounded-xl elevation-2 ma-1">
    <v-list lines="three" bg-color="surface-2">
      <v-list-subheader>{{
        $t("common.default_layout.pages.settings.application.list['list-subheader']")
      }}</v-list-subheader>

      <v-list-item>
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.application.list['list-item']['1'].title")
        }}</v-list-item-title>

        <v-list-item-subtitle>{{
          $t("common.default_layout.pages.settings.application.list['list-item']['1'].subtitle")
        }}</v-list-item-subtitle>

        <v-select
          v-model="theme"
          :label="$t('common.default_layout.pages.settings.application.theme.name')"
          :items="['dark', 'light']"
          variant="underlined"
          class="w-50 mt-4"
        ></v-select>
      </v-list-item>

      <v-list-item class="pt-0">
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.application.list['list-item']['2'].title")
        }}</v-list-item-title>

        <v-list-item-subtitle>{{
          $t("common.default_layout.pages.settings.application.list['list-item']['2'].subtitle")
        }}</v-list-item-subtitle>

        <translate
          variant="select"
          :class-obj="{ 'w-50': true, 'mt-4': true }"
          @language-change="handleLanguageChange"
        ></translate>
      </v-list-item>
    </v-list>
  </v-card>
</template>
