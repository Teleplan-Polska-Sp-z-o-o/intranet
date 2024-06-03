<script setup lang="ts">
const emit = defineEmits(["filters"]);

const props = defineProps<{
  callback?: Function;
}>();

emit("filters", { callback: props.callback });

// watch(
//   () => callback.getFilters,
//   (_newFilters) => {
//     emit("filters", callback);
//   },
//   { deep: true }
// );
</script>

<template>
  <v-expansion-panels>
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
