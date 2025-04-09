<script setup lang="ts">
import { computed, defineProps } from "vue";
import { BarChart } from "vue-chart-3";
import {
  Chart,
  LinearScale,
  BarElement,
  BarController,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import moment from "moment";
import "moment-timezone";
import { ChartHelper } from "../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../models/common/chartjs/ChartData";
import { CommonAnalyticTypes } from "../types";

// Register chart.js components for Bar chart
Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip, Legend);

// Define props to take in the 'chart' property with daily or quarterly efficiency data
const props = defineProps({
  chart: {
    type: Object as () => Record<string, CommonAnalyticTypes.ITimePeriodMetrics>,
    required: true,
  },
});

// ChartHelper instance (assuming this is a utility class in your project)
const chartHelper = new ChartHelper();

// Format the chart data for use in the BarChart component
const formattedChartData = computed(() => {
  // Extract the time periods (keys) and sort them in ascending order
  const timePeriods = Object.keys(props.chart).sort((a, b) => moment(a).diff(moment(b)));
  // Prepare data for each time period
  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];

  timePeriods.forEach((timePeriod) => {
    labels.push(timePeriod); // Use the time period as the label (e.g., "06:15-06:30")
    const periodData = props.chart[timePeriod];
    efficiencyData.push(periodData.efficiency); // Efficiency for that period
    processedUnitsData.push(periodData.processed_units); // Processed units for that period
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

  const datasets: (ChartData & { yAxisID: string })[] = [
    { ...firstData, yAxisID: "y" },
    { ...secondData, yAxisID: "y2" },
  ];

  return {
    labels, // Time periods as labels
    datasets,
    maxProcessedUnits: Math.max(...processedUnitsData),
  };
});

// Chart.js options for Bar chart with a secondary Y-axis for scaling
const options = computed(() => {
  let maxY2 = formattedChartData.value.maxProcessedUnits;
  let maxY = Math.max(...formattedChartData.value.datasets[0].data);
  // Function to round up to the nearest tens after adding 10
  const roundUpToTens = (num: number) => Math.ceil((num + 10) / 10) * 10;

  // Apply rounding function to both max values
  maxY2 = roundUpToTens(maxY2);
  maxY = roundUpToTens(maxY);

  return {
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
        beginAtZero: true, // Efficiency can start from 0
        max: maxY, // Dynamically set the maximum for the efficiency axis
        position: "left",
        title: {
          display: true,
          text: "Efficiency (%)",
        },
      },
      y2: {
        beginAtZero: true,
        position: "right", // Second Y-axis on the right side
        grid: {
          drawOnChartArea: false, // Prevent grid lines from overlapping with Y1
        },
        max: maxY2, // Set the maximum for the y2 axis based on the max processed units
        title: {
          display: true,
          text: "Processed Units",
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Show the legend
        position: "bottom", // Position the legend at the bottom
      },
    },
    datasets: {
      bar: {
        maxBarThickness: 30, // Max width for bars
        borderWidth: 1,
      },
    },
  };
});
</script>

<template>
  <BarChart class="chart-height" :chart-data="formattedChartData" :options="options" />
</template>

<style scoped>
.chart-height {
  height: 300px;
}
</style>
