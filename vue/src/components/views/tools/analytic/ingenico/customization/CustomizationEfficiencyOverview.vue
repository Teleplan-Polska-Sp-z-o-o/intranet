<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawIngenicoTableStore";
import { computed, ref, toRefs, unref, watch } from "vue";
import { EfficiencyTypes } from "../common/efficiency/Types";
import { AnalyticRaw } from "../common/transactions/Types";
import EfficiencyWorker from "../common/efficiency/EfficiencyWorker?worker";
import { DataTableHeader } from "../../files/download/DataTableHeader";
import EmployeeDailyEfficiencyChart from "../common/efficiency/EmployeeDailyEfficiencyChart.vue";
import EmployeeQuarterlyEfficiencyChart from "../common/efficiency/EmployeeQuarterlyEfficiencyChart.vue";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticFileTypes } from "../../files/Types";
import { AnalyticFileHelper } from "../../files/drive/AnalyticFileHelper";

const route = useRoute();
const analyticRawTransactionsStore = useAnalyticRawTableStore();

const props = defineProps<{
  rawIdentification: string;
  title?: string;
}>();

const { title, rawIdentification } = toRefs(props);

const rawTransactions = ref<AnalyticRaw.TTransactions>([]);

const items = ref<EfficiencyTypes.IProcessedEmployee[]>([]);
const expanded = ref<string[]>([]);
const loading = ref<false | "primary-container">("primary-container");
const worker = new EfficiencyWorker();

const analyticFileManager: AnalyticFileManager = new AnalyticFileManager();
const modelsMatrix = ref<EfficiencyTypes.IModelMatrix[]>([]);
const loadMatrix = async () => {
  const progName = route.params.program as string;
  const catName = route.params.cat as string;

  const requiredFiles: AnalyticFileTypes.IAnalyticFileEntity[] =
    await analyticFileManager.getByProgAndCatAndSub(progName, catName, "drive");
  const consideredRequiredFiles: AnalyticFileTypes.IAnalyticFileEntity[] =
    AnalyticFileHelper.addConsideredProperty(requiredFiles);

  const modelsParsed = JSON.parse(
    consideredRequiredFiles.find((file) => file.considered && file.fileType === "models")
      ?.jsObjectJson!
  );
  modelsMatrix.value = modelsParsed[Object.keys(modelsParsed)[0]];
};

/**
 * Loading current transactions
 */
watch(
  () => unref(analyticRawTransactionsStore.getItemsData(unref(rawIdentification))),
  async (newRawTransactions: AnalyticRaw.TTransactions) => {
    rawTransactions.value = newRawTransactions;

    // const program = route.params.program as string;
    // const models = (await new AnalyticInventoryCharacteristicManager(
    //   program
    // ).get()) as EfficiencyTypes.IInventoryCharacteristic[];

    // if (!models.length) return;

    if (!unref(modelsMatrix).length) await loadMatrix();
    if (!unref(modelsMatrix).length) return;

    const serializedRawTransactions = JSON.stringify(unref(rawTransactions));
    const serializedModels = JSON.stringify(unref(modelsMatrix));

    worker.postMessage({
      rawTransactions: serializedRawTransactions,
      models: serializedModels,
    });
  },
  { deep: true }
);

// Handle messages from the worker
worker.addEventListener("message", (event) => {
  const { processedData } = event.data;
  items.value = processedData;

  if (items.value) loading.value = false;
  console.log("EfficiencyBuilder", items.value);
});

const isItTodaysDataOnly = ref<boolean>(true);
/**
 * pre form data change
 */
watch(
  () => unref(analyticRawTransactionsStore.getPreFormData(unref(rawIdentification))),
  async (preForm: AnalyticRaw.IPreFormData | undefined) => {
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

// headers
const headers = computed<object[]>(() => {
  return [
    { title: "Shift", align: "center", key: "data-table-group", value: "shift", minWidth: 99.59 },
    { title: "Employee Name", align: "start", key: "emp_name", value: "emp_name" },
    {
      title: "Worked Time (hrs)",
      align: "start",
      key: "worked_hours",
      value: "worked_hours",
    },
    {
      title: "Estimated Processing Time (hrs)",
      align: "start",
      key: "processing_time",
      value: "processing_time",
    },
    {
      title: "Units Processed",
      align: "start",
      key: "processed_units",
      value: "processed_units",
    },
    {
      title: "Estimated Units Processed Per Worked Time",
      align: "start",
      key: "units_per_worked_quarters",
      value: "estimated_target.units_per_worked_quarters",
    },
    {
      title: "Difference Between Processed and Estimated",
      align: "start",
      key: "difference_units_worked_time",
      value: "estimated_target.difference_units_worked_time",
    },
    {
      title: "Target Per Hour",
      align: "start",
      key: "estimated_units_per_hr",
      value: "estimated_target.units_per_hr",
    },
    {
      title: "Target Per Shift (7.5 hrs)",
      align: "start",
      key: "estimated_units_per_8hrs",
      value: "estimated_target.units_per_8hrs",
    },
    { title: "Efficiency (%)", align: "start", key: "efficiency", value: "efficiency" },
  ];
});

// const load = async () => {
//   try {
//     const program = route.params.program as string;
//     models.value = (await new AnalyticInventoryCharacteristicManager(
//       program
//     ).get()) as EfficiencyTypes.IInventoryCharacteristic[];
//   } catch (error) {
//     console.log(error);
//   }
// };

// onMounted(async () => {
//   await load();
// });

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

const downloadHeaders = (headers.value as DataTableHeader[]).filter((col: DataTableHeader) => {
  const keyBlackList = ["id", "quarterlyChart", "dailyChart"];
  return !keyBlackList.includes(col.value);
});
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <v-card-title class="d-flex align-center">
      {{ title ?? "Employee Customization Efficiency Overview" }}
      <v-spacer></v-spacer>
      <download
        :headers="downloadHeaders"
        :items="items"
        base-save-as="Employee Efficiency"
      ></download>
    </v-card-title>
    <v-data-table
      :items="items"
      item-value="id"
      :loading="loading"
      :headers="headers"
      :group-by="[
        {
          key: 'shift',
          order: 'asc',
        },
      ]"
      multi-sort
      v-model:expanded="expanded"
      show-expand
      class="bg-surface-2"
    >
      <template v-slot:group-header="{ item, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="headers.length">
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

      <template v-slot:item.efficiency="{ item }: { item: EfficiencyTypes.IProcessedEmployee }">
        <v-chip :color="formatColorForEfficiency(item.efficiency)">
          {{ item.efficiency }}
        </v-chip>
      </template>
      <template v-slot:expanded-row="{ item }: { item: EfficiencyTypes.IProcessedEmployee }">
        <tr>
          <td :colspan="headers.length" class="pa-0">
            <template v-if="Object.keys(item.dailyChart).length > 1">
              <employee-daily-efficiency-chart
                :chart="item.dailyChart"
              ></employee-daily-efficiency-chart>
            </template>
            <template v-else>
              <!-- <employee-hourly-efficiency-chart
                :chart="item.hourlyChart"
              ></employee-hourly-efficiency-chart> -->
              <employee-quarterly-efficiency-chart
                :chart="item.quarterlyChart"
              ></employee-quarterly-efficiency-chart>
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
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
