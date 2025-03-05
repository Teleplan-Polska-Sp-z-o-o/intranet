<script setup lang="ts">
import { computed, onUnmounted, ref, toRefs, unref, watch } from "vue";
import { AnalyticRaw } from "./Types";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawSkyTableStore2";
import { TimeHelper } from "../../../../../../models/common/TimeHelper";
import { TransactionsHelper } from "./TransactionsHelper";
import TransactionAdvancedSearch from "./TransactionAdvancedSearch.vue";
import { useRoute } from "vue-router";
import { useAlertStore } from "../../../../../../stores/alertStore";
import Download from "../common/download/Download.vue";
import { DataTableHeader } from "../common/download/DataTableHeader";
import { AnalyticRawManager } from "../../../../../../models/analytic/AnalyticRawManager";
import axios from "axios";
import { TimerManager } from "../common/debug/Timers";

const props = defineProps<{
  program: AnalyticRaw.TPrograms;
  group: AnalyticRaw.TGroups;
  identification: string;
}>();

const { program, group, identification } = toRefs(props);

const store = useAnalyticRawTableStore();
const route = useRoute();
const abortController = ref<AbortController | null>(null);

///
// OLD
///
// const headers: any = computed(() => {
//   const colsToManage = {
//     serial: { title: "Serial No", align: "start", key: "serial_no", value: "serial_no" },
//     emp: { title: "Employee Name", align: "start", key: "emp_name", value: "emp_name" },
//     box: { title: "Box Id", align: "start", key: "box_id", value: "box_id" },
//     host: { title: "Hostname", align: "start", key: "hostname", value: "hostname" },
//   };
//   const injectedColumns =
//     unref(group) === "test" ? Object.values(colsToManage) : [colsToManage.emp];
//   return [
//     { title: "Contract", align: "start", key: "contract", value: "contract" },
//     { title: "Order No", align: "start", key: "order_no", value: "order_no" },
//     // { title: "Employee Name", align: "start", key: "emp_name", value: "emp_name" },
//     ...injectedColumns,
//     { title: "Part No", align: "start", key: "part_no", value: "part_no" },
//     {
//       title: "From Work Center No",
//       align: "start",
//       key: "work_center_no",
//       value: "work_center_no",
//     },
//     { title: "Date", align: "start", key: "datedtz", value: "datedtz" },
//   ];
// });
///
// NEW
///
const headers: any = computed(() => {
  const colsToManage = {
    serial: { title: "Serial No", align: "start", key: "serial_no", value: "serial_no" },
    emp: { title: "Employee HR ID", align: "start", key: "emp_hrid", value: "emp_hrid" },
    box: { title: "Box ID", align: "start", key: "box_id", value: "box_id" },
    host: { title: "Hostname", align: "start", key: "hostname", value: "hostname" },
  };

  const injectedColumns =
    unref(group) === "test" ? Object.values(colsToManage) : [colsToManage.emp];

  return [
    { title: "Transaction ID", align: "start", key: "transaction_id", value: "transaction_id" },
    { title: "Part No", align: "start", key: "part_no", value: "part_no" },
    { title: "Test Date", align: "start", key: "test_date", value: "test_date" },
    ...injectedColumns,
  ];
});
///

const searchTerm = ref<string>(""); // search input
///
// OLD
///
// const searchBy = ["contract", "order_no", "emp_name", "part_no", "work_center_no", "datedtz"];
///
// NEW
///
const searchBy = [
  "transaction_id",
  "part_no",
  "test_date",
  "serial_no",
  "emp_hrid",
  "box_id",
  "hostname",
];
///

///
// OLD
///
// const sortBy: { key: string; order: "asc" | "desc" }[] = [{ key: "datedtz", order: "asc" }];
///
// NEW
///
const sortBy: { key: string; order: "asc" | "desc" }[] = [{ key: "test_date", order: "asc" }];
///

const loadingVersion = ref<number>(0);
const loading = ref<false | "primary-container">(false);
let every = ref<number>(1); // Start with 1-minute intervals
// Set threshold for task to be considered heavy (e.g., 10 seconds)
const TASK_THRESHOLD = 10000;

///
// OLD
///
// const items = ref<AnalyticRaw.TTransactions>([]);
// const filteredItems = computed<AnalyticRaw.TTransactions>(() => {
//   try {
//     const data = unref(items);
//     const searchTermLowered = unref(searchTerm).toLocaleLowerCase();
//     const filtered = ref<AnalyticRaw.TTransactions>([]);

//     if (searchTerm.value) {
//       filtered.value = data.filter((item: AnalyticRaw.ITransactionsRow) => {
//         for (const key of searchBy) {
//           const valueFromColumnOfKey = JSON.stringify(item[key])?.toLocaleLowerCase();
//           if (valueFromColumnOfKey && valueFromColumnOfKey.includes(searchTermLowered)) {
//             return true;
//           }
//         }
//         return false;
//       });
//     } else {
//       filtered.value = data;
//     }

