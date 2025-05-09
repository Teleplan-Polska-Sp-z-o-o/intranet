<script setup lang="ts">
import { ref, computed, ComputedRef } from "vue";
import { useUserStore } from "../../../stores/userStore";
import { IUser } from "../../../interfaces/user/UserTypes";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useMsalStore } from "../../../stores/msalStore";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const msalStore = useMsalStore();
const props = defineProps(["drawerVisible"]);
const router = useRouter();
const smallScreen = ref<boolean>(window.innerWidth < 960);
const drawerLocation = computed((): "bottom" | "left" => (smallScreen.value ? "bottom" : "left"));

const userObj = ref<IUser | false>(useUserStore().info());
const username: ComputedRef<string> = computed(() => {
  const lowercased = userObj.value ? userObj.value.username?.split(".").at(0) : null;
  return lowercased ? lowercased.charAt(0).toUpperCase() + lowercased.slice(1) : "";
});

const logoutMicrosoft = async () => {
  // await msalStore.init();

  // Only show popup if any accounts are present
  if (msalStore.getAllAccounts().length > 0) {
    await msalStore.msalInstance.logoutPopup();
  }
  // const accounts = msalStore.msalInstance.getAllAccounts();
  // if (accounts.length > 0) {
  //   await msalStore.msalInstance.logoutPopup();
  // }

  userStore.clear();
  settingsStore.clear();
  router.push("/");
};

const menuItems = [
  {
    id: 1,
    link: "/pages/home",
    content: "home",
    icon: "home",
    onClick: undefined,
  },
  {
    id: 2,
    link: "/pages/tools",
    content: "tools",
    icon: "tools",
    onClick: undefined,
  },
  {
    id: 3,
    link: "/pages/settings/user",
    content: "settings",
    icon: "cogs",
    onClick: undefined,
  },
  {
    id: 4,
    link: "",
    content: "logout",
    icon: "account-arrow-left",
    onClick: logoutMicrosoft,
  },
];

const { t } = useI18n();

const hello = computed(() => t("common.default_layout.drawer.hello"));
</script>

<template>
  <v-navigation-drawer
    :location="drawerLocation"
    temporary
    v-model="props.drawerVisible"
    class="bg-layout text-on-surface rounded-xl mt-8"
  >
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ `${hello} ${username}` }}
          </v-list-item-title>
          <!-- <v-list-item-subtitle> </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item
        v-for="item in menuItems"
        :key="item.id"
        :link="item.link || item.onClick ? true : undefined"
        :to="item.link ? item.link : undefined"
        :class="item.content === 'logout' ? 'mt-12' : ''"
        @click="item.onClick"
      >
        <!-- @click="item.onClick" -->
        <v-list-item-icon>
          <v-icon :icon="`mdi-${item.icon}`"></v-icon>
        </v-list-item-icon>
        <v-list-item-content class="pl-2">{{
          t(`common.default_layout.drawer.${item.content}`)
        }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
