<script setup lang="ts">
import { computed, defineProps } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, ArcElement, Tooltip, Legend, Title, DoughnutController } from "chart.js";
import { ChartHelper } from "./ChartHelper";
import { useI18n } from "vue-i18n";

// Register required Chart.js components
Chart.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const { t } = useI18n();
const tBase = "tools.tcd.dashboard.FreeCharacterUsageChart";

// Define Props: Accepts "usedCharacters" as a number
const props = defineProps({
  usedCharacters: {
    type: Number,
    required: true,
  },
});

// Constants
const TOTAL_CHARS = 2000000; // 2 Million characters

// Compute Remaining Characters
const remainingCharacters = computed(() => Math.max(TOTAL_CHARS - props.usedCharacters, 0));

// 🎨 Initialize a ChartHelper with a unique UUID for this chart instance
const chartHelper = new ChartHelper();

// 🎨 Get unique colors for the datasets
const usedColor = chartHelper.getUniqueChartjsColor();
const remainingColor = chartHelper.getUniqueChartjsColor();

// Chart Data
const chartData = computed(() => ({
  labels: [t(`${tBase}.labels.used`), t(`${tBase}.labels.remaining`)],
  datasets: [
    {
      data: [props.usedCharacters, remainingCharacters.value], // Used vs Remaining
      backgroundColor: [usedColor.color, remainingColor.color],
      hoverBackgroundColor: [usedColor.tColor, remainingColor.tColor],
    },
  ],
}));

// Chart Options
const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: t(`${tBase}.title.text`),
      font: { size: 16 },
    },
    legend: {
      position: "bottom",
    },
  },
}));
</script>

<template>
  <DoughnutChart :chart-data="chartData" :options="options" />
</template>
