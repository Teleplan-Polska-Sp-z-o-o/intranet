<script setup lang="ts">
import { ref, watch } from "vue";
import ChipFilters from "../../components/tools/ChipFilters.vue";
import AllInstructionsTable from "../../components/views/tools/documents/all/AllInstructionsTable.vue";
import AllVisualsTable from "../../components/views/tools/documents/all/AllVisualsTable.vue";
import CustomAiAssistant from "../../components/views/tools/documents/assistant/CustomAssistant.vue";
import { IChips } from "../../interfaces/document/IChips";
import { ILevel } from "../../interfaces/document/ILevel";
import { Chips } from "../../models/document/Chips";
import { useRoute, useRouter } from "vue-router";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs = [
  // {
  //   id: 1,
  //   name: "my_documents",
  //   icon: "mdi-folder-account",
  // },
  // {
  //   id: 2,
  //   name: "my_favorites",
  //   icon: "mdi-star",
  // },
  {
    id: 3,
    name: "instructions",
    icon: "mdi-file-document",
  },
  {
    id: 4,
    name: "visuals",
    icon: "mdi-file-image",
  },
  {
    id: 5,
    name: "assistant",
    icon: "mdi-assistant",
  },
  // {
  //   id: 6,
  //   name: "recently_browsed",
  //   icon: "mdi-history",
  // },
];

const router = useRouter();
const route = useRoute();

const getTab = (newTab: string | Array<string>, getNumericValue: boolean): number | string => {
  if (Array.isArray(newTab))
    throw new Error(
      `newTab at getTab at DocumentsView evaluates to Array<string>: ${newTab}, length: ${newTab.length}`
    );
  switch (newTab) {
    case "instructions":
      return getNumericValue ? 3 : "instructions";

    case "visuals":
      return getNumericValue ? 4 : "visuals";

    case "assistant":
      return getNumericValue ? 5 : "assistant";

    default:
      return getNumericValue ? 3 : "instructions";
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
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row>
      <v-col>
        <v-container
          fluid
          class="d-flex bg-surface-1 text-on-surface-1 rounded-xl"
          :class="smallScreen ? 'flex-column' : 'flex-row'"
        >
          <v-row :class="smallScreen ? '' : 'w-25'">
            <v-col>
              <v-card class="rounded-xl elevation-2 bg-surface-2 text-on-surface ma-1">
                <v-tabs
                  v-model="currentTabValue"
                  color="secondary"
                  class="ma-4"
                  :direction="smallScreen ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in tabs"
                    :key="tab.id"
                    :value="tab.id"
                    class="rounded"
                    @click="router.push({ path: `/tool/documents/browse/${tab.name}` })"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.documents.tabs.${tab.name}.name`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTabValue" class="w-100" :touch="false">
                <v-window-item :value="1">
                  <!-- <my-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2 pa-4 ma-1"
                  ></my-docs-table> -->
                </v-window-item>
                <v-window-item :value="2">
                  <!-- <fav-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2 pa-4 ma-1"
                  ></fav-docs-table> -->
                </v-window-item>
                <v-window-item :value="3">
                  <chip-filters
                    @chips="handleChips"
                    :table="table"
                    :max-level="2"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <all-instructions-table
                    @table="handleTable"
                    :chips="chips"
                    :tab="'instructions'"
                    class="bg-surface-2 pa-4 ma-1"
                  ></all-instructions-table>
                </v-window-item>
                <v-window-item :value="4">
                  <chip-filters
                    @chips="handleChips"
                    :table="table"
                    :max-level="2"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <all-visuals-table
                    @table="handleTable"
                    :chips="chips"
                    :tab="'visuals'"
                    class="bg-surface-2 pa-4 ma-1"
                  ></all-visuals-table>
                </v-window-item>
                <v-window-item :value="5">
                  <!-- <iframe-ai-assistant
                    :tab="currentTabName"
                    class="bg-surface-2 pa-4 ma-1"
                  ></iframe-ai-assistant> -->
                  <custom-ai-assistant
                    :tab="'assistant'"
                    class="bg-surface-2 pa-4 ma-1"
                  ></custom-ai-assistant>
                </v-window-item>
                <v-window-item :value="6">
                  <!-- <rec-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2 pa-4 ma-1"
                  ></rec-docs-table> -->
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
