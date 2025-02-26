<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
} from "chart.js";
import { UserLoginDetailsManager } from "../../../../models/user/UserLoginDetailsManager";
import { IUserLoginDetails } from "../../../../interfaces/user/UserTypes";
import { ChartData } from "../../../../models/common/chartjs/ChartData";
import { ChartHelper } from "../../../../models/common/chartjs/ChartHelper";

Chart.register(
  LinearScale,
  LineElement,
  LineController,
  CategoryScale,
  PointElement,
  Title,
  Tooltip
);

const userLoginDetailsManager: UserLoginDetailsManager = new UserLoginDetailsManager();
const loginDetailEntities = ref<Array<IUserLoginDetails>>([]);
const chartHelper = new ChartHelper();

const getLastSevenDays = () => {
  const days: Array<string> = [];
  const today: Date = new Date();
  for (let i = 6; i >= 0; i--) {
    const day: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    days.push(day.toLocaleDateString("en-US"));
  }
  return days;
};

const lastSevenDays = ref<Array<string>>(getLastSevenDays());

const processLoginDetails = (entities: Array<IUserLoginDetails>): Array<number> => {
  const lastSevenDays = getLastSevenDays();
  const uniqueLogins: Array<Set<string>> = Array.from({ length: 7 }, () => new Set<string>());

  entities.forEach((detail) => {
    const loginDate = new Date(detail.loginTime).toLocaleDateString("en-US");
    const dayIndex = lastSevenDays.indexOf(loginDate);

    if (dayIndex !== -1) {
      uniqueLogins[dayIndex].add(String(detail.user.id)); // Add user ID to the set for the specific day
    }
  });

  return uniqueLogins.map((daySet) => daySet.size); // Convert sets to counts of unique users
};

const datasets = ref<Array<number>>([]);

const route = useRoute();
watch(
  () => route,
  async (newRoute) => {
    const thisRoutePath: string = "/tool/admin/browse/user-info";
    if (newRoute && newRoute.path === thisRoutePath) {
      loginDetailEntities.value = await userLoginDetailsManager.getUserDetails();
      datasets.value = processLoginDetails(loginDetailEntities.value);
    }
  },
  { deep: true, immediate: true }
);

const data = computed<{ labels: Array<string>; datasets: Array<ChartData> }>(() => {
  return {
    labels: lastSevenDays.value,
    datasets: [new ChartData("Unique User Logins", datasets.value, chartHelper)],
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
      <v-card-title> Unique User Logins </v-card-title>
      <v-card-subtitle> Number of unique users logged in over the past week </v-card-subtitle>
      <LineChart class="chart-height" :chart-data="data" :options="options" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-height {
  height: 400px;
}
</style>
