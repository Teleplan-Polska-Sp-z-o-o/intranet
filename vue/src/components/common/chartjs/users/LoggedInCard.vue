<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { UserLoginDetailsManager } from "../../../../models/user/UserLoginDetailsManager";
import { IUserLoginDetails } from "../../../../interfaces/user/UserTypes";
import { Helper } from "../../../../models/common/Helper";

const userLoginDetailsManager: UserLoginDetailsManager = new UserLoginDetailsManager();
const loginDetailEntities = ref<Array<IUserLoginDetails>>([]);

const processLoginDetails = (entities: Array<IUserLoginDetails>): number => {
  let currentlyLoggedIn = 0;

  entities.forEach((detail) => {
    if (!detail.logoutTime) {
      currentlyLoggedIn++;
    }
  });

  return currentlyLoggedIn;
};

const currentlyLoggedIn = ref<number>(0);

const tableEntities = computed(() => {
  const filtered = loginDetailEntities.value.filter((detail) => !detail.logoutTime);
  const mappedFiltered = filtered.map((record) => {
    const currentTime = new Date().toISOString();
    const currentLocalTime = new Date(Helper.convertToLocalTime(currentTime));
    const loginLocalTime = new Date(Helper.convertToLocalTime(record.loginTime));
    const durationInMilliseconds = currentLocalTime.getTime() - loginLocalTime.getTime();
    const durationInMinutes = Math.floor(durationInMilliseconds / 1000 / 60);

    const timeRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
    const ISOLoginLocalTime = Helper.convertToLocalTime(record.loginTime);
    const loginLocalTimeWithoutTimezone = ISOLoginLocalTime.match(timeRegex)?.[0];
    return {
      ...record,
      loginTime: loginLocalTimeWithoutTimezone,
      duration: durationInMinutes,
    };
  });
  return mappedFiltered;
});
const tableSearch = ref<string>("");
const tableHeaders: any = [
  {
    align: "start",
    key: "user.username",
    sortable: true,
    title: "Username",
  },
  { key: "loginTime", sortable: true, title: "Login Time" },
  { key: "duration", sortable: true, title: "Current Duration (mins)" },
];

const route = useRoute();
watch(
  () => route,
  async (newRoute) => {
    const thisRoutePath: string = "/tool/admin/browse/user-info";
    if (newRoute && newRoute.path === thisRoutePath) {
      loginDetailEntities.value = await userLoginDetailsManager.getUserDetails();
      currentlyLoggedIn.value = processLoginDetails(loginDetailEntities.value);
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-card-text>
      <v-card-title> Logged In </v-card-title>
      <v-card-subtitle> Number of users currently logged in </v-card-subtitle>
      <v-card-text
        ><div class="mx-auto text-h3">{{ currentlyLoggedIn }}</div></v-card-text
      >

      <v-text-field
        v-model="tableSearch"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        color="primary"
        hide-details
        single-line
        :rounded="true"
      ></v-text-field>

      <v-data-table
        :headers="tableHeaders"
        :items="tableEntities"
        :search="tableSearch"
        :items-per-page-options="[
          { value: 5, title: '5' },
          { value: 10, title: '10' },
          { value: 15, title: '15' },
          { value: 20, title: '20' },
          { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
        ]"
        class="bg-surface-2"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>
