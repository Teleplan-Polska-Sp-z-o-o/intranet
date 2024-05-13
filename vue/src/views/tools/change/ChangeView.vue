<script setup lang="ts">
import { DefineComponent, computed, ref } from "vue";
import alertResponseStatus from "../../../components/common/alertResponseStatus.vue";
import PCRTable from "../../../components/views/tools/change/pcr/PCRTable.vue";
import PCNTable from "../../../components/views/tools/change/pcn/PCNTable.vue";
import { useRoute, useRouter } from "vue-router";
import { ResponseStatus } from "../../../models/common/ResponseStatus";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs = [
  {
    id: 1,
    name: "pcr",
    icon: "mdi-invoice-text-send-outline",
    component: PCRTable,
  },
  {
    id: 2,
    name: "pcn",
    icon: "mdi-bulletin-board",
    component: PCNTable,
  },
  // {
  //   id: 3,
  //   name: "dcn",
  //   icon: "mdi-bell-outline",
  //   component: PCRTable,
  // },
];

const router = useRouter();
const route = useRoute();

const currentTab = ref<number>(1);
const no = ref<string | undefined>((route.params.no as string) || undefined);

switch (route.params.tab) {
  case "pcr":
    currentTab.value = 1;
    break;
  case "pcn":
    currentTab.value = 2;
    break;
  case "dcn":
    currentTab.value = 3;
    break;

  default:
    currentTab.value = 1;
    break;
}

const currentTabName = computed<string>(() => {
  return tabs.find((tab) => tab.id === currentTab.value)?.name || "";
});

const tabTable = computed<
  DefineComponent<{ tab: string; no: string | undefined }, any, any> | undefined
>(() => {
  return tabs.find((tab) => tab.id === currentTab.value)?.component;
});

const responseStatus = ref<ResponseStatus | null>(null);
const handleResponseStatus = (status: ResponseStatus) => (responseStatus.value = status);
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row>
      <v-col cols="12">
        <alert-response-status :status="responseStatus" :persist="false" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container
          fluid
          class="d-flex bg-surface-1 rounded-xl"
          :class="smallScreen ? 'flex-column' : 'flex-row'"
        >
          <v-row :class="smallScreen ? '' : 'w-25'">
            <v-col>
              <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
                <v-tabs
                  v-model="currentTab"
                  color="secondary"
                  class="ma-4"
                  :direction="smallScreen ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in tabs"
                    :key="tab.id"
                    :value="tab.id"
                    class="rounded"
                    @click="router.push({ path: `/tool/change/browse/${tab.name}` })"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.change.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTab" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <router-view
                    class="bg-surface-2 pa-4 ma-1"
                    :is="tabTable"
                    @responseStatus="handleResponseStatus"
                    :tab="currentTabName"
                    :no="no"
                  ></router-view>
                </v-window-item>
                <v-window-item :value="2">
                  <router-view
                    class="bg-surface-2 pa-4 ma-1"
                    :is="tabTable"
                    @responseStatus="handleResponseStatus"
                    :tab="currentTabName"
                    :no="no"
                  ></router-view
                ></v-window-item>
                <v-window-item :value="3"
                  ><router-view
                    class="bg-surface-2 pa-4 ma-1"
                    :is="tabTable"
                    @responseStatus="handleResponseStatus"
                    :tab="currentTabName"
                    :no="no"
                  ></router-view>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
@media (max-width: 959px) {
  .tab {
    width: 21px;
    padding: 0 8px;
  }
}
</style>
