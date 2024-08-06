<script setup lang="ts">
import { useUserStore } from "../../../stores/userStore";

const userStore = useUserStore();
const user = userStore.info();
if (!user) throw new Error(`User info evaluates to false.`);
</script>

<template>
  <v-card class="rounded-xl elevation-2 ma-1">
    <v-list lines="three" bg-color="surface-2" v-if="user">
      <!-- info -->
      <v-list-subheader>{{
        $t("common.default_layout.pages.settings.user['1'].subheader")
      }}</v-list-subheader>

      <v-list-item class="ms-2">
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].position")
        }}</v-list-item-title>
        <v-chip class="mb-1 ms-3" density="comfortable" label> {{ user.info.position }} </v-chip>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].department")
        }}</v-list-item-title>
        <v-chip class="mb-1 ms-3" density="comfortable" label> {{ user.info.department }} </v-chip>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].decision_maker")
        }}</v-list-item-title>
        <v-chip class="ms-3" density="comfortable" label> {{ user.info.decisionMaker }} </v-chip>
      </v-list-item>

      <!-- permission -->
      <v-list-subheader>{{
        $t("common.default_layout.pages.settings.user['2'].subheader")
      }}</v-list-subheader>

      <v-list-item class="ms-2">
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['2'].confidentiality")
        }}</v-list-item-title>
        <v-chip class="mb-1 ms-3" density="comfortable" label>
          {{ user.permission.confidentiality }}
        </v-chip>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['2'].groups")
        }}</v-list-item-title>
        <template v-for="group in user.permission.groups" :key="group.id">
          <div class="ms-3">
            <div class="text-body-2">{{ group.name }}</div>
            <div class="mb-1 ms-3">
              <v-chip
                v-for="(subgroup, index) in group.subgroups"
                :key="subgroup.id"
                :class="{ 'me-1': index !== group.subgroups.length - 1 }"
                density="compact"
                size="small"
                label
              >
                {{ subgroup.name }}
              </v-chip>
            </div>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>
