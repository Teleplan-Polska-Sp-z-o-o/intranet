<script setup lang="ts">
import { watch } from "vue";
import { usePCRStore } from "../../stores/change/pcrStore";

const emit = defineEmits(["filters"]);

const pcrStore = usePCRStore();

watch(
  () => pcrStore.getFilters,
  (_newFilters) => {
    emit("filters", { callback: pcrStore.callback });
  },
  { deep: true }
);
</script>

<template>
  <v-expansion-panels class="pa-4">
    <v-expansion-panel class="rounded-xl bg-surface-2">
      <v-expansion-panel-title
        expand-icon="mdi-filter-menu-outline"
        collapse-icon="mdi-filter-check-outline"
      >
        {{ $t("tools.common.filters") }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
