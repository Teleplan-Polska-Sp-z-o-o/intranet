<script setup lang="ts">
import { ref, watch } from "vue";
import ChipFilters from "../../components/tools/ChipFilters.vue";
import CustomAiAssistant from "../../components/views/tools/documents/assistant/CustomAssistant.vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import DocumentTable from "../../components/views/tools/documents/DocumentTable.vue";
import { v4 as uuidv4 } from "uuid";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  // {
  //
  // },
  {
    id: 2,
    name: "all",
    icon: "mdi-file-document",
    meta: {
      group: "documents",
      subgroup: "all",
    },
  },
  // {
  //   id: 3,
  //   name: "instructions",
  //   icon: "mdi-file-document",
  //   meta: {
  //     group: "documents",
  //     subgroup: "instructions",
  //   },
  // },
  // {
  //   id: 4,
  //   name: "visuals",
  //   icon: "mdi-file-image",
  //   meta: {
  //     group: "documents",
  //     subgroup: "visuals",
  //   },
  // },
  // {
  //   id: 5,
  //   name: "msd",
  //   icon: "mdi-file-table",
  //   meta: {
  //     group: "documents",
  //     subgroup: "msd",
  //   },
  // },
  {
    id: 3,
    name: "quick",
    icon: "mdi-file-star",
    meta: {
      group: "documents",
      subgroup: "quick",
    },
  },
  {
    id: 4,
    name: "assistant",
    icon: "mdi-assistant",
    meta: {
      group: "documents",
      subgroup: "assistant",
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
      `tabName at getTab at DocumentsView evaluates to Array<string>: ${tabName}, length: ${tabName.length}`
    );
  if (!tabName) throw new Error("tabName at getTab at DocumentsView evaluates to undefined");

  switch (tabName) {
    case "all":
      return getNumericValue ? 2 : "all";

    // case "instructions":
    //   return getNumericValue ? 3 : "instructions";

    // case "visuals":
    //   return getNumericValue ? 4 : "visuals";

    // case "msd":
    //   return getNumericValue ? 5 : "msd";

    case "quick":
      return getNumericValue ? 3 : "quick";

    case "assistant":
      return getNumericValue ? 4 : "assistant";

    default:
      return getNumericValue ? 2 : "all";
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

// const chips = ref<IChips>(new Chips());
// const handleChips = (newValue: IChips): void => {
//   chips.value = newValue;
// };
// const type = ref<TDocumentType[]>(Object.values(EDocumentType));
// const handleType = (newValue: TDocumentType[]): void => {
//   type.value = newValue;
// };

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

const documentsConnectorId = uuidv4();
const quickAccessConnectorId = uuidv4();
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
                    v-for="tab in filteredToolTabs"
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
                <v-window-item :value="1"> </v-window-item>
                <!-- all documents -->
                <v-window-item :value="2">
                  <chip-filters
                    :max-level="2"
                    :quickAccess="false"
                    :whereDocType="true"
                    :instanceId="documentsConnectorId"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <document-table
                    tab="all"
                    :instanceId="documentsConnectorId"
                    class="bg-surface-2 pa-4 ma-1"
                  ></document-table>
                </v-window-item>
                <!-- quick access documents -->
                <v-window-item :value="3">
                  <chip-filters
                    :max-level="2"
                    :quickAccess="true"
                    :whereDocType="true"
                    :instanceId="quickAccessConnectorId"
                    class="bg-surface-2 mb-5 ma-1"
                  ></chip-filters>
                  <document-table
                    tab="quick"
                    :quickAccess="true"
                    class="bg-surface-2 pa-4 ma-1"
                    :instanceId="quickAccessConnectorId"
                  ></document-table>
                </v-window-item>
                <!-- ai assistant -->
                <v-window-item :value="4">
                  <custom-ai-assistant
                    tab="assistant"
                    assistantKey="documents"
                    class="bg-surface-2 pa-4 ma-1"
                  ></custom-ai-assistant>
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
