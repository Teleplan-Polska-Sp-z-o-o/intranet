<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import { BarChart } from "vue-chart-3";
import {
  Chart,
  LinearScale,
  BarElement,
  BarController,
  CategoryScale,
  Title,
  Tooltip,
} from "chart.js";
import { ChartHelper } from "../../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../../models/common/chartjs/ChartData";

// Register chart.js components for Bar chart
Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip);

// Define props to take in the 'chart' property
const props = defineProps({
  chart: {
    type: Object as () => Record<string, number>, // Dates as keys, efficiency as values
    required: true,
  },
});

// ChartHelper instance (assuming this is a utility class in your project)
const chartHelper = new ChartHelper();

// Format the chart data for use in the BarChart component
const formattedChartData = computed(() => {
  // const labels = Object.keys(props.chart); // Extract the dates as labels
  // const data = Object.values(props.chart); // Extract efficiency values as data
  // Extract the dates as labels and sort them in ascending order
  const labels = Object.keys(props.chart).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  // Extract the data corresponding to the sorted labels
  const data = labels.map((label) => props.chart[label]);

  return {
    labels: labels, // Dates
    datasets: [new ChartData("Efficiency", data, chartHelper, "chartjs")], // Efficiency data
  };
});

// Chart.js options for scaling and customization
const options = ref({
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        autoSkip: false,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
  },
  datasets: {
    bar: {
      maxBarThickness: 30, // Optional: max width for bars
      borderWidth: 1,
    },
  },
});
</script>

<template>
  <BarChart class="chart-height" :chart-data="formattedChartData" :options="options" />
</template>

<style scoped>
.chart-height {
  height: 200px;
}
</style>
