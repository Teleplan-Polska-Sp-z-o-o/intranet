<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref, watch } from "vue";
import { useRoute } from "vue-router";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticFileHelper } from "../../files/drive/AnalyticFileHelper";
import { AnalyticTypes } from "../../files/Types";
import { KPITypes } from "./Types";
import { AnalyticRaw } from "../transactions/Types";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawTableStore";

// import { useI18n } from "vue-i18n";

const route = useRoute();
const analyticFileManager: AnalyticFileManager = new AnalyticFileManager();
const analyticRawTransactionsStore = useAnalyticRawTableStore();

const props = defineProps<{
  rawIdentification: string;
}>();

const { rawIdentification } = toRefs(props);

// required items
// models
const modelsObj = ref<KPITypes.IModelsObj>([]);
const uniqueModelGroups = ref<string[]>([]);
const modelLetter = ref<[string, string][]>([]);
// plan
const planObj = ref<any>(null);

// packed
const rawTransactions = ref<AnalyticRaw.TTransactions>([]);
const items = ref<KPITypes.IPackedRowWithModels[]>([]);
const loading = ref<false | "primary-container">("primary-container");

/**
 * Loading current transactions
 */
watch(
  () => unref(analyticRawTransactionsStore.getItemsData(unref(rawIdentification))),
  async (newRawTransactions: AnalyticRaw.TTransactions) => {
    rawTransactions.value = newRawTransactions;
    items.value = new KPITypes.PackedBuilder(
      unref(rawTransactions),
      unref(modelsObj),
      unref(planObj)
    ).tablePackedRows;
    if (items.value) loading.value = false;
    //
    // console.log(items.value);
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
  return unref(uniqueModelGroups).map((uniqueModelGroup) => {
    return {
      title: `Group ${uniqueModelGroup}`,
      align: "center",
      children: [
        { title: "Packed (Units)", align: "center", value: `${uniqueModelGroup}.packedUnits` },
        { title: "Target (Units)", align: "center", value: `${uniqueModelGroup}.targetUnits` },
        { title: "Target (%)", align: "center", value: `${uniqueModelGroup}.targetPercent` },
      ],
    };
  });
});

const baseHeaders: any = [
  // { title: "Shift", value: "shift" },
  { title: "Shift", align: "center", key: "data-table-group", minWidth: 99.59 },
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

  const requiredFiles: AnalyticTypes.IAnalyticFileEntity[] =
    await analyticFileManager.getByProgAndCatAndSub(progName, catName, "drive");
  const consideredRequiredFiles: AnalyticTypes.IAnalyticFileEntity[] =
    AnalyticFileHelper.addConsideredProperty(requiredFiles);

  try {
    const modelsParsed = JSON.parse(
      consideredRequiredFiles.find((file) => file.considered && file.fileType === "models")
        ?.jsObjectJson!
    );
    modelsObj.value = modelsParsed[Object.keys(modelsParsed)[0]];
    uniqueModelGroups.value = [
      ...new Set(
        unref(modelsObj)
          .map((item) => item.GROUP_NAME)
          .filter((name) => name !== null)
      ),
    ];
    modelLetter.value = unref(modelsObj).map((model: any) => [
      model.IFS_PART_NO,
      model.GROUP_LETTER,
    ]);

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
const formatColorOfTargetPercent = (item: KPITypes.IPackedRowWithModels, model?: string) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const modelIndicators = model ? (item[model] as KPITypes.IPackedModelIndicator) : item;
  // Check if it's today's data only
  if (unref(isItTodaysDataOnly) && model && item[model]) {
    const startHour = item.hour;
    const endHour = item.hour + 1;

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
const formatSlotHour = (hour: number, type: "start" | "end") =>
  `${String((hour + (type === "end" ? 1 : 0)) % 24).padStart(2, "0")}:00`;
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <!-- <v-card-title class="d-flex align-center">
      KPI
      <v-spacer></v-spacer>
    </v-card-title> -->

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
        v-for="model in uniqueModelGroups"
        :key="model"
        v-slot:[`item.${model}.targetPercent`]="{ item }: { item: KPITypes.IPackedRowWithModels }"
      >
        <v-chip v-if="item[model]" :color="formatColorOfTargetPercent(item, model)">
          {{ (item[model] as KPITypes.IPackedModelIndicator)?.targetPercent }}
        </v-chip>
      </template>
      <template v-slot:item.targetPercent="{ item }: { item: KPITypes.IPackedRowWithModels }">
        <v-chip :color="formatColorOfTargetPercent(item)">
          {{ item.targetPercent }}
        </v-chip>
      </template>
      <template v-slot:item.hourStart="{ item }: { item: any }">
        {{ formatSlotHour(item.hour, "start") }}
      </template>
      <template v-slot:item.hourEnd="{ item }: { item: any }">
        {{ formatSlotHour(item.hour, "end") }}
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
