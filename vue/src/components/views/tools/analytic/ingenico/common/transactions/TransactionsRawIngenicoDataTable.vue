<script setup lang="ts">
import { computed, onUnmounted, ref, toRefs, unref, watch } from "vue";
import { AnalyticTypes } from "./Types";
import { useAnalyticRawTableStore } from "../../../../../../../stores/analytic/useAnalyticRawIngenicoTableStore";
import moment from "moment";
import "moment-timezone";
import { TransactionsHelper } from "./TransactionsHelper";
import TransactionAdvancedSearch from "./TransactionAdvancedSearch.vue";
import { useRoute } from "vue-router";
import { useAlertStore } from "../../../../../../../stores/alertStore";
import Download from "../../../files/download/Download.vue";
import { AnalyticRawManager } from "../../../../../../../models/analytic/AnalyticRawManager";
import axios from "axios";
import { transactionsTableHeaders } from "../../../common/tableHeaders/rawTransactionsHeaders";
import { CommonAnalyticTypes } from "../../../common/types";
import { DataTableHeader } from "../../../files/download/DataTableHeader";

const props = defineProps<{
  program: AnalyticTypes.TPrograms;
  group: AnalyticTypes.TGroups;
  identification: string;
}>();

const { program, group, identification } = toRefs(props);

const store = useAnalyticRawTableStore();
const route = useRoute();
const abortController = ref<AbortController | null>(null);

const searchTerm = ref<string>("");
const searchBy = [
  "contract",
  "order_no",
  "emp_name",
  "part_no",
  "work_center_no",
  "next_work_center_no",
  "dated",
];
const sortBy: { key: string; order: "asc" | "desc" }[] = [{ key: "dated", order: "asc" }];

const loadingVersion = ref<number>(0);
const loading = ref<false | "primary-container">(false);
let every = ref<number>(1); // Start with 1-minute intervals
// Set threshold for task to be considered heavy (e.g., 10 seconds)
const TASK_THRESHOLD = 10000;

const items = ref<CommonAnalyticTypes.IAnalyticModelResponse>({
  raw: [],
  processed: [],
  missingCache: [],
});
const filteredItems = computed<CommonAnalyticTypes.IAnalyticModelResponse>(() => {
  try {
    const data = unref(items);
    const searchTermLowered = unref(searchTerm).toLocaleLowerCase();
    const filtered = ref<CommonAnalyticTypes.IAnalyticModelResponse>({
      raw: [],
      processed: [],
      missingCache: [],
    });

    if (searchTerm.value) {
      filtered.value.raw = data.raw.filter((item: CommonAnalyticTypes.IRawTransaction) => {
        for (const key of searchBy) {
          const valueFromColumnOfKey = JSON.stringify(item[key])?.toLocaleLowerCase();
          if (valueFromColumnOfKey && valueFromColumnOfKey.includes(searchTermLowered)) {
            return true;
          }
        }
        return false;
      });
      // Get a set of matching transaction_ids from filtered raw
      const validTransactionIds = new Set(
        filtered.value.raw.map((item) => String(item.transaction_id))
      );

      // Filter PROCESSED based on whether any of its transaction_ids exist in raw
      filtered.value.processed = data.processed.filter((p) =>
        p.measuredRecordIds.some((id) => validTransactionIds.has(id))
      );
    } else {
      filtered.value = data;
    }
    store.setItemsData(unref(identification), unref(filtered));

    return unref(filtered);
  } catch (error) {
    console.error(`Transactions Raw Table at filteredItems, ${error}`);
    return items.value;
  }
});

const stopInterval = ref<(() => void) | null>(null);
const handleInterval = (preForm: CommonAnalyticTypes.IPreFormData | undefined, every: number) => {
  if (preForm) {
    const si = unref(stopInterval);

    const today = new Date();

    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    if (isSameDay(preForm.endOfDay, today)) {
      stopInterval.value = TransactionsHelper.triggerAdaptiveLoad(() => load(false), every);
    } else {
      // If an interval is already running, stop it
      if (si) {
        si();
        stopInterval.value = null;
      }
    }
  }
};

const load = async (interrupt: boolean = true) => {
  try {
    const preFormData = unref(store.getPreFormData(unref(identification)));
    if (preFormData === undefined) throw new Error(`preFormData evaluates to undefined.`);

    // If there's an ongoing request, abort it
    if (abortController.value !== null) {
      if (interrupt === false) return;
      abortController.value.abort(); // Abort only if `interrupt` is true
    }

    // Create a new AbortController for the new request
    abortController.value = new AbortController();
    const arm = new AnalyticRawManager<CommonAnalyticTypes.IAnalyticModelResponse>(
      unref(program),
      unref(group)
    );
    const formData = arm.createFormData(preFormData, true);

    const startTime = performance.now();
    const res = await arm.get(formData, abortController.value.signal);
    const duration = performance.now() - startTime;

    // If the task is heavy, switch to a longer interval (5 minutes)
    if (duration > TASK_THRESHOLD) {
      // console.log(`Heavy task detected, switching to 5-minute intervals. Task time: ${duration}ms`);
      const si = unref(stopInterval);
      if (unref(every) !== 5 || !si) {
        every.value = 5;
        if (si) {
          si();
          stopInterval.value = null;
        }
        handleInterval(preFormData, unref(every));
      }
    } else {
      // console.log(`Light task detected, switching to 1-minute intervals. Task time: ${duration}ms`);
      const si = unref(stopInterval);
      if (unref(every) > 1 || !si) {
        // Switch back to 1-minute intervals
        every.value = 1;
        if (si) {
          si();
          stopInterval.value = null;
        }
        handleInterval(preFormData, unref(every));
      }
    }

    items.value = res;
    loading.value = false;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn("Transactions Raw Table at load, previous request aborted");
    } else {
      console.error(`Transactions Raw Table at load, ${error}`);
    }
  } finally {
    abortController.value = null;
  }
};

// Cleanup on component unmount
onUnmounted(() => {
  const si = unref(stopInterval);
  if (si) {
    si(); // Stops the interval
  }
});

// Watch for preFormData changes
watch(
  () => store.getPreFormData(unref(identification)),
  async () => {
    // const newPreForm = unref(newPre);

    if (loadingVersion.value) {
      useAlertStore().process("filters_applied");
    }

    loadingVersion.value += 1;
    loading.value = "primary-container";
    await load();
  },
  { deep: true }
);

// Watch for route changes
watch(
  () => route.params.sub,
  async (sub) => {
    if (sub && !unref(loading)) {
      loading.value = "primary-container";
      await load();
    }
  }
);
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <v-card-title class="d-flex align-center">
      <span>Transactions</span>

      <v-spacer></v-spacer>

      <v-text-field
        class="me-4"
        v-model="searchTerm"
        density="compact"
        :label="$t(`tools.common.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>

      <download
        :headers="(transactionsTableHeaders as DataTableHeader[])"
        :items="filteredItems.raw"
        base-save-as="Ingenico Raw Transactions"
      ></download>
    </v-card-title>

    <transaction-advanced-search
      :program="program"
      :identification="identification"
    ></transaction-advanced-search>

    <v-data-table
      v-model:search="searchTerm"
      :items="filteredItems.raw"
      :loading="loading"
      :headers="transactionsTableHeaders"
      :sort-by="sortBy"
      multi-sort
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: 50, title: '50' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      class="bg-surface-2"
    >
      <template v-slot:item.dated="{ item }: { item: CommonAnalyticTypes.IRawTransaction }">
        {{ moment.utc(item.dated).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </v-data-table>
  </v-card>
</template>