//     store.setItemsData(unref(identification), unref(filtered));
//     return unref(filtered);
//   } catch (error) {
//     console.error(`Transactions Raw Table at filteredItems, ${error}`);
//     return items.value;
//   }
// });
///
// NEW
///
const items = ref<AnalyticRaw.TTransactions>([]);
const filteredItems = computed<AnalyticRaw.TTransactions>(() => {
  try {
    const data = unref(items);
    const searchTermLowered = unref(searchTerm).toLocaleLowerCase();
    const filtered = ref<AnalyticRaw.TTransactions>([]);

    if (searchTerm.value) {
      filtered.value = data.filter((item: AnalyticRaw.ITransactionsRow) => {
        for (const key of searchBy) {
          const valueFromColumnOfKey = JSON.stringify(item[key])?.toLocaleLowerCase();
          if (valueFromColumnOfKey && valueFromColumnOfKey.includes(searchTermLowered)) {
            return true;
          }
        }
        return false;
      });
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
const handleInterval = (preForm: AnalyticRaw.IPreFormData | undefined, every: number) => {
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

///
// OLD
///
// const load = async (interrupt: boolean = true) => {
//   try {
//     const preFormData = unref(store.getPreFormData(unref(identification)));
//     if (preFormData === undefined) throw new Error(`preFormData evaluates to undefined.`);

//     // If there's an ongoing request, abort it
//     if (abortController.value !== null) {
//       if (interrupt === false) return;
//       abortController.value.abort(); // Abort only if `interrupt` is true
//     }

//     const tm = TimerManager.getInstance();
//     if (tm.isTimerRunning("raw")) {
//       tm.startTimer("raw");
//     }

//     abortController.value = new AbortController();
//     const arm = new AnalyticRawManager<AnalyticRaw.TTransactions>(unref(program), unref(group));
//     const formData = arm.createFormData(preFormData);

//     const startTime = performance.now();
//     const res = await arm.get(formData, abortController.value.signal);

//     const res2 = await arm.get2(formData, undefined);
//     console.log("titan test ver2: ", res2);

//     const duration = performance.now() - startTime;

//     // If the task is heavy, switch to a longer interval (5 minutes)
//     if (duration > TASK_THRESHOLD) {
//       // console.log(`Heavy task detected, switching to 5-minute intervals. Task time: ${duration}ms`);
//       const si = unref(stopInterval);
//       if (unref(every) !== 5 || !si) {
//         every.value = 5;
//         if (si) {
//           si();
//           stopInterval.value = null;
//         }
//         handleInterval(preFormData, unref(every));
//       }
//     } else {
//       // console.log(`Light task detected, switching to 1-minute intervals. Task time: ${duration}ms`);
//       const si = unref(stopInterval);
//       if (unref(every) > 1 || !si) {
//         // Switch back to 1-minute intervals
//         every.value = 1;
//         if (si) {
//           si();
//           stopInterval.value = null;
//         }
//         handleInterval(preFormData, unref(every));
//       }
//     }

//     items.value = res;
//     loading.value = false;
//   } catch (error) {
//     if (axios.isCancel(error)) {
//       console.log("Transactions Raw Table at load, previous request aborted");
//     } else {
//       console.error(`Transactions Raw Table at load, ${error}`);
//     }
//   } finally {
//     abortController.value = null;
//   }
// };
///
// NEW
///
const load = async (interrupt: boolean = true) => {
  try {
    const preFormData = unref(store.getPreFormData(unref(identification)));
    if (preFormData === undefined) throw new Error(`preFormData evaluates to undefined.`);

    // If there's an ongoing request, abort it
    if (abortController.value !== null) {
      if (interrupt === false) return;
      abortController.value.abort(); // Abort only if `interrupt` is true
    }

    const tm = TimerManager.getInstance();
    if (tm.isTimerRunning("raw")) {
      tm.startTimer("raw");
    }

    abortController.value = new AbortController();
    const arm = new AnalyticRawManager<AnalyticRaw.TTransactions>(unref(program), unref(group));
    const formData = arm.createFormData(preFormData);

    const startTime = performance.now();
    const res = await arm.get2(formData, abortController.value.signal);

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
      console.log("Transactions Raw Table at load, previous request aborted");
    } else {
      console.error(`Transactions Raw Table at load, ${error}`);
    }
  } finally {
    abortController.value = null;
  }
};
///

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

const downloadHeaders = (unref(headers) as DataTableHeader[]).filter((col: DataTableHeader) => {
  const keyBlackList = ["transaction_id"];
  return !keyBlackList.includes(col.value);
});
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
        :headers="downloadHeaders"
        :items="filteredItems"
        base-save-as="SKY Raw Transactions"
      ></download>
    </v-card-title>

    <transaction-advanced-search
      :program="program"
      :identification="identification"
    ></transaction-advanced-search>

    <v-data-table
      v-model:search="searchTerm"
      :items="filteredItems"
      :loading="loading"
      :headers="headers"
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
      <template v-slot:item.datedtz="{ item }: { item: AnalyticRaw.ITransactionsRow }">
        {{ TimeHelper.removeTimezone(TimeHelper.convertToLocalTime(item.datedtz)) }}
      </template>
    </v-data-table>
  </v-card>
</template>
