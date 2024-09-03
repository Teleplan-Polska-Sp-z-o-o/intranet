<script setup lang="ts">
import { ref, watch } from "vue";
import DepartmentTable from "../../components/views/tools/matrix/department/DepartmentTable.vue";
import DocumentTable from "../../components/views/tools/matrix/document/DocumentTable.vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import { v4 as uuidv4 } from "uuid";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: 1,
    name: "manage-acknowledgment",
    icon: "mdi-file-settings-outline",
    meta: {
      group: "safety",
      subgroup: "manage-acknowledgment",
    },
  },
  {
    id: 2,
    name: "document-acknowledged",
    icon: "mdi-file-sign",
    meta: {
      group: "safety",
      subgroup: "document-acknowledged",
    },
  },
];

const router = useRouter();
const route = useRoute();

const getTab = (
  tabName: string | Array<string> | undefined,
  getNumericValue: boolean
): number | string => {
  if (Array.isArray(tabName))
    throw new Error(
      `tabName at getTab at MatrixView evaluates to Array<string>: ${tabName}, length: ${tabName.length}`
    );
  if (!tabName) throw new Error("tabName at getTab at MatrixView evaluates to undefined");

  switch (tabName) {
    case "manage-acknowledgment":
      return getNumericValue ? 1 : "manage-acknowledgment";

    case "document-acknowledged":
      return getNumericValue ? 2 : "document-acknowledged";

    default:
      return getNumericValue ? 1 : "manage-acknowledgment";
  }
};

const currentTabValue = ref<number>(getTab(route.params.tab, true) as number);
// const currentTabName = ref<string>(getTab(route.params.tab, false) as string);

watch(
  () => route.params.tab,
  (newTab) => {
    currentTabValue.value = getTab(newTab, true) as number;
    // currentTabName.value = getTab(newTab, false) as string;
  }
);

// filter tabs
const userInfo = useUserStore().info();
const filteredToolTabs = ref<ToolTab[]>([]);

if (userInfo) {
  usePermissionStore()
    .filterToolTabs<ToolTab>(userInfo, tabs)
    .then((fTT) => {
      filteredToolTabs.value = fTT;
      currentTabValue.value = getTab(
        filteredToolTabs.value.find((tab) => route.path.includes(tab.meta.subgroup))?.meta.subgroup,
        true
      ) as number;
    });
}

const acknowledgmentConnectorId = uuidv4();
const acknowledgedConnectorId = uuidv4();
</script>

<template>
  <v-container class="layout-view-container bg-background">
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
                    @click="router.push({ path: `/tool/safety/browse/${tab.name}` })"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.safety.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTabValue" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <department-table
                    :quickAccess="false"
                    :tab="tabs.at(0)!.name"
                    :instanceId="acknowledgmentConnectorId"
                    class="bg-surface-2 pa-4 ma-1"
                  ></department-table>
                </v-window-item>
                <v-window-item :value="2">
                  <document-table
                    :tab="tabs.at(1)!.name"
                    :instanceId="acknowledgedConnectorId"
                    class="bg-surface-2 pa-4 ma-1 mb-5"
                  ></document-table>
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
