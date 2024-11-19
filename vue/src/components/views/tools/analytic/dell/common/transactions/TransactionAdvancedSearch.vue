<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref } from "vue";
import { AnalyticRaw } from "./Types";
import { useAnalyticRawTableStore } from "../../../../../../../stores/analytic/useAnalyticRawDellTableStore";

// import { useI18n } from "vue-i18n";
const store = useAnalyticRawTableStore();

const props = defineProps<{
  identification: string;
}>();

const { identification } = toRefs(props);

// const contractOptions = TransactionsHelper.getContractsByProgram(unref(program));
// const contractsInput = ref<string[]>(contractOptions);

const dateRangeInput = ref<Date[]>([new Date()]);
const dateRangeComputed = computed(() => {
  const input = unref(dateRangeInput);

  const now = new Date();
  const currentHour = now.getHours();

  // Determine baseDate: if currentHour is between 00:00 and 06:00, use the previous day
  const baseDate =
    currentHour >= 0 && currentHour < 6 ? new Date(now.getTime() - 24 * 60 * 60 * 1000) : now; // Subtract 1 day in milliseconds

  // Set currentDate to 06:00 on the baseDate (either today or previous day depending on shift)
  const currentDate = new Date(baseDate.setHours(6, 0, 0, 0));

  // Set startOfDay to 06:00 of the first input date or baseDate
  const startOfDay: Date = input.at(0) ? new Date(input.at(0)!.setHours(6, 0, 0, 0)) : currentDate; // Clone input date and set to 06:00 // Default to currentDate

  // Set endOfDay to 06:00 of the last input date or baseDate (default case)
  let endOfDay: Date = currentDate;

  // Set endOfDay to 06:00 of the last input date or baseDate (default case)
  const lastInputDate = input.at(input.length - 1);
  if (lastInputDate) {
    endOfDay = new Date(lastInputDate.setHours(6, 0, 0, 0));
  }

  return {
    startOfDay,
    endOfDay,
  };
});

const preFormData = computed<AnalyticRaw.IPreFormData>(() => {
  return {
    startOfDay: unref(dateRangeComputed).startOfDay ?? new Date(),
    endOfDay: unref(dateRangeComputed).endOfDay ?? new Date(),
  };
});

const open = ref<boolean>(false);
const submit = () => {
  store.setPreFormData(unref(identification), unref(preFormData));
  open.value = false;
};

onMounted(() => submit());
</script>

<template>
  <v-expansion-panels flat v-model="open">
    <v-expansion-panel bg-color="surface-2">
      <v-expansion-panel-title>
        <v-icon icon="mdi-filter-multiple-outline"></v-icon>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form @submit.prevent="submit">
          <v-date-input
            v-model="dateRangeInput"
            multiple="range"
            label="Date Range"
            variant="solo-filled"
            hint="Select a start and end date to define the search range, or pick a single date for a specific day."
            persistent-hint
            flat
            :first-day-of-week="1"
          ></v-date-input>

          <v-sheet class="bg-surface-2 d-flex flex-column justify-end">
            <v-btn
              class="rounded-xl mt-2 me-4 ms-auto"
              type="submit"
              prepend-icon="mdi-filter-check-outline"
              color="primary-container"
              flat
            >
              Apply Filters
            </v-btn>
          </v-sheet>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
