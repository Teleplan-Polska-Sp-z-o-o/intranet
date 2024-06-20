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
  Colors,
} from "chart.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

Chart.register(
  LinearScale,
  LineElement,
  LineController,
  CategoryScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const documentManager: DocumentManager = new DocumentManager();
const documentEntities = ref<Array<IDocumentEntity>>([]);

class ChartData {
  label: string;
  data: Array<number> = [];
  fill: boolean = false;

  // borderColor: string;
  // backgroundColor: string;

  tension: number = 0.4;

  constructor(postBy: string, data: Array<number>) {
    this.label = postBy;
    this.data = data;

    // randomize pastel colors for both
    // const generateRandomPastelColor = (): string => {
    //   // Define ranges for blue and green
    //   const blueRange = [150, 250];
    //   const greenRange = [150, 250];

    //   // Generate random values within the specified ranges
    //   const r = Math.floor(Math.random() * (greenRange[1] - greenRange[0] + 1) + greenRange[0]);
    //   const g = Math.floor(Math.random() * (blueRange[1] - blueRange[0] + 1) + blueRange[0]);
    //   const b = Math.floor(Math.random() * (blueRange[1] - blueRange[0] + 1) + blueRange[0]);

    //   return `rgb(${r}, ${g}, ${b})`;
    // };

    // const color = generateRandomPastelColor();

    // this.borderColor = color;
    // this.backgroundColor = color;
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

// watchEffect(async () => {
//   const newRoute = useRoute();
//   const thisRoutePath: string = "/tool/matrix/browse/documents";
//   if (newRoute && newRoute?.path === thisRoutePath) {
//     console.log("this route");
//     documentEntities.value = await documentManager.get(new Chips());
//     datasets.value = processDocumentEntities(documentEntities.value);
//   }
// });

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
    colors: {
      enabled: true,
    },
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
      <LineChart :chart-data="data" :options="options" css-classes="chart-container" />
    </v-card-text>
  </v-card>
</template>
