<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../../../../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../../../../../stores/userStore";
import { usePermissionStore } from "../../../../../../stores/permissionStore";
import CreateNew from "./tabs/new/CreateNew.vue";

// SHOW ALWAYS SMALL SCREEN
const showAsMobile = ref<boolean>(true);
const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: "1",
    name: "dashboard",
    icon: "mdi-view-dashboard",
    meta: {
      group: "matrix",
      subgroup: "documents",
    },
  },
  {
    id: "2",
    name: "new",
    icon: "mdi-format-float-center",
    meta: {
      group: "matrix",
      subgroup: "documents",
    },
  },
  {
    id: "3",
    name: "drafts",
    icon: "mdi-progress-pencil",
    meta: {
      group: "matrix",
      subgroup: "documents",
    },
  },
];

const router = useRouter();
const route = useRoute();

const getFunctionality = (
  functionalityName: string | Array<string> | undefined,
  getNumericValue: boolean
): number | string => {
  if (Array.isArray(functionalityName))
    throw new Error(
      `functionalityName at getFunctionality at MatrixView evaluates to Array<string>: ${functionalityName}, length: ${functionalityName.length}`
    );
  if (!functionalityName)
    throw new Error("functionalityName at getFunctionality at MatrixView evaluates to undefined");

  switch (functionalityName) {
    case "dashboard":
      return getNumericValue ? "1" : "dashboard";

    case "new":
      return getNumericValue ? "2" : "new";

    case "drafts":
      return getNumericValue ? "3" : "drafts";

    default:
      return getNumericValue ? "1" : "dashboard";
  }
};

const currentFunctionalityValue = ref<number>(
  getFunctionality(route.params.functionality, true) as number
);

watch(
  () => route.params.functionality,
  (newTab) => {
    currentFunctionalityValue.value = getFunctionality(newTab, true) as number;
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
      currentFunctionalityValue.value = getFunctionality(
        filteredToolTabs.value.find((tab) => route.path.includes(tab.meta.subgroup))?.meta.subgroup,
        true
      ) as number;
    });
}
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row>
      <v-col>
        <v-container
          fluid
          class="d-flex bg-surface-1 rounded-xl"
          :class="showAsMobile ? 'flex-column' : 'flex-row'"
        >
          <v-row :class="showAsMobile ? '' : 'w-25'">
            <v-col>
              <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
                <v-tabs
                  v-model="currentFunctionalityValue"
                  color="secondary"
                  class="ma-4"
                  :direction="showAsMobile ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in filteredToolTabs"
                    :key="tab.id"
                    :value="tab.id"
                    class="rounded"
                    @click="
                      router.push({ path: `/tool/matrix/browse/documents/creator/${tab.name}` })
                    "
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{
                      smallScreen
                        ? ""
                        : $t(`tools.matrix.tabs.documents.creator.mainView.tabs.${tab.name}`)
                    }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="showAsMobile ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentFunctionalityValue" class="w-100" :touch="false">
                <v-window-item value="1"> dashboard </v-window-item>
                <v-window-item value="2">
                  <create-new></create-new>
                </v-window-item>
                <v-window-item value="3"> drafts </v-window-item>
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
