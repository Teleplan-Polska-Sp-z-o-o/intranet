<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { XLSXTypes } from "../Types";
import FileCardDataTable from "./FileCardDataTable.vue";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";

const store = useAnalyticStore();

const compProps = defineProps<{
  /**
   * Xlsx entity
   */
  analyticFileEntity: any;

  /**
   * Manager for API
   */
  xlsxSheets: XLSXTypes.Sheets;

  /**
   * file uuid
   */
  fileUuid: string;
}>();

const { analyticFileEntity, xlsxSheets } = toRefs(compProps);

const sheetTabs = computed(() => {
  return Object.keys(xlsxSheets.value).map((sheetName, index) => {
    return { sheetName: sheetName, sheetId: index };
  });
});

const currentSheet = ref<number>(0);
</script>

<template>
  <v-card elevation="2">
    <v-card-title class="d-flex justify-space-between">
      <span>{{ analyticFileEntity.normalizedFileName }}</span>
      <v-icon icon="mdi-close" @click="store.closeDialog(fileUuid)"></v-icon>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="currentSheet" align-tabs="center" color="#1D6F42">
        <v-tab v-for="tab in sheetTabs" :key="tab.sheetId" :value="tab.sheetId">
          {{ tab.sheetName }}</v-tab
        >
      </v-tabs>

      <v-tabs-window v-model="currentSheet">
        <v-tabs-window-item v-for="tab in sheetTabs" :key="tab.sheetId" :value="tab.sheetId">
          <file-card-data-table :excel-preview="xlsxSheets[tab.sheetName]"></file-card-data-table>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
