<script setup lang="ts">
import { ref, watch } from "vue";
// import DepartmentFilters from "../../components/views/tools/matrix/department/DepartmentFilters.vue";
import DepartmentTable from "../../components/views/tools/matrix/department/DepartmentTable.vue";
// import DocumentFilters from "../../components/views/tools/matrix/document/DocumentFilters.vue";
import DocumentTable from "../../components/views/tools/matrix/document/DocumentTable.vue";
import ChipFilters from "../../components/tools/ChipFilters.vue";
import { IChips, ILevel } from "../../interfaces/document/DocumentTypes";
import { Chips } from "../../models/document/Chips";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import alertResponseStatus from "../../components/common/alertResponseStatus.vue";
import CompetenceTable from "../../components/views/tools/matrix/competence/CompetenceTable.vue";
import { useRoute, useRouter } from "vue-router";
import SimpleDocumentsPostedChart from "../../components/common/chartjs/documents/SimpleDocumentsPostedChart.vue";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import { v4 as uuidv4 } from "uuid";
import LinkToCreatorCard from "../../components/views/tools/matrix/document/creator/LinkToCreatorCard.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: "1",
    name: "departments",
    icon: "mdi-office-building",
    meta: {
      group: "matrix",
      subgroup: "departments",
    },
  },
  {
    id: "2",
    name: "documents",
    icon: "mdi-file-document",
    meta: {
      group: "matrix",
      subgroup: "documents",
    },
  },
  {
    id: "3",
    name: "competences",
    icon: "mdi-star-circle",
    meta: {
      group: "matrix",
      subgroup: "competences",
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
    case "departments":
      return getNumericValue ? "1" : "departments";

    case "documents":
      return getNumericValue ? "2" : "documents";

    case "competences":
      return getNumericValue ? "3" : "competences";

    default:
      return getNumericValue ? "1" : "instructions";
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

// const currentTab = ref<number>(1);
// const currentTabName = computed<string>(() => {
//   return tabs.find((tab) => tab.id === currentTab.value)?.name || "";
// });

const chips = ref<IChips>(new Chips());
const table = ref<ILevel | undefined>(undefined);

const handleTable = (newValue: ILevel): void => {
  table.value = newValue;
  setTimeout(() => {
    table.value = undefined;
  }, 0);
};

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

const departmentsConnectorId = uuidv4();
const documentsConnectorId = uuidv4();
const competencesConnectorId = uuidv4();
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
                    @click="router.push({ path: `/tool/matrix/browse/${tab.name}` })"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.matrix.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTabValue" class="w-100" :touch="false">
                <v-window-item value="1">
                  <chip-filters
                    :table="table"
                    :max-level="1"
                    :quickAccess="false"
                    :whereDocType="false"
                    :instanceId="departmentsConnectorId"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <department-table
                    :quickAccess="false"
                    :tab="tabs.at(0)!.name"
                    :instanceId="departmentsConnectorId"
                    class="bg-surface-2 pa-4 ma-1"
                  ></department-table>
                </v-window-item>
                <v-window-item value="2">
                  <chip-filters
                    :max-level="2"
                    :quickAccess="false"
                    :whereDocType="false"
                    :instanceId="documentsConnectorId"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <document-table
                    :tab="tabs.at(1)!.name"
                    :instanceId="documentsConnectorId"
                    class="bg-surface-2 pa-4 ma-1 mb-5"
                  ></document-table>
                  <link-to-creator-card></link-to-creator-card>
                  <simple-documents-posted-chart
                    class="bg-surface-2 pa-4 ma-1"
                  ></simple-documents-posted-chart>
                </v-window-item>
                <v-window-item value="3">
                  <chip-filters
                    :table="table"
                    :max-level="1"
                    :quickAccess="false"
                    :whereDocType="false"
                    :instanceId="competencesConnectorId"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <competence-table
                    @table="handleTable"
                    :chips="chips"
                    :tab="tabs.at(2)!.name"
                    :instanceId="competencesConnectorId"
                    class="bg-surface-2 pa-4 ma-1"
                  ></competence-table>
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
