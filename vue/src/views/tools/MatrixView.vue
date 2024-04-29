<script setup lang="ts">
import { computed, ref } from "vue";
// import DepartmentFilters from "../../components/views/tools/matrix/department/DepartmentFilters.vue";
import DepartmentTable from "../../components/views/tools/matrix/department/DepartmentTable.vue";
// import DocumentFilters from "../../components/views/tools/matrix/document/DocumentFilters.vue";
import DocumentTable from "../../components/views/tools/matrix/document/DocumentTable.vue";
import ChipFilters from "../../components/tools/ChipFilters.vue";
import { IChips } from "../../interfaces/document/IChips";
import { ILevel } from "../../interfaces/document/ILevel";
import { Chips } from "../../models/document/Chips";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import alertResponseStatus from "../../components/common/alertResponseStatus.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs = [
  {
    id: 1,
    name: "departments",
    icon: "mdi-office-building",
  },
  {
    id: 2,
    name: "documents",
    icon: "mdi-file-document",
  },
];

const currentTab = ref<number>(1);
const currentTabName = computed<string>(() => {
  return tabs.find((tab) => tab.id === currentTab.value)?.name || "";
});

const chips = ref<IChips>(new Chips());
const table = ref<ILevel | undefined>(undefined);

const handleChips = (newValue: IChips): void => {
  chips.value = newValue;
};
const handleTable = (newValue: ILevel): void => {
  table.value = newValue;
  setTimeout(() => {
    table.value = undefined;
  }, 0);
};

const responseStatus = ref<IResponseStatus | null>(null);
const handleResponseStatus = (status: IResponseStatus) => (responseStatus.value = status);
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
                  <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id" class="rounded">
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.matrix.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTab" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <chip-filters
                    @chips="handleChips"
                    :table="table"
                    :max-level="1"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <department-table
                    @table="handleTable"
                    :chips="chips"
                    :tab="currentTabName"
                    @responseStatus="handleResponseStatus"
                    class="bg-surface-2 pa-4 ma-1"
                  ></department-table>
                </v-window-item>
                <v-window-item :value="2">
                  <chip-filters
                    @chips="handleChips"
                    :table="table"
                    :max-level="2"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <document-table
                    @table="handleTable"
                    :chips="chips"
                    :tab="currentTabName"
                    @responseStatus="handleResponseStatus"
                    class="bg-surface-2 pa-4 ma-1"
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
