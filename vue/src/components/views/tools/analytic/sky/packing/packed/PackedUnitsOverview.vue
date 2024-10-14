<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref, watch } from "vue";
import { useRoute } from "vue-router";
import { AnalyticFileManager } from "../../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticFileHelper } from "../../../files/drive/AnalyticFileHelper";
import { AnalyticFileTypes } from "../../../files/Types";
import { PackedTypes } from "./Types";
import { AnalyticRaw } from "../../transactions/Types";
import { useAnalyticRawTableStore } from "../../../../../../../stores/analytic/useAnalyticRawSkyTableStore";
import Download from "../../common/download/Download.vue";
import PackedWorker from "./packedWorker.ts?worker";
import { TimerManager } from "../../common/debug/Timers";

const route = useRoute();
const analyticFileManager: AnalyticFileManager = new AnalyticFileManager();
const analyticRawTransactionsStore = useAnalyticRawTableStore();

const props = defineProps<{
  rawIdentification: string;
}>();

const { rawIdentification } = toRefs(props);

// required items
// models
const modelsObj = ref<PackedTypes.IModelObjs>([]);
const uniqueModelLetters = ref<string[]>([]);
// const uniqueModelGroups = ref<string[]>([]);
// const uniqueModelGroupLetter = ref<[string, string][]>([]);
// const modelLetter = ref<[string, string][]>([]);
// plan
const planObj = ref<PackedTypes.IPlanObjs>([]);

// packed
const rawTransactions = ref<AnalyticRaw.TTransactions>([]);
const items = ref<PackedTypes.ITablePackedRow[]>([]);
const loading = ref<false | "primary-container">("primary-container");

const createWorkerAndProcess = (
  rawTransactions: AnalyticRaw.TTransactions,
  modelsObj: PackedTypes.IModelObjs,
  plansObj: PackedTypes.IPlanObjs
) => {
  const worker = new PackedWorker();

  // Function to convert string to ArrayBuffer
  function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer; // Returns ArrayBuffer
  }

  // Serialize the data before sending to the worker
  const serializedRawTransactions = JSON.stringify(rawTransactions);
  const rawTransactionsBuffer = stringToArrayBuffer(serializedRawTransactions);
  const serializedModelsObj = JSON.stringify(modelsObj);
  const serializedPlansObj = JSON.stringify(plansObj);
  worker.postMessage(
    {
      rawTransactions: rawTransactionsBuffer,
      modelsObj: serializedModelsObj,
      planObj: serializedPlansObj,
    },
    [rawTransactionsBuffer]
  );

  // Handle messages from the worker
  worker.addEventListener("message", (event: MessageEvent<any>) => {
    const { packedRows } = event.data;
    items.value = packedRows;
    if (items.value) loading.value = false;

    // Terminate the worker after it's done processing
    worker.terminate();
  });

  // Handle errors (optional)
  worker.addEventListener("error", (error) => {
    console.error("Worker error:", error);
    worker.terminate();
  });
};

/**
 * Loading current transactions
 */
watch(
  () => unref(analyticRawTransactionsStore.getItemsData(unref(rawIdentification))),
  async (newRawTransactions: AnalyticRaw.TTransactions) => {
    rawTransactions.value = newRawTransactions;

    createWorkerAndProcess(unref(rawTransactions), unref(modelsObj), unref(planObj));

    const tm = TimerManager.getInstance();
    if (tm.isTimerRunning("raw")) {
      tm.stopTimer("raw");
    }
  },
  { deep: true }
);

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
const modelHeaders = computed(() => {
  return unref(uniqueModelLetters).map((letter) => {
    return {
      title: `Group ${letter}`,
      value: letter,
      align: "center",
      children: [
        { title: "Packed (Units)", align: "center", value: `${letter}.packedUnits` },
        { title: "Target (Units)", align: "center", value: `${letter}.targetUnits` },
        { title: "Target (%)", align: "center", value: `${letter}.targetPercent` },
      ],
    };
  });
});

const baseHeaders: any = [
  { title: "Shift", align: "center", key: "data-table-group", value: "shift", minWidth: 99.59 },
  {
    title: "Time Range",
    align: "center",
    children: [
      { title: "Start (Hour)", value: "hourStart" },
      { title: "End (Hour)", value: "hourEnd" },
    ],
  },
  {
    title: "Total (For Planned Groups)",
    align: "center",
    children: [
      { title: "Packed (Units)", align: "center", value: "packedUnits" },
      { title: "Target (Units)", align: "center", value: "targetUnits" },
      { title: "Target (%)", align: "center", value: "targetPercent" },
    ],
  },
];

const headers = computed<any>(() => {
  const modHeaders = unref(modelHeaders);
  return [...baseHeaders.slice(0, 2), ...modHeaders, ...baseHeaders.slice(2)];
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
    // console.log(modelsObj.value);
    uniqueModelLetters.value = [
      ...new Set(
        unref(modelsObj)
          .map((item) => item.GROUP_LETTER)
          .filter((name) => name !== null)
      ),
    ];

    const plansParsed = JSON.parse(
      consideredRequiredFiles.find((file) => file.considered && file.fileType === "planning")
        ?.jsObjectJson!
    );
    planObj.value = plansParsed[Object.keys(plansParsed)[0]];
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await load();
});

