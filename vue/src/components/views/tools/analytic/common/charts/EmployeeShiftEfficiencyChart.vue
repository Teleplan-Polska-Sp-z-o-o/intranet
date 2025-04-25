<script setup lang="ts">
import { computed, defineProps } from "vue";
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

const chartHelper = new ChartHelper();

const formattedChartData = computed(() => {
  const timeBlocks = Object.keys(props.chart);

  if (timeBlocks.length === 0) {
    return { labels: [], datasets: [], rawProcessedUnitsPerPeriod: [] };
  }

  const parsedTimes = timeBlocks.map((time) => ({
    label: time,
    time: moment(time.split("-")[0], "HH:mm"),
  }));

  let orderedTimes;

  if (props.shift === 3) {
    const shiftStartIndex = parsedTimes.findIndex(({ time }) => time.hour() >= 18);

    orderedTimes =
      shiftStartIndex !== -1
        ? [...parsedTimes.slice(shiftStartIndex), ...parsedTimes.slice(0, shiftStartIndex)]
        : parsedTimes.sort((a, b) => a.time.diff(b.time));
  } else {
    orderedTimes = parsedTimes.sort((a, b) => a.time.diff(b.time));
  }

  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];
  const rawProcessedUnitsPerPeriod: Record<string, CommonAnalyticTypes.IProcessedUnit>[] = [];

  orderedTimes.forEach(({ label }) => {
    const periodData = props.chart[label];
    const processedUnits = periodData.processedUnits;

    const totalQuantity = Object.values(processedUnits).reduce(
      (sum, unit) => sum + unit.quantity,
      0
    );

    labels.push(label);
    efficiencyData.push(periodData.efficiencyPercentage);
    processedUnitsData.push(totalQuantity);
    rawProcessedUnitsPerPeriod.push(processedUnits);
  });

  const excludeColors: string[] = [];

  const efficiencyLine = new ChartData("Efficiency", efficiencyData, chartHelper, "chartjs");
  excludeColors.push(efficiencyLine.borderColor);

  const processedUnitsLine = new ChartData(
    "Processed Units",
    processedUnitsData,
    chartHelper,
    "chartjs",
    excludeColors
  );

  return {
    labels,
    datasets: [efficiencyLine, processedUnitsLine],
    rawProcessedUnitsPerPeriod,
  };
});

const options = computed(() => ({
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
      display: true,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const datasetLabel = context.dataset.label || "";
          const dataIndex = context.dataIndex;

          if (datasetLabel === "Processed Units") {
            const rawData = formattedChartData.value.rawProcessedUnitsPerPeriod[dataIndex];
            if (!rawData) return `${datasetLabel}: 0`;

            const parts = Object.entries(rawData).map(
              ([partNo, unit]) => `${partNo}: ${unit.quantity}`
            );

            return [`${datasetLabel}:`, ...parts]; // show each part number on a new line
          }

          return `${datasetLabel}: ${context.formattedValue}`;
        },
      },
    },
  },
}));
</script>

<template>
  <LineChart class="chart-height" :chart-data="formattedChartData" :options="options" />
</template>

<style scoped>
.chart-height {
  height: 300px;
}
</style>
