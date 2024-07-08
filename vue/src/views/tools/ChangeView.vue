<script setup lang="ts">
import { ref, watch } from "vue";
import alertResponseStatus from "../../components/common/alertResponseStatus.vue";
import PCRTable from "../../components/views/tools/change/pcr/PCRTable.vue";
import PCNTable from "../../components/views/tools/change/pcn/PCNTable.vue";
import { useRoute, useRouter } from "vue-router";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: 1,
    name: "pcr",
    icon: "mdi-invoice-text-send-outline",
    meta: {
      group: "change",
      subgroup: "pcr",
    },
  },
  {
    id: 2,
    name: "pcn",
    icon: "mdi-bulletin-board",
    meta: {
      group: "change",
      subgroup: "pcn",
    },
  },
  // {
  //   id: 3,
  //   name: "dcn",
  //   icon: "mdi-bell-outline",
  // },
];

const router = useRouter();
const route = useRoute();

const getTab = (
  tabName: string | Array<string> | undefined,
  getNumericValue: boolean
): number | string => {
  if (Array.isArray(tabName))
    throw new Error(
      `tabName at getTab at ChangeView evaluates to Array<string>: ${tabName}, length: ${tabName.length}`
    );
  if (!tabName) throw new Error("tabName at getTab at ChangeView evaluates to undefined");

  switch (tabName) {
    case "pcr":
      return getNumericValue ? 1 : "pcr";

    case "pcn":
      return getNumericValue ? 2 : "pcn";

    case "dcn":
      return getNumericValue ? 3 : "dcn";

    default:
      return getNumericValue ? 1 : "pcr";
  }
};

const currentTabValue = ref<number>(getTab(route.params.tab, true) as number);

const currentTab = ref<string>(getTab(route.params.tab, false) as string);

watch(
  () => route.params.tab,
  (newTab) => {
    currentTabValue.value = getTab(newTab, true) as number;
    currentTab.value = getTab(route.params.tab, false) as string;
  }
);

const responseStatus = ref<ResponseStatus | null>(null);
const handleResponseStatus = (status: ResponseStatus) => (responseStatus.value = status);

// filter tabs
const userInfo = useUserStore().info();
const filteredToolTabs = ref<ToolTab[]>([]);

if (userInfo) {
  usePermissionStore()
    .filterToolTabs<ToolTab>(userInfo, tabs)
    .then((fTT) => {
      filteredToolTabs.value = fTT;
      currentTabValue.value = getTab(filteredToolTabs.value.at(0)?.meta.subgroup, true) as number;
    });
}
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
                  v-model="currentTabValue"
                  color="secondary"
                  class="ma-4"
                  :direction="smallScreen ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in filteredToolTabs"
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
              <v-window v-model="currentTabValue" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <p-c-r-table
                    class="bg-surface-2 pa-4 ma-1"
                    @responseStatus="handleResponseStatus"
                    :tab="currentTab"
                  ></p-c-r-table>
                </v-window-item>
                <v-window-item :value="2">
                  <p-c-n-table
                    class="bg-surface-2 pa-4 ma-1"
                    @responseStatus="handleResponseStatus"
                    :tab="currentTab"
                  ></p-c-n-table>
                </v-window-item>
                <v-window-item :value="3"> </v-window-item>
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
