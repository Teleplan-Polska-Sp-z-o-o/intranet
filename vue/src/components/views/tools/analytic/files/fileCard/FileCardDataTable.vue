<script setup lang="ts">
import { toRefs } from "vue";
import { XLSXTypes } from "../Types";

const props = defineProps<{
  excelPreview: XLSXTypes.Sheet;
}>();

const { excelPreview } = toRefs(props);

// Extract the first row as headers
const headers = excelPreview.value[0].map((header) => ({
  title: header as string,
  key: (header as string).toLowerCase().replace(/\s+/g, "_"), // The internal value that maps to items
}));

// Extract the remaining rows as items
const items = excelPreview.value.slice(1).map((row) => {
  const item: { [key: string]: any } = {};
  headers.forEach((header, index) => {
    item[header.key] = row[index];
  });
  return item;
});
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="8"
    :items-per-page-options="[
      { value: 8, title: '8' },
      { value: 25, title: '25' },
      { value: 50, title: '50' },
      { value: 100, title: '100' },
    ]"
  ></v-data-table>
</template>
