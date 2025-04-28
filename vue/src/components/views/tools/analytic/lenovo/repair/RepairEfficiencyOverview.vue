<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawLenovoTableStore";
import { ref, toRefs, unref, watch } from "vue";
import EmployeeDailyEfficiencyChart from "../../common/charts/EmployeeDailyEfficiencyChart.vue";
import EmployeeShiftEfficiencyChart from "../../common/charts/EmployeeShiftEfficiencyChart.vue";
import Download from "../../files/download/Download.vue";
import { shouldDisplayAsDailyChart } from "../../common/helpers/time";
import {
  overviewTableHeaders,
  overviewTableDownloadHeaders,
} from "../../common/tableHeaders/efficiencyOverviewHeaders";
import { CommonAnalyticTypes } from "../../common/types";
import MissingCacheTable from "../../common/cache/MissingCacheTable.vue";

const route = useRoute();
const analyticRawTransactionsStore = useAnalyticRawTableStore();

const props = defineProps<{
  rawIdentification: string;
  ttKey?: string;
  title?: string;
}>();

const { title, rawIdentification } = toRefs(props);

const items = ref<CommonAnalyticTypes.IProcessedEmployee[]>([]);
const missingCacheItems = ref<CommonAnalyticTypes.IMissingCache[]>([]);
const expanded = ref<string[]>([]);
const loading = ref<false | "primary-container">("primary-container");

/**
 * Loading current transactions
 */
watch(
  () => unref(analyticRawTransactionsStore.getItemsData(unref(rawIdentification))),
  async (
    newRawTransactions: CommonAnalyticTypes.IAnalyticModelResponse<CommonAnalyticTypes.IRawTransaction>
  ) => {
    // rawTransactions.value = newRawTransactions.raw;
    items.value = newRawTransactions.processed;
    missingCacheItems.value = newRawTransactions.missingCache;

    loading.value = false;
  },
  { deep: true }
);

const isItTodaysDataOnly = ref<boolean>(true);
/**
 * pre form data change
 */
watch(
  () => unref(analyticRawTransactionsStore.getPreFormData(unref(rawIdentification))),
  async (preForm: CommonAnalyticTypes.IPreFormData | undefined) => {
    if (preForm) {
      const today = new Date();

      const isSameDay = (date1: Date, date2: Date) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };

      isItTodaysDataOnly.value =
        isSameDay(preForm.startOfDay, today) && isSameDay(preForm.endOfDay, today);
    }

    loading.value = "primary-container";
  },
  { deep: true }
);

watch(
  () => route.params.sub,
  async (sub) => {
    if (sub) {
      loading.value = "primary-container";
    }
  }
);

// format
const formatShiftGroup = (shift: 1 | 2 | 3 | 4) => {
  if (shift === 4) return "Summary";
  else return shift;
};

const formatColorForEfficiency = (efficiency: number): string => {
  if (efficiency >= 100) {
    return "blue"; // Exceeded the target
  } else if (efficiency >= 80) {
    return "green"; // Close to the target
  } else if (efficiency >= 50) {
    return "orange"; // Moderate progress
  } else {
    return "red"; // Far from target
  }
};
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <v-card-title class="d-flex align-center">
      {{ title ?? "Employee Repair Efficiency Overview" }}
      <v-spacer></v-spacer>
      <download
        :headers="overviewTableDownloadHeaders"
        :items="items"
        base-save-as="Employee Efficiency"
      ></download>
    </v-card-title>

    <v-data-table
      :items="items"
      item-value="id"
      :loading="loading"
      :headers="overviewTableHeaders"
      :group-by="[
        {
          key: 'employeeShift',
          order: 'asc',
        },
      ]"
      :sort-by="[
        {
          key: 'efficiencyPercentage',
          order: 'desc',
        },
      ]"
      multi-sort
      v-model:expanded="expanded"
      show-expand
      class="bg-surface-2"
    >
      <template v-slot:group-header="{ item, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="overviewTableHeaders.length">
            <v-btn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              size="small"
              variant="text"
              @click="toggleGroup(item)"
            ></v-btn>
            {{ formatShiftGroup(item.value) }}
          </td>
        </tr>
      </template>

      <template
        v-slot:item.efficiencyPercentage="{
          item,
        }: {
          item: CommonAnalyticTypes.IProcessedEmployee,
        }"
      >
        <v-chip :color="formatColorForEfficiency(item.efficiencyPercentage)">
          {{ item.efficiencyPercentage }}
        </v-chip>
      </template>
      <template v-slot:expanded-row="{ item }: { item: CommonAnalyticTypes.IProcessedEmployee }">
        <tr>
          <td :colspan="overviewTableHeaders.length" class="pa-0">
            <template v-if="shouldDisplayAsDailyChart(item)">
              <employee-daily-efficiency-chart
                :chart="item.dailyChart"
              ></employee-daily-efficiency-chart>
            </template>
            <template v-else>
              <employee-shift-efficiency-chart
                :chart="item.shiftChart"
                :shift="item.employeeShift"
              ></employee-shift-efficiency-chart>
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
    <missing-cache-table :items="missingCacheItems"></missing-cache-table>
  </v-card>
</template>

<style scoped>
:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child),
.v-table .v-table__wrapper > table > tbody > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
