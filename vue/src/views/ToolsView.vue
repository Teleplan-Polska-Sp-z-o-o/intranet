<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePermissionStore } from "../stores/permissionStore";
import { IPermission } from "../interfaces/user/IPermission";

let screen: string;
const screenWidth: number = window.innerWidth;

if (screenWidth < 600) screen = "mobile";
else if (screenWidth >= 600 && screenWidth < 960) screen = "tablet";
else screen = "desktop";

let cols: number;

switch (screen) {
  case "mobile":
    cols = 12;
    break;
  case "tablet":
    cols = 6;
    break;
  case "desktop":
    cols = 4;
    break;
}

const permissionStore = usePermissionStore();

const tools = [
  {
    id: 1,
    name: "documents",
    href: "/tool/documents",
    icon: "file-document",
    image: "../tools/docs.png",
    permissions: {
      read: true,
      write: false,
      control: false,
    },
  },
  // {
  //   id: 2,
  //   name: "training",
  //   href: "",
  //   icon: "book-open-variant-outline",
  //   image: "../tools/training.png",
  //   permissions: {
  //     read: true,
  //     write: true,
  //     control: false,
  //   },
  // },
  // {
  //   id: 3,
  //   name: "cn",
  //   href: "",
  //   icon: "file-document-edit",
  //   image: "../tools/change.png",
  //   permissions: {
  //     read: true,
  //     write: true,
  //     control: false,
  //   },
  // },
  {
    id: 4,
    name: "matrix",
    href: "/tool/matrix",
    icon: "database",
    image: "../tools/matrix.png",
    permissions: {
      read: true,
      write: true,
      control: false,
    },
  },
  // {
  //   id: 5,
  //   name: "8d",
  //   href: "",
  //   icon: "alert-octagon",
  //   image: "../tools/analytics.png",
  //   permissions: {
  //     read: true,
  //     write: true,
  //     control: false,
  //   },
  // },
  {
    id: 6,
    name: "boss",
    href: "/tool/admin",
    icon: "account-tie",
    image: "../tools/boss.png",
    permissions: {
      read: true,
      write: true,
      control: true,
    },
  },
];

const filteredTools = tools.filter((tool) => {
  const toolPermissions: IPermission = tool.permissions;
  // console.log(toolPermissions);
  return permissionStore.check(toolPermissions);
});

const router = useRouter();
</script>

<template>
  <v-container class="layout-view-container bg-background mt-0 pt-0">
    <v-row>
      <v-col :cols="cols" v-for="tool in filteredTools" :key="tool.id">
        <v-card
          class="ma-4 bg-surface-1 text-on-surface rounded-xl elevation-6"
          rel="noopener"
          :href="undefined"
          @click="router.push({ path: tool.href })"
        >
          <v-container>
            <v-row class="align-center">
              <v-icon
                class="ma-4 mr-0"
                color="secondary"
                :icon="`mdi-${tool.icon}`"
                size="38"
              ></v-icon>
              <v-card-title class="mr-auto">{{
                $t(`common.default_layout.pages.tools.${tool.name}.title`)
              }}</v-card-title>
              <!-- <v-icon class="ma-4" color="secondary" icon="mdi-open-in-new" size="38"></v-icon> -->
            </v-row>
          </v-container>

          <v-img class="mx-auto" height="300" :src="tool.image"> </v-img>

          <v-card-text>{{ $t(`common.default_layout.pages.tools.${tool.name}.text`) }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
