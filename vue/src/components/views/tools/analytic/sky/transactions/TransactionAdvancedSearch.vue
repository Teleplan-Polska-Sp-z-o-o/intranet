<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref } from "vue";
import { AnalyticRaw } from "./Types";
import { TransactionsHelper } from "./TransactionsHelper";
import { useAnalyticRawTableStore } from "../../../../../../stores/analytic/useAnalyticRawTableStore";

// import { useI18n } from "vue-i18n";
const store = useAnalyticRawTableStore();

const props = defineProps<{
  manager: AnalyticRaw.TManager;
  identification: string;
}>();

const { manager, identification } = toRefs(props);

const contractOptions = TransactionsHelper.getContractsByProgram(unref(manager).program);
const contractsInput = ref<string[]>(contractOptions);

const dateRangeInput = ref<Date[]>([new Date()]);
const dateRangeComputed = computed(() => {
  const input = unref(dateRangeInput);
  const startOfDay: Date | undefined =
    input.at(0) !== undefined ? new Date(input.at(0)!.setHours(6, 0, 0, 0)) : undefined;
  let endOfDay: Date | undefined = undefined;
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
    contracts: unref(contractsInput),
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
          <v-autocomplete
            v-model="contractsInput"
            :items="contractOptions"
            label="Contracts"
            hint="All contracts are selected by default. You can limit the search by selecting specific contracts."
            variant="solo-filled"
            multiple
            chips
            persistent-hint
            flat
          ></v-autocomplete>
          <v-date-input
            v-model="dateRangeInput"
            multiple="range"
            label="Date Range"
            variant="solo-filled"
            hint="Select a start and end date to define the search range, or pick a single date for a specific day."
            persistent-hint
            flat
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
