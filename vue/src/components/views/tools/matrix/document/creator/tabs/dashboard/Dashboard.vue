<script setup lang="ts">
import { onMounted, ref } from "vue";
import FreeCharacterUsageChart from "./charts/FreeCharacterUsageChart.vue";
import { DocumentCreatorUsageManager } from "../../../../../../../../models/document/creator/DocumentCreatorUsageManager";
import PaidCharacterUsageChart from "./charts/PaidCharacterUsageChart.vue";
import { useI18n } from "vue-i18n";
import MyDrafts from "./sections/MyDrafts.vue";
import Manage from "./sections/Manage.vue";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { useUserStore } from "../../../../../../../../stores/userStore";

const msTotalUsage = ref<number>(0);

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.dashboard";

const isUserEligible = ref<boolean>(false);
const stepperStore = useStepperStore();
const userStore = useUserStore();

onMounted(() => {
  (async () => {
    // ms translator character usage
    const usageManager = new DocumentCreatorUsageManager();
    msTotalUsage.value = await usageManager.GetTotalUsage();
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
          <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
            <v-card-title class="d-flex align-center pe-2">
              {{ t(`${tBase}.usage`) }}
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col :cols="6">
                  <free-character-usage-chart
                    :usedCharacters="msTotalUsage"
                  ></free-character-usage-chart>
                </v-col>
                <v-col :cols="6">
                  <paid-character-usage-chart
                    :usedCharacters="msTotalUsage"
                  ></paid-character-usage-chart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="isUserEligible" no-gutters class="mb-8">
        <v-col :cols="12">
          <manage></manage>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col :cols="12">
          <my-drafts></my-drafts>
        </v-col>
      </v-row>
    </v-container>
  </v-fade-transition>
</template>
