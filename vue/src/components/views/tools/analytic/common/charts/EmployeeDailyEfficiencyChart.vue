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

Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip, Legend);

const props = defineProps({
  chart: {
    type: Object as () => Record<string, CommonAnalyticTypes.ITimePeriodMetrics>,
    required: true,
  },
});

const chartHelper = new ChartHelper();

const formattedChartData = computed(() => {
  const timePeriods = Object.keys(props.chart).sort((a, b) => moment(a).diff(moment(b)));

  const labels: string[] = [];
  const efficiencyData: number[] = [];
  const processedUnitsData: number[] = [];
  const rawProcessedUnitsPerPeriod: Record<string, CommonAnalyticTypes.IProcessedUnit>[] = [];

  timePeriods.forEach((timePeriod) => {
    labels.push(timePeriod);
    const periodData = props.chart[timePeriod];
    efficiencyData.push(periodData.efficiencyPercentage);

    const processedUnits = periodData.processedUnits;
    const totalQuantity = Object.values(processedUnits).reduce(
      (sum, unit) => sum + unit.quantity,
      0
    );
    processedUnitsData.push(totalQuantity);
    rawProcessedUnitsPerPeriod.push(processedUnits);
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
    labels,
    datasets,
    maxProcessedUnits: Math.max(...processedUnitsData),
    rawProcessedUnitsPerPeriod,
  };
});

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

              return [`${datasetLabel}:`, ...parts];
            }

            return `${datasetLabel}: ${context.formattedValue}`;
          },
        },
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
