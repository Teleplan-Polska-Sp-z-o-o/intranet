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
import { ChartHelper } from "../../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../../models/common/chartjs/ChartData";
import { EfficiencyTypes } from "./Types";
import moment from "moment";
import "moment-timezone";

// Register chart.js components for Bar chart
Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip, Legend);

const props = defineProps({
  chart: {
    type: Object as () => Record<string, EfficiencyTypes.ITimePeriodMetrics>,
    required: true,
  },
});

const chartHelper = new ChartHelper();

// Format the chart data for use in the BarChart component
const formattedChartData = computed(() => {
  // Extract and sort hourly time periods in ascending order
  const timePeriods = Object.keys(props.chart).sort((a, b) =>
    moment(a, "HH").diff(moment(b, "HH"))
  );

  // Prepare data arrays
  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];

  timePeriods.forEach((timePeriod) => {
    labels.push(timePeriod); // Use the hour as the label (e.g., "06:00", "07:00")
    const periodData = props.chart[timePeriod];
    efficiencyData.push(periodData.efficiency); // Efficiency for that hour
    processedUnitsData.push(periodData.processed_units); // Processed units for that hour
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
    labels, // Hourly labels
    datasets,
    maxProcessedUnits: Math.max(...processedUnitsData),
  };
});

// Chart.js options for Bar chart with a secondary Y-axis
const options = computed(() => {
  let maxY2 = formattedChartData.value.maxProcessedUnits;
  let maxY = Math.max(...formattedChartData.value.datasets[0].data);
  const roundUpToTens = (num: number) => Math.ceil((num + 10) / 10) * 10;

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
        beginAtZero: true,
        max: maxY,
        position: "left",
        title: {
          display: true,
          text: "Efficiency (%)",
        },
      },
      y2: {
        beginAtZero: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        max: maxY2,
        title: {
          display: true,
          text: "Processed Units",
        },
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
        maxBarThickness: 30,
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
