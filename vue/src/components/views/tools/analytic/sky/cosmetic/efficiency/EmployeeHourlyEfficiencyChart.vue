<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import { LineChart } from "vue-chart-3";
import {
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  Title,
  Tooltip,
} from "chart.js";
import { ChartHelper } from "../../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../../models/common/chartjs/ChartData";

// Register chart.js components for Line chart
Chart.register(
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  Title,
  Tooltip
);

// Define props to take in the 'chart' property
const props = defineProps({
  chart: {
    type: Object as () => Record<string, Record<string, number>>, // Dates as keys, and hourly efficiency as nested object
    required: true,
  },
});

// ChartHelper instance (assuming this is a utility class in your project)
const chartHelper = new ChartHelper();

// Format the chart data for use in the LineChart component
const formattedChartData = computed(() => {
  // Extract the dates (keys) and sort them in ascending order
  const dates = Object.keys(props.chart).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Prepare data for each hour within the day
  const labels: string[] = [];
  const data: number[] = [];

  dates.forEach((date) => {
    const hourlyData = props.chart[date];
    // Sort the hours in ascending order
    const sortedHours = Object.keys(hourlyData).sort(
      (a, b) => parseInt(a) - parseInt(b) // Sort the hours numerically (e.g., 09 < 10)
    );

    // Add the sorted hours to labels and corresponding data to the dataset
    sortedHours.forEach((hour) => {
      labels.push(`${date} ${hour}:00`); // Label for each hour (e.g., "2024-09-26 14:00")
      data.push(hourlyData[hour]); // Efficiency for that hour
    });
  });

  return {
    labels: labels, // Combined date and hour labels
    datasets: [
      new ChartData("Hourly Efficiency", data, chartHelper, "chartjs"), // Line chart data
    ],
  };
});

// Chart.js options for line chart scaling and customization
const options = ref({
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 45,
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
});
</script>

<template>
  <LineChart class="chart-height" :chart-data="formattedChartData" :options="options" />
</template>

<style scoped>
.chart-height {
  height: 300px;
}
</style>