// format
const formatHeaderTooltip = (column: any) => {
  return unref(modelsObj).find((model) => model.GROUP_LETTER === column.value)?.GROUP_NAME;
};

// const formatShiftGroup = (shift: 1 | 2 | 3 | 4) => {
//   if (shift === 4) return "Summary";
//   else return shift;
// };

const formatColorOfTargetPercent = (item: PackedTypes.ITablePackedRow, model?: string) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const modelIndicators = model ? (item[model] as PackedTypes.IPackedModelIndicator) : item;
  // Check if it's today's data only
  if (unref(isItTodaysDataOnly) && model && item[model]) {
    const startHour = parseInt(item.hourStart.split(":")[0], 10);
    const endHour = parseInt(item.hourEnd.split(":")[0], 10);

    // Check if current time falls between the current hour and the next hour
    if (currentHour >= startHour && currentHour < endHour) {
      const minutesPassed = currentMinute; // Minutes passed in this hour
      const totalMinutes = 60;
      const timePercentage = minutesPassed / totalMinutes;

      // Check if targetUnits is not "-"

      if (
        modelIndicators.targetUnits &&
        typeof modelIndicators.targetUnits === "number" &&
        modelIndicators.targetUnits > 0
      ) {
        const expectedUnits = modelIndicators.targetUnits * timePercentage;
        const actualUnits = modelIndicators.packedUnits;

        // Determine color based on actual vs expected units packed
        if (actualUnits >= expectedUnits) {
          if (actualUnits > expectedUnits) {
            return "blue"; // Exceeding the target
          }
          return "green"; // On track
        } else if (actualUnits >= expectedUnits * 0.8) {
          return "orange"; // Slightly behind
        } else {
          return "red"; // Significantly behind
        }
      } else return undefined;
    }
  }

  // Fallback if it's not today's data or if outside time range
  if (modelIndicators.targetUnits && typeof modelIndicators.targetPercent === "number") {
    if (modelIndicators.targetPercent >= 100) {
      return "blue"; // Exceeded the target
    } else if (modelIndicators.targetPercent >= 80) {
      return "green"; // Close to the target
    } else if (modelIndicators.targetPercent >= 50) {
      return "orange"; // Moderate progress
    } else {
      return "red"; // Far from target
    }
  } else return undefined;
};

// const formatSlotHour = (hour: number, shift: 1 | 2 | 3 | 4, type: "start" | "end") => {
//   // If the hour is 25, handle it as a summary case
//   if (hour === 25) {
//     // Define the starting and ending hours for each shift
//     const shiftStartEnd = {
//       1: { start: 6, end: 14 }, // Shift 1: 6 AM to 2 PM
//       2: { start: 14, end: 22 }, // Shift 2: 2 PM to 10 PM
//       3: { start: 22, end: 6 }, // Shift 3: 10 PM to 6 AM
//       4: { start: 6, end: 6 }, // Shift 4: 6 AM to 6 AM (whole day summary)
//     };

//     // Return the start or end hour based on the type
//     return type === "start"
//       ? `${String(shiftStartEnd[shift].start).padStart(2, "0")}:00`
//       : `${String(shiftStartEnd[shift].end).padStart(2, "0")}:00`;
//   }

//   return `${String((hour + (type === "end" ? 1 : 0)) % 24).padStart(2, "0")}:00`;
// };
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <v-card-title class="d-flex align-center">
      Packed Units Overview
      <v-spacer></v-spacer>
      <download :headers="headers" :items="items" base-save-as="Packed Units"></download>
    </v-card-title>

    <v-data-table
      :items="items"
      :loading="loading"
      :headers="headers"
      :group-by="[
        {
          key: 'shift',
          order: 'asc',
        },
      ]"
      :items-per-page="-1"
      hide-default-footer
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
            {{ item.value }}
          </td>
        </tr>
      </template>

      <template
        v-for="letter in uniqueModelLetters"
        :key="letter"
        v-slot:[`header.${letter}`]="{ column }"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <div v-bind="tooltip">
              <span>{{ column.title }}</span>
              <v-icon icon="mdi-information-slab-symbol" class="mb-1"></v-icon>
            </div>
          </template>
          <span>{{ formatHeaderTooltip(column) }}</span>
        </v-tooltip>
      </template>

      <template
        v-for="letter in uniqueModelLetters"
        :key="letter"
        v-slot:[`item.${letter}.targetPercent`]="{ item }: { item: PackedTypes.ITablePackedRow }"
      >
        <v-chip v-if="item[letter]" :color="formatColorOfTargetPercent(item, letter)">
          {{ (item[letter] as PackedTypes.IPackedModelIndicator)?.targetPercent }}
        </v-chip>
      </template>

      <template v-slot:item.targetPercent="{ item }: { item: PackedTypes.ITablePackedRow }">
        <v-chip :color="formatColorOfTargetPercent(item)">
          {{ item.targetPercent }}
        </v-chip>
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
