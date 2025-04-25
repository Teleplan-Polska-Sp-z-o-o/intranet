<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { CommonAnalyticTypes } from "../types";
import {
  missingCacheTableHeaders,
  missingCacheDownloadHeaders,
} from "../tableHeaders/missingCacheHeaders";
import Download from "../../files/download/Download.vue";

const props = defineProps<{
  items: CommonAnalyticTypes.IMissingCache[];
}>();

const areMissing: ComputedRef<boolean> = computed(() => props.items && props.items.length > 0);

const loading: ComputedRef<false | "primary-container"> = computed(() => {
  return areMissing.value ? false : "primary-container";
});
</script>

<template>
  <div class="d-flex align-center px-4 py-2">
    <v-icon
      :icon="areMissing ? 'mdi-alert' : 'mdi-check-circle'"
      size="x-large"
      :color="areMissing ? 'error' : 'success'"
      class="mr-2"
    />
    <span class="text-body-1 text-error">
      {{ areMissing ? "Missing in Models" : "Models Up to Date" }}</span
    >
    <v-spacer></v-spacer>
    <download
      v-if="areMissing"
      :headers="missingCacheDownloadHeaders"
      :items="props.items"
      base-save-as="Missing_In_Models"
    ></download>
  </div>
  <v-data-table
    v-if="areMissing"
    :items="props.items"
    item-value="id"
    :loading="loading"
    :headers="missingCacheTableHeaders"
    :sort-by="[
      {
        key: 'id',
        order: 'asc',
      },
    ]"
    class="bg-surface-2"
  >
  </v-data-table>
</template>
