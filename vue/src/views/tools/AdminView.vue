<script setup lang="ts">
import { ref, watch } from "vue";
import PermissionsTable from "../../components/views/tools/admin/permission/PermissionsTable.vue";
import NewsTable from "../../components/views/tools/admin/NewsTable.vue";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import alertResponseStatus from "../../components/common/alertResponseStatus.vue";
import PermissionsTableInfo from "../../components/views/tools/admin/permission/PermissionsTableInfo.vue";
import { useRoute, useRouter } from "vue-router";
import InfoTable from "../../components/views/tools/admin/users/InfoTable.vue";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import LoginUniqueUserDistributionChart from "../../components/common/chartjs/users/LoginUniqueUserDistributionChart.vue";
import NewUsersChart from "../../components/common/chartjs/users/NewUsersChart.vue";
import LoggedInCard from "../../components/common/chartjs/users/LoggedInCard.vue";
import TotalLoginsChart from "../../components/common/chartjs/users/TotalLoginsChart.vue";
import ReturningUsersChart from "../../components/common/chartjs/users/ReturningUsersChart.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: 1,
    name: "user-info",
    icon: "mdi-badge-account",
    meta: {
      group: "admin",
      subgroup: "user-info",
    },
  },
  {
    id: 2,
    name: "user-permissions",
    icon: "mdi-shield-account",
    meta: {
      group: "admin",
      subgroup: "user-permissions",
    },
  },
  {
    id: 3,
    name: "news",
    icon: "mdi-pencil-outline",
    meta: {
      group: "admin",
      subgroup: "news",
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
      `tabName at getTab at AdminView evaluates to Array<string>: ${tabName}, length: ${tabName.length}`
    );
  if (!tabName) throw new Error("tabName at getTab at AdminView evaluates to undefined");

  switch (tabName) {
    case "user-info":
      return getNumericValue ? 1 : "user-info";

    case "user-permissions":
      return getNumericValue ? 2 : "user-permissions";

    case "news":
      return getNumericValue ? 3 : "news";

    default:
      return getNumericValue ? 1 : "user-info";
  }
};

const currentTabValue = ref<number>(getTab(route.params.tab, true) as number);

watch(
  () => route.params.tab,
  (newTab) => {
    currentTabValue.value = getTab(newTab, true) as number;
  }
);

// const responseStatus = ref<IResponseStatus | null>(null);
// const handleResponseStatus = (status: IResponseStatus) => (responseStatus.value = status);

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
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <!-- <v-row>
      <v-col cols="12">
        <alert-response-status :status="responseStatus" :persist="false" />
      </v-col>
    </v-row> -->
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
                    @click="router.push({ path: `/tool/admin/browse/${tab.name}` })"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.admin.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTabValue" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <info-table class="bg-surface-2 pa-4 ma-1 mb-5" tab="user-info"></info-table>

                  <logged-in-card class="bg-surface-2 pa-4 ma-1 mb-5"></logged-in-card>
                  <login-unique-user-distribution-chart
                    class="bg-surface-2 pa-4 ma-1 mb-5"
                  ></login-unique-user-distribution-chart>
                  <total-logins-chart class="bg-surface-2 pa-4 ma-1 mb-5"></total-logins-chart>

                  <new-users-chart class="bg-surface-2 pa-4 ma-1 mb-5"></new-users-chart>
                  <returning-users-chart class="bg-surface-2 pa-4 ma-1"></returning-users-chart>
                </v-window-item>
                <v-window-item :value="2">
                  <permissions-table-info class="mb-5 ma-1"></permissions-table-info>
                  <permissions-table
                    class="bg-surface-2 pa-4 ma-1"
                    tab="user-permissions"
                  ></permissions-table>
                </v-window-item>
                <v-window-item :value="3">
                  <news-table class="bg-surface-2 pa-4 ma-1" tab="news"></news-table>
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
