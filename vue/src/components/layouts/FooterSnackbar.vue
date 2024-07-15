<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Alert, Color } from "../../interfaces/common/AlertTypes";
import { useAlertStore } from "../../stores/alertStore";
import { Ref, ref, watch } from "vue";

const alertStore = useAlertStore();
const snackbarDisplay: Ref<boolean> = ref<boolean>(false);
const snackbarTimeout: Ref<number> = ref<number>(6000);
const snackbarColor: Ref<Color> = ref<Color>("info");
const snackbarMessage: Ref<string> = ref<string>("");

const { t } = useI18n();

watch(
  () => alertStore.alert,
  (alert: Alert) => {
    if (alert.display === true) {
      snackbarColor.value = alert.color;
      const message = t(`common.status_message.${alert.message}`);
      if (message.includes("common.status_message")) {
        snackbarMessage.value = t(`common.status_message.unknownMessage`);
      } else {
        snackbarMessage.value = message;
      }

      snackbarDisplay.value = alert.display;
      snackbarTimeout.value = 0;

      setTimeout(() => {
        snackbarTimeout.value = alert.timeout;
      }, 0);
    }
  },
  { deep: true }
);
</script>

<template>
  <v-snackbar
    id="snackbar-alert"
    v-model="snackbarDisplay"
    vertical
    color="background"
    :timer="snackbarColor"
    :timeout="snackbarTimeout"
    :style="{ bottom: '48px' }"
  >
    <v-alert class="w-100 h-100" :type="snackbarColor" :text="snackbarMessage">
      <template v-slot:close>
        <v-btn
          v-if="snackbarTimeout === -1"
          icon="mdi-close"
          density="comfortable"
          size="large"
          color="white"
          variant="text"
          @click="snackbarDisplay = false"
        ></v-btn>
      </template>
    </v-alert>
  </v-snackbar>
</template>

<style>
#snackbar-alert .v-snackbar__content {
  width: 100%;
}
</style>
