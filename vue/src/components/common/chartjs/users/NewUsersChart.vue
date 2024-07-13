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

const getLastSevenDays = (): Array<string> => {
  const days: Array<string> = [];
  const today: Date = new Date();
  for (let i = 6; i >= 0; i--) {
    const day: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    days.push(day.toLocaleDateString("en-US"));
  }
  return days;
};

const countNewUsersPerDay = (entities: Array<IUserLoginDetails>): Array<number> => {
  const lastSevenDays = getLastSevenDays();
  const newUsersPerDay: number[] = Array(7).fill(0);
  const usersPerDay: { [key: string]: Set<number> } = {};

  lastSevenDays.forEach((day) => {
    usersPerDay[day] = new Set<number>();
  });

  entities.forEach((detail) => {
    const loginDate = new Date(detail.loginTime).toLocaleDateString("en-US");
    if (usersPerDay[loginDate]) {
      usersPerDay[loginDate].add(detail.user.id);
    }
  });

  lastSevenDays.forEach((day, index) => {
    newUsersPerDay[index] = usersPerDay[day].size;
  });

  return newUsersPerDay;
};

const datasets = ref<Array<number>>([]);
const labels = ref<Array<string>>(getLastSevenDays());

const route = useRoute();
watch(
  () => route,
  async (newRoute) => {
    const thisRoutePath: string = "/tool/admin/browse/user-info";
    if (newRoute && newRoute.path === thisRoutePath) {
      loginDetailEntities.value = await userLoginDetailsManager.getUserDetails();
      datasets.value = countNewUsersPerDay(loginDetailEntities.value);
    }
  },
  { deep: true, immediate: true }
);

const data = computed<{ labels: Array<string>; datasets: Array<ChartData> }>(() => {
  return {
    labels: labels.value,
    datasets: [new ChartData("New Users per Day", datasets.value, chartHelper)],
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
      <v-card-title> New Users </v-card-title>
      <v-card-subtitle>
        Number of new users who logged in over the past 7 days, counting those who were not recorded
        during the previous week
      </v-card-subtitle>
      <LineChart class="chart-height" :chart-data="data" :options="options" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-height {
  height: 400px;
}
</style>
