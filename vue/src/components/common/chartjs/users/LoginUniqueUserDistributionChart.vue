<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
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
import { UserLoginDetailsManager } from "../../../../models/user/UserLoginDetailsManager";
import { IUserLoginDetails } from "../../../../interfaces/user/UserTypes";
import { ChartData } from "../../../../models/common/chartjs/ChartData";
import { ChartHelper } from "../../../../models/common/chartjs/ChartHelper";
import { Helper } from "../../../../models/common/Helper";

Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip);

const userLoginDetailsManager: UserLoginDetailsManager = new UserLoginDetailsManager();
const loginDetailEntities = ref<Array<IUserLoginDetails>>([]);
const chartHelper = new ChartHelper();

const processLoginTimes = (entities: Array<IUserLoginDetails>): Array<number> => {
  // Initialize an array of sets to track unique users per hour
  const loginHours: Array<Set<string>> = Array.from({ length: 24 }, () => new Set<string>());

  // Process each login detail
  entities.forEach((detail) => {
    const localLoginTime = Helper.convertToLocalTime(detail.loginTime); // Convert to local time
    const loginHour = new Date(localLoginTime).getHours();
    loginHours[loginHour].add(String(detail.user.id)); // Add user ID to the set for the specific hour
  });

  // Convert sets to counts of unique users
  return loginHours.map((hourSet) => hourSet.size);
};

const datasets = ref<Array<number>>([]);

const route = useRoute();
watch(
  () => route,
  async (newRoute) => {
    const thisRoutePath: string = "/tool/admin/browse/user-info";
    if (newRoute && newRoute.path === thisRoutePath) {
      loginDetailEntities.value = await userLoginDetailsManager.getUserDetails();
      datasets.value = processLoginTimes(loginDetailEntities.value);
    }
  },
  { deep: true, immediate: true }
);

const getHourLabels = (): Array<string> => {
  const currentHour = new Date().getHours();
  return Array.from({ length: 24 }, (_, i) => `${(currentHour - i + 24) % 24}:00`).reverse();
};

const alignDatasetWithLabels = (data: Array<number>): Array<number> => {
  const currentHour = new Date().getHours();
  const startIndex = (currentHour + 1) % 24;
  return [...data.slice(startIndex), ...data.slice(0, startIndex)];
};

const data = computed<{ labels: Array<string>; datasets: Array<ChartData> }>(() => {
  const labels = getHourLabels();
  const alignedData = alignDatasetWithLabels(datasets.value);
  return {
    labels,
    datasets: [new ChartData("Login Times", alignedData, chartHelper)],
  };
});

const options = ref({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    // legend: {
    //   display: true,
    //   position: "bottom",
    // },
  },
});
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-card-text>
      <v-card-title>Unique User Login Distribution</v-card-title>
      <v-card-subtitle
        >Number of unique users logged in during each hour over the past 24 hours</v-card-subtitle
      >
      <BarChart class="chart-height" :chart-data="data" :options="options" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-height {
  height: 400px;
}
</style>
