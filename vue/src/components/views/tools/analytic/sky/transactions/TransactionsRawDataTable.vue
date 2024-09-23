<script setup lang="ts">
import { computed, ref, toRefs, unref, watch } from "vue";
import { AnalyticRaw } from "./Types";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawTableStore";
import { TimeHelper } from "../../../../../../models/common/TimeHelper";
import { TransactionsHelper } from "./TransactionsHelper";
import TransactionAdvancedSearch from "./TransactionAdvancedSearch.vue";
import { useRoute } from "vue-router";
// import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
// import { useI18n } from "vue-i18n";

const props = defineProps<{
  manager: AnalyticRaw.TManager;
  identification: string;
}>();

const { manager, identification } = toRefs(props);

// store
const store = useAnalyticRawTableStore();
// const analyticStore = useAnalyticStore();
const route = useRoute();

// headers
// const { t } = useI18n();
const headers: any = [
  // { title: "Transaction ID", align: "start", key: "transaction_id" },
  { title: "Contract", align: "start", key: "contract" },
  { title: "Order No", align: "start", key: "order_no" },
  { title: "Employee Name", align: "start", key: "emp_name" },
  { title: "Part No", align: "start", key: "part_no" },
  { title: "From Work Center No", align: "start", key: "work_center_no" },
  // { title: "Next Work Center No", align: "start", key: "next_work_center_no" },
  { title: "Date", align: "start", key: "datedtz" },
];

// search input
const searchTerm = ref<string>("");
const searchBy = [
  "contract",
  "order_no",
  "emp_name",
  "part_no",
  "work_center_no",
  // "next_work_center_no",
  "datedtz",
];
const sortBy: { key: string; order: "asc" | "desc" }[] = [{ key: "datedtz", order: "asc" }];

// states
const loading = ref<false | "primary-container">(false);

// items
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

const load = async () => {
  try {
    // console.log("start load");
    // const startTime = performance.now();

    const m = unref(manager.value);
    const preFormData = store.getPreFormData(unref(identification));
    if (!preFormData) throw new Error(`preFormData evaluates to ${preFormData}`);
    const formData = m.createFormData(unref(preFormData));
    items.value = await m.get(formData);

    // const endTime = performance.now(); // Track end time in milliseconds
    // const timeTaken = endTime - startTime; // Calculate time difference
    // console.log(`Load completed in ${timeTaken.toFixed(2)} milliseconds`);
  } catch (error) {
    console.error(`Transactions Raw Table at load, ${error}`);
  }
};

const stopInterval = ref<(() => void) | null>(null);
/**
 * Loading items based on pre form data change
 */
watch(
  () => unref(store.getPreFormData(unref(identification))),
  async (preForm: AnalyticRaw.IPreFormData | undefined) => {
    if (!unref(loading)) {
      loading.value = "primary-container";
      await load();
      loading.value = false;
    }

    if (preForm) {
      const today = new Date();

      const isSameDay = (date1: Date, date2: Date) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };

      if (isSameDay(preForm.endOfDay, today)) {
        // If no interval is running, trigger a new one
        if (!unref(stopInterval)) {
          stopInterval.value = TransactionsHelper.triggerLoadAtEachMinute(load);
        }
      } else {
        // If an interval is already running, stop it
        if (unref(stopInterval)) {
          unref(stopInterval)!();
          stopInterval.value = null;
        }
      }
    }
  },
  { deep: true }
);

watch(
  () => route.params.sub,
  async (sub) => {
    if (sub && !unref(loading)) {
      loading.value = "primary-container";
      await load();
      loading.value = false;
    }
  }
);
</script>

<template>
  <v-card class="bg-surface-2 pa-4 ma-1 rounded-xl elevation-2">
    <v-card-title class="d-flex align-center">
      <v-spacer></v-spacer>

      <v-text-field
        v-model="searchTerm"
        density="compact"
        :label="$t(`tools.common.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <transaction-advanced-search
      :manager="manager"
      :identification="identification"
    ></transaction-advanced-search>

    <v-data-table
      v-model:search="searchTerm"
      :items="filteredItems"
      :loading="loading"
      :headers="headers"
      :sort-by="sortBy"
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
