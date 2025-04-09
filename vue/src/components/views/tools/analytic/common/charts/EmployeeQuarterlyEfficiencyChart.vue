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
import { ChartHelper } from "../../../../../../models/common/chartjs/ChartHelper";
import { ChartData } from "../../../../../../models/common/chartjs/ChartData";
import moment from "moment";
import "moment-timezone";
import { CommonAnalyticTypes } from "../types";

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

// Define props to take in the 'chart' property with quarterly efficiency data
const props = defineProps({
  chart: {
    type: Object as () => Record<string, CommonAnalyticTypes.ITimePeriodMetrics>,
    required: true,
  },
  shift: {
    type: Number,
    required: true,
  },
});

// ChartHelper instance (assuming this is a utility class in your project)
const chartHelper = new ChartHelper();

// Format the chart data for use in the LineChart component
const formattedChartData = computed(() => {
  // Extract the quarters (keys) and sort them in ascending order
  const quarters = Object.keys(props.chart);

  if (quarters.length === 0) {
    return { labels: [], datasets: [] };
  }

  const parsedTimes = quarters.map((quarter) => ({
    label: quarter,
    time: moment(quarter.split("-")[0], "HH:mm"),
  }));

  let orderedTimes;

  if (props.shift === 3) {
    // Night shift: start from evening hours (~18:00 or later)
    const shiftStartIndex = parsedTimes.findIndex(({ time }) => time.hour() >= 18);

    if (shiftStartIndex !== -1) {
      orderedTimes = [
        ...parsedTimes.slice(shiftStartIndex),
        ...parsedTimes.slice(0, shiftStartIndex),
      ];
    } else {
      // Fallback to natural order if no evening time found
      orderedTimes = parsedTimes.sort((a, b) => a.time.diff(b.time));
    }
  } else {
    // For normal day shifts, sort by time as usual
    orderedTimes = parsedTimes.sort((a, b) => a.time.diff(b.time));
  }

  // Prepare data for each quarter
  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];

  orderedTimes.forEach(({ label }) => {
    labels.push(label); // Use the quarter as the label (e.g., "06:15-06:30")
    const quarterData = props.chart[label];
    efficiencyData.push(quarterData.efficiency); // Efficiency for that quarter
    processedUnitsData.push(quarterData.processed_units); // Processed units for that quarter
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
    labels, // Quarters as labels
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
