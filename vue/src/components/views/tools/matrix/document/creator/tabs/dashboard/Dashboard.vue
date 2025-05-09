<script setup lang="ts">
import { onMounted, ref } from "vue";
import FreeCharacterUsageChart from "./charts/FreeCharacterUsageChart.vue";
import { DocumentCreatorUsageManager } from "../../../../../../../../models/document/creator/DocumentCreatorUsageManager";
import PaidCharacterUsageChart from "./charts/PaidCharacterUsageChart.vue";
import { useI18n } from "vue-i18n";
import MyDrafts from "./sections/MyDrafts.vue";
import Manage from "./sections/Manage.vue";
import UnsavedWork from "./sections/UnsavedWork.vue";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { useUserStore } from "../../../../../../../../stores/userStore";

const msTotalUsageResponse = ref<number | Error | undefined>(undefined);
const isError = (input: number | Error | undefined): boolean => input instanceof Error;
const { t } = useI18n();
const tBase = "tools.tcd.dashboard";

const isUserEligible = ref<boolean>(false);
const stepperStore = useStepperStore();
const userStore = useUserStore();

onMounted(() => {
  (async () => {
    try {
      const usageManager = new DocumentCreatorUsageManager();
      msTotalUsageResponse.value = await usageManager.GetTotalUsage();
    } catch (error: unknown) {
      msTotalUsageResponse.value = error as Error;
    }
  })();
  (async () => {
    const user = userStore.info();
    if (!user) {
      return;
    } else {
      isUserEligible.value = stepperStore.DOCUMENT_CONTROLLERS.includes(user.username);
    }
  })();
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <v-container fluid>
      <!-- <div class="text-body-1 text-center">{{ t(`${tBase}.usage`) }}</div> -->

      <v-row no-gutters class="mb-8">
        <v-col :cols="12">
          <v-card
            class="rounded-xl bg-surface-2 elevation-2 ma-1"
            :loading="msTotalUsageResponse === undefined ? 'secondary' : false"
          >
            <v-card-title>
              {{ t(`${tBase}.usage`) }}
            </v-card-title>
            <v-fade-transition mode="out-in">
              <v-card-subtitle key="msTotalUsage-error" v-if="isError(msTotalUsageResponse)">
                {{ (msTotalUsageResponse as Error).message }}
              </v-card-subtitle>
            </v-fade-transition>

            <v-card-text>
              <v-fade-transition mode="out-in">
                <v-row
                  key="msTotalUsage-charts"
                  v-if="typeof msTotalUsageResponse === 'number'"
                  no-gutters
                >
                  <v-col :cols="6">
                    <free-character-usage-chart
                      :usedCharacters="msTotalUsageResponse"
                    ></free-character-usage-chart>
                  </v-col>
                  <v-col :cols="6">
                    <paid-character-usage-chart
                      :usedCharacters="msTotalUsageResponse"
                    ></paid-character-usage-chart>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="isUserEligible" no-gutters class="mb-8">
        <v-col :cols="12">
          <manage></manage>
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-8">
        <v-col :cols="12">
          <my-drafts></my-drafts>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col :cols="12">
          <unsaved-work></unsaved-work>
        </v-col>
      </v-row>
    </v-container>
  </v-fade-transition>
</template>
