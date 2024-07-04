<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DocumentManager } from "../../../models/document/DocumentManager";
import { IDocumentEntity } from "../../../interfaces/document/IDocumentEntity";
import { Chips } from "../../../models/document/Chips";
import { useRoute } from "vue-router";
import { LineChart } from "vue-chart-3";
import {
  Chart,
  LinearScale,
  LineElement,
  LineController,
  CategoryScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useI18n } from "vue-i18n";
import { getUniqueColor } from "./colors";

const { t } = useI18n();

Chart.register(
  LinearScale,
  LineElement,
  LineController,
  CategoryScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const documentManager: DocumentManager = new DocumentManager();
const documentEntities = ref<Array<IDocumentEntity>>([]);

class ChartData {
  label: string;
  data: Array<number> = [];
  fill: boolean = false;

  borderColor: string;
  backgroundColor: string;

  tension: number = 0.4;

  constructor(postBy: string, data: Array<number>) {
    this.label = postBy;
    this.data = data;

    const color = getUniqueColor();

    this.borderColor = color;
    this.backgroundColor = `${color.slice(0, -1)}, 0.2)`;
  }
}

const processDocumentEntities = (entities: Array<IDocumentEntity>): Array<ChartData> => {
  try {
    const lastSixMonths = getLastSixMonths();
    const userStats: { [key: string]: number[] } = {};

    entities.forEach((doc) => {
      const { postBy, postByDate } = doc;
      if (postBy && postByDate) {
        const [day, month, year] = postByDate.split("/").map(Number);
        const postDate = new Date(year, month - 1, day);
        const monthKey = postDate.toLocaleString("en-US", { month: "short" }).toLocaleLowerCase();

        if (!userStats[postBy]) {
          userStats[postBy] = Array(6).fill(0);
        }

        const monthIndex = lastSixMonths.indexOf(monthKey);
        if (monthIndex !== -1 && postDate.getFullYear() === new Date().getFullYear()) {
          userStats[postBy][monthIndex]++;
        }
      }
    });

    return Object.entries(userStats).map(([postBy, data]) => new ChartData(postBy, data));
  } catch (error) {
    console.log(`processDocumentEntities at SimpleDocumentsPostedChart, ${error}`);
    return [];
  }
};

// labels - months from past 6 months
const getLastSixMonths = () => {
  const months: Array<string> = [];
  const today: Date = new Date();
  for (let i = 0; i < 6; i++) {
    const month: Date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(month.toLocaleString("en-US", { month: "short" }).toLocaleLowerCase());
  }
  return months.reverse();
};

const lastSixMonths = ref<Array<string>>(getLastSixMonths());
//

const datasets = ref<Array<ChartData>>([]);

const route = useRoute();
watch(
  () => route,
  async (newRoute) => {
    const thisRoutePath: string = "/tool/matrix/browse/documents";
    if (newRoute && newRoute.path === thisRoutePath) {
      documentEntities.value = await documentManager.get(new Chips());
      datasets.value = processDocumentEntities(documentEntities.value);
    }
  },
  { deep: true, immediate: true }
);

// data config
const data = computed<{ labels: Array<string>; datasets: Array<ChartData> }>(() => {
  return {
    labels: lastSixMonths.value.map((monthKey) => t(`common.months.${monthKey}`)),
    datasets: datasets.value,
  };
});

const options = ref({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    title: {
      text: "Line",
    },
    legend: {
      display: true,
      position: "bottom",
    },
  },
});
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-card-text>
      <v-card-title>
        {{ $t(`tools.chart.post.title`) }}
      </v-card-title>
      <v-card-subtitle>
        {{ $t(`tools.chart.post.subtitle`) }}
      </v-card-subtitle>
      <div class="chart-container">
        <LineChart :chart-data="data" :options="options" />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-container {
  height: 400px;
}
</style>
