<script setup lang="ts">
import { useUserStore } from "../../../stores/userStore";

/*

user: {
    '1': {
        subheader: "Info"
        position: "Position"
        department: "Department"
        decision_maker: "Decision Maker"
    }
    '2': {
        subheader: "Permissions"
        confidentiality: "Confidentiality"
        groups: "Groups"
    }
}

*/
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

      <v-list-item>
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].position")
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.info.position }}</v-list-item-subtitle>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].department")
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.info.department }}</v-list-item-subtitle>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['1'].decision_maker")
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.info.decisionMaker }}</v-list-item-subtitle>
      </v-list-item>

      <!-- permission -->
      <v-list-subheader>{{
        $t("common.default_layout.pages.settings.user['2'].subheader")
      }}</v-list-subheader>

      <v-list-item>
        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['2'].confidentiality")
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.permission.confidentiality }}</v-list-item-subtitle>

        <v-list-item-title>{{
          $t("common.default_layout.pages.settings.user['2'].groups")
        }}</v-list-item-title>
        <v-list-item-subtitle v-for="group in user.permission.groups" :key="group.id">
          {{ `${group.name}: ` }}
          <span v-for="(subgroup, index) in group.subgroups" :key="subgroup.id">
            {{
              index !== group.subgroups.length - 1 ? `${subgroup.name}, ` : `${subgroup.name};`
            }}</span
          >
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
