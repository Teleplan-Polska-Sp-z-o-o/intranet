<script setup lang="ts">
import { computed, defineProps } from "vue";
import { BarChart } from "vue-chart-3";
import {
  Chart,
  BarElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
  BarController,
} from "chart.js";
import { ChartHelper } from "./ChartHelper";
import { useI18n } from "vue-i18n";

// Register required Chart.js components
Chart.register(BarElement, Tooltip, Legend, Title, LinearScale, CategoryScale, BarController);

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.dashboard.PaidCharacterUsageChart";

// Define Props: Accepts "usedCharacters" as a number
const props = defineProps({
  usedCharacters: {
    type: Number,
    required: true,
  },
});

// Constants
const FREE_TIER_LIMIT = 2_000_000; // 2 Million Free Characters
const PRICE_PER_MILLION = 10; // $10 per 1M characters

// Compute Paid Characters (Ignore Free Tier)
const paidCharacters = computed(() => Math.max(props.usedCharacters - FREE_TIER_LIMIT, 0));

// Compute Cost for Paid Characters
const paidCost = computed(() =>
  Number(((paidCharacters.value / 1_000_000) * PRICE_PER_MILLION).toFixed(2))
);

// 🎨 Initialize a ChartHelper for unique colors
const chartHelper = new ChartHelper();
const paidColor = chartHelper.getUniqueChartjsColor();
const costColor = chartHelper.getUniqueChartjsColor();

// Chart Data for Paid Character Usage
const chartData = computed(() => ({
  //   labels: [t(`${tBase}.labels.used`), t(`${tBase}.labels.cost`)],
  labels: ["", ""],
  datasets: [
    {
      label: t(`${tBase}.labels.used`),
      data: [paidCharacters.value, 0], // First bar represents characters used
      backgroundColor: paidColor.color,
      hoverBackgroundColor: paidColor.tColor,
      yAxisID: "y-left", // Maps to the left Y-axis
    },
    {
      label: t(`${tBase}.labels.cost`),
      data: [0, paidCost.value], // Second bar represents cost in USD
      backgroundColor: costColor.color,
      hoverBackgroundColor: costColor.tColor,
      yAxisID: "y-right", // Maps to the right Y-axis
    },
  ],
}));

// Chart Options with Dual Y-Axis
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
  scales: {
    x: {
      display: false, // Hides X-axis labels completely
    },
    "y-left": {
      type: "linear",
      position: "left",
      //   title: {
      //     display: true,
      //     text: t("Characters Used"),
      //   },
      beginAtZero: true,
    },
    "y-right": {
      type: "linear",
      position: "right",
      //   title: {
      //     display: true,
      //     text: t("Cost (USD)"),
      //   },
      beginAtZero: true,
      grid: {
        drawOnChartArea: false, // Ensures right Y-axis doesn't overlap left Y-axis grid
      },
    },
  },
}));
</script>

<template>
  <BarChart :chart-data="chartData" :options="options" />
</template>
