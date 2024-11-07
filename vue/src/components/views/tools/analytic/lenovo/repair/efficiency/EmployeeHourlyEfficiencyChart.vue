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
  Legend,
} from "chart.js";
import { ChartHelper } from "../../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../../models/common/chartjs/ChartData";
import moment from "moment";
import "moment-timezone";
import { EfficiencyTypes } from "./Types";

// Register chart.js components for Line chart
Chart.register(
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

// Define props to take in the 'chart' property with hourly efficiency data
const props = defineProps({
  chart: {
    type: Object as () => Record<string, EfficiencyTypes.ITimePeriodMetrics>,
    required: true,
  },
});

// ChartHelper instance (assuming this is a utility class in your project)
const chartHelper = new ChartHelper();

// Format the chart data for use in the LineChart component
const formattedChartData = computed(() => {
  // Extract the hours (keys) and sort them in ascending order
  const hours = Object.keys(props.chart).sort((a, b) => moment(a, "HH").diff(moment(b, "HH")));

  // Prepare data for each hour
  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];

  hours.forEach((hour) => {
    labels.push(hour); // Use the hour as the label (e.g., "06:00", "07:00")
    const hourData = props.chart[hour];
    efficiencyData.push(hourData.efficiency); // Efficiency for that hour
    processedUnitsData.push(hourData.processed_units); // Processed units for that hour
  });

  const excludeColors: string[] = [];

  const firstData = new ChartData("Efficiency", efficiencyData, chartHelper, "chartjs");
  excludeColors.push(firstData.borderColor);

  const secondData = new ChartData(
    "Processed Units",
    processedUnitsData,
    chartHelper,
    "chartjs",
    excludeColors
  );

  const datasets: ChartData[] = [firstData, secondData];

  return {
    labels, // Hours as labels
    datasets,
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
      beginAtZero: false,
    },
  },
  plugins: {
    legend: {
      display: true, // Show the legend
      position: "bottom", // Position the legend at the bottom
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
