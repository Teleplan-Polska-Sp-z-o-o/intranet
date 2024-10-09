<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref, watch } from "vue";
import { useRoute } from "vue-router";
import { AnalyticFileManager } from "../../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticFileHelper } from "../../../files/drive/AnalyticFileHelper";
import { AnalyticFileTypes } from "../../../files/Types";
import { AnalyticRaw } from "../../transactions/Types";
import { useAnalyticRawTableStore } from "../../../../../../../stores/analytic/useAnalyticRawTableStore";
//
import { EfficiencyTypes } from "../../common/efficiency/Types";
import EmployeeDailyEfficiencyChart from "../../common/efficiency/EmployeeDailyEfficiencyChart.vue";
import EmployeeQuarterlyEfficiencyChart from "../../common/efficiency/EmployeeQuarterlyEfficiencyChart.vue";
import EfficiencyWorker from "../../common/efficiency/EfficiencyWorker?worker";
import Download from "../../common/download/Download.vue";
import { DataTableHeader } from "../../common/download/DataTableHeader";

const route = useRoute();
const analyticFileManager: AnalyticFileManager = new AnalyticFileManager();
const analyticRawTransactionsStore = useAnalyticRawTableStore();

const props = defineProps<{
  rawIdentification: string;
}>();

const { rawIdentification } = toRefs(props);

// required items
// models
const modelsObj = ref<EfficiencyTypes.IModelsObj>([]);
// packed
const rawTransactions = ref<AnalyticRaw.TTransactions>([]);

// table items

const items = ref<EfficiencyTypes.IProcessedEmployees>([]);
const expanded = ref<string[]>([]);
const loading = ref<false | "primary-container">("primary-container");
const worker = new EfficiencyWorker();

/**
 * Loading current transactions
 */
watch(
  () => unref(analyticRawTransactionsStore.getItemsData(unref(rawIdentification))),
  async (newRawTransactions: AnalyticRaw.TTransactions) => {
    rawTransactions.value = newRawTransactions;

    if (!unref(modelsObj) && !unref(modelsObj).at(0)) return;

    function hasTTOobaProperty(
      model: EfficiencyTypes.IModelObj
    ): model is EfficiencyTypes.TOobaModelObj {
      return "TT_OOBA" in model;
    }

    const oobaModelsObj = unref(modelsObj).filter(
      hasTTOobaProperty
    ) as EfficiencyTypes.TOobaModelObj[];

    if (oobaModelsObj.length === 0) {
      throw new Error("No models found with the 'TT_OOBA' property");
    }

    // const builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TOobaModelObj>(
    //   rawTransactions.value,
    //   oobaModelsObj,
    //   "TT_OOBA"
    // );
    // items.value = builder.getProcessedData();

    // if (items.value) loading.value = false;
    // //
    // // console.log(items.value);

    // Serialize data before sending it to the worker
    const serializedRawTransactions = JSON.stringify(unref(rawTransactions));
    const serializedModelsObj = JSON.stringify(unref(modelsObj));

    // Post the data to the worker, including the model type
    worker.postMessage({
      rawTransactions: serializedRawTransactions,
      modelsObj: serializedModelsObj,
      modelType: "TOobaModelObj", // Send the model type (e.g., "TCosmModelObj")
    });
  },
  { deep: true }
);

// Handle messages from the worker
worker.addEventListener("message", (event) => {
  const { processedData } = event.data;
  items.value = processedData;

  if (items.value) loading.value = false;
  // console.log("EfficiencyBuilder", items.value);
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
    { title: "Shift", align: "center", key: "data-table-group", minWidth: 99.59 },
    { title: "Employee Name", align: "start", key: "emp_name" },
    { title: "Worked Time (hrs)", align: "start", key: "worked_quarters" },
    { title: "Estimated Processing Time (hrs)", align: "start", key: "processing_time" },
    { title: "Processed Units", align: "start", key: "processed_units" },
    { title: "Efficiency (%)", align: "start", key: "efficiency" },
  ];
});

const load = async () => {
  // Route params
  const progName = route.params.program as string;
  const catName = route.params.cat as string;

  const requiredFiles: AnalyticFileTypes.IAnalyticFileEntity[] =
    await analyticFileManager.getByProgAndCatAndSub(progName, catName, "drive");
  const consideredRequiredFiles: AnalyticFileTypes.IAnalyticFileEntity[] =
    AnalyticFileHelper.addConsideredProperty(requiredFiles);

  try {
    const modelsParsed = JSON.parse(
      consideredRequiredFiles.find((file) => file.considered && file.fileType === "models")
        ?.jsObjectJson!
    );
    modelsObj.value = modelsParsed[Object.keys(modelsParsed)[0]];

    // get targets for efficiency
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await load();
});

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
      Employee OOBA Efficiency Overview
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
          <td :colspan="headers.length">
            <template v-if="Object.keys(item.dailyChart).length > 1">
              <employee-daily-efficiency-chart
                :chart="item.dailyChart"
              ></employee-daily-efficiency-chart>
            </template>
            <template v-else>
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
