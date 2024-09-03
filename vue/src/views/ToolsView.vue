<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePermissionStore } from "../stores/permissionStore";
import { useUserStore } from "../stores/userStore";
import { ref } from "vue";
import { Tool } from "../interfaces/common/ToolTabTypes";
import { UserToolStatisticsManager } from "../models/user/UserToolStatisticsManager";
import { TPermissionGroup } from "../interfaces/user/UserTypes";

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

const userStore = useUserStore();
const permissionStore = usePermissionStore();

const tools: Tool[] = [
  {
    id: 1,
    name: "documents",
    href: "",
    icon: "file-document",
    image: "../tools/documents.png",
    meta: {
      group: "documents",
      baseHref: "/tool/documents/browse/",
    },
  },
  {
    id: 3,
    name: "change",
    href: "",
    icon: "file-document-edit",
    image: "../tools/change.png",
    meta: {
      group: "change",
      baseHref: "/tool/change/browse/",
    },
  },
  {
    id: 4,
    name: "matrix",
    href: "",
    icon: "database",
    image: "../tools/matrix.png",
    meta: {
      group: "matrix",
      baseHref: "/tool/matrix/browse/",
    },
  },
  {
    id: 6,
    name: "boss",
    href: "",
    icon: "account-tie",
    image: "../tools/admin.png",
    meta: {
      group: "admin",
      baseHref: "/tool/admin/browse/",
    },
  },
  // {
  //   id: 7,
  //   name: "safety",
  //   href: "",
  //   icon: "hard-hat",
  //   image: "../tools/safety.png",
  //   meta: {
  //     group: "safety",
  //     baseHref: "/tool/safety/browse/",
  //   },
  // },
];

const userInfo = userStore.info();

const filteredTools = ref<Tool[]>([]);

if (userInfo) {
  permissionStore.filterTools<Tool>(userInfo, tools).then((fT) => (filteredTools.value = fT));
}

const router = useRouter();

const push = async (href: string, toolName: TPermissionGroup): Promise<void> => {
  await new UserToolStatisticsManager().post(toolName);
  router.push({ path: href });
};
</script>

<template>
  <v-container class="layout-view-container bg-background mt-0 pt-0">
    <v-row>
      <v-col :cols="cols" v-for="tool in filteredTools" :key="tool.id">
        <v-card
          class="ma-4 bg-surface-1 text-on-surface rounded-xl elevation-6"
          rel="noopener"
          :href="undefined"
          @click="push(tool.href, tool.meta.group)"
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
