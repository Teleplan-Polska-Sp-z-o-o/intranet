<script setup lang="ts">
import { onMounted, ref } from "vue";
import FreeCharacterUsageChart from "./charts/FreeCharacterUsageChart.vue";
import { DocumentCreatorUsageManager } from "../../../../../../../../models/document/creator/DocumentCreatorUsageManager";
import PaidCharacterUsageChart from "./charts/PaidCharacterUsageChart.vue";
import { useI18n } from "vue-i18n";

const msTotalUsage = ref<number>(0);

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.dashboard";

onMounted(() => {
  (async () => {
    // ms translator character usage
    const usageManager = new DocumentCreatorUsageManager();
    msTotalUsage.value = await usageManager.GetTotalUsage();
  })();
});
</script>

<template>
  <!-- <v-empty-state
    headline="Not Found"
    title="Component In Build"
    text="The requested component could not be loaded in the current version."
    image="../../../../../documents/build.png"
  ></v-empty-state> -->
  <v-container fluid>
    <div class="text-h6">{{ t(`${tBase}.usage`) }}</div>
    <v-row no-gutters>
      <v-col :cols="6">
        <free-character-usage-chart :usedCharacters="msTotalUsage"></free-character-usage-chart>
      </v-col>
      <v-col :cols="6">
        <paid-character-usage-chart :usedCharacters="msTotalUsage"></paid-character-usage-chart>
      </v-col>
    </v-row>
  </v-container>
</template>
