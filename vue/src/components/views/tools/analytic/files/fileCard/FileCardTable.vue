<script setup lang="ts">
import { toRefs } from "vue";
import { XLSXTypes } from "../Types";

const props = defineProps<{
  excelPreview: XLSXTypes.Sheet;
}>();

const { excelPreview } = toRefs(props);
</script>

<template>
  <v-table v-if="excelPreview.length" class="rounded-lg">
    <thead>
      <tr>
        <th v-for="(header, index) in excelPreview[0]" :key="index" class="text-left">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in excelPreview.slice(1)" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
          {{ cell !== null ? cell : "" }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <template v-else>
    <!-- Skeleton loaders for multiple table rows -->
    <v-skeleton-loader type="table-row-divider" height="56px"></v-skeleton-loader>
    <v-skeleton-loader type="table-row-divider" height="52px"></v-skeleton-loader>
    <v-skeleton-loader type="table-row" height="52px"></v-skeleton-loader>
  </template>
</template>
