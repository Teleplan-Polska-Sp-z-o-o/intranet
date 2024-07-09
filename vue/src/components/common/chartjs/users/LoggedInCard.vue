<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { UserLoginDetailsManager } from "../../../../models/user/UserLoginDetailsManager";
import { IUserLoginDetails } from "../../../../interfaces/user/UserTypes";

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
    </v-card-text>
  </v-card>
</template>
