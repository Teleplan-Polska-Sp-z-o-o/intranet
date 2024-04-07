<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
const smallScreen = window.innerWidth < 960;
const dotSize: string = smallScreen ? "x-small" : "large";

const getWeather = (weatherType: string, icon: boolean = false): string => {
  switch (weatherType) {
    case "clearday":
    case "clearnight":
      return icon ? "weather-sunny" : "Clear sky";
    case "pcloudyday":
    case "pcloudynight":
      return icon ? "weather-partly-cloudy" : "Partly cloudy";
    case "mcloudyday":
    case "mcloudynight":
      return icon ? "weather-cloudy" : "Mostly cloudy";
    case "cloudyday":
    case "cloudynight":
      return icon ? "weather-cloudy" : "Cloudy";
    case "humidday":
    case "humidnight":
      return icon ? "weather-hazy" : "Humid";
    case "lightrainday":
    case "lightrainnight":
      return icon ? "weather-rainy" : "Light rain";
    case "oshowerday":
    case "oshowernight":
      return icon ? "weather-partly-rainy" : "Occasional showers";
    case "ishowerday":
    case "ishowernight":
      return icon ? "weather-partly-rainy" : "Isolated showers";
    case "lightsnowday":
    case "lightsnownight":
      return icon ? "weather-snowy" : "Light snow";
    case "rainday":
    case "rainnight":
      return icon ? "weather-rainy" : "Rainy";
    case "snowday":
    case "snownight":
      return icon ? "weather-snowy" : "Snowy";
    case "rainsnowday":
    case "rainsnownight":
      return icon ? "weather-partly-rainy" : "Rain and snow";
    default:
      return "Unknown";
  }
};

const knotsToKmPerHour = (knots: number): string => `${(knots * 1.852).toFixed(2)}km/h`;

interface Weather {
  timepoint: number; //timepoint
  time: string;
  temp: number; //temp2m
  desc: string; //getWeatherTypeDescription(weather)
  icon: string;
  wind: string; //wind10m.speed
}

function getCurrentForecast(initString: string, dataSeries: Array<any>, count: number): Weather[] {
  const day = parseInt(initString.substring(6, 8), 10);
  const hour = parseInt(initString.substring(8, 10), 10);

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDate();

  const totalHoursPassed = (currentDay - day) * 24 + (currentHour - hour);
  const totalTimepoints = Math.floor(totalHoursPassed / 3);

  const currentData: Array<any> = dataSeries.slice(totalTimepoints, totalTimepoints + count);

  const mappedData = currentData.map((data) => {
    const timepoint = data.timepoint;
    let forecastHour = hour + timepoint;
    if (forecastHour > 24) forecastHour = forecastHour % 24;
    const timeString = `${forecastHour.toString().padStart(2, "0")}:00`;

    return {
      timepoint: data.timepoint,
      time: timeString,
      temp: data.temp2m,
      desc: getWeather(data.weather),
      icon: getWeather(data.weather, true),
      wind: knotsToKmPerHour(data.wind10m.speed),
      realTime: now,
    };
  });

  return mappedData;
}

const messages = ref<Array<Weather>>([]);

const messagesPresent = computed(() => Object.keys(messages.value).length === 0);

let retried = false;

axios
  .get("http://www.7timer.info/bin/api.pl?lon=18.01&lat=53.12&product=civil&output=json")
  .then(function (response) {
    messages.value = getCurrentForecast(response.data.init, response.data.dataseries, 4);
  })
  .catch(function (error) {
    console.log("First weather attempt failed:", error);
    if (!retried) {
      retried = true;
      axios
        .get("http://www.7timer.info/bin/api.pl?lon=18.01&lat=53.12&product=civil&output=json")
        .then(function (response) {
          messages.value = getCurrentForecast(response.data.init, response.data.dataseries, 4);
        })
        .catch(function (error) {
          console.log("Second attempt failed:", error);
        });
    }
  });
</script>

<template>
  <!-- <v-skeleton-loader v-if="messagesPresent" class="bg-surface-1" type="article"></v-skeleton-loader> -->

  <v-card class="bg-surface-1 rounded-xl mt-5 mr-4" style="height: 435.96px">
    <v-card-text v-if="messagesPresent" class="d-flex justify-center">
      <v-progress-circular color="bg-surface-1" indeterminate></v-progress-circular>
    </v-card-text>
    <v-card-text v-else>
      <v-card-title class="pt-4">Weather</v-card-title>
      <v-card-subtitle class="font-weight-bold ms-1 mb-2">Today</v-card-subtitle>

      <v-timeline class="pl-4" density="compact" align="start">
        <v-timeline-item
          v-for="message in messages"
          :key="message.timepoint"
          :icon="`mdi-${message.icon}`"
          icon-color="on-surface-1"
          dot-color="surface-1"
          :size="dotSize"
        >
          <div class="mb-4">
            <div>
              <span class="font-weight-bold">{{ ` ${message.time}` }}</span>
            </div>
            <div>
              <span>{{ `${message.temp}°C, ${message.desc}` }}</span>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>
