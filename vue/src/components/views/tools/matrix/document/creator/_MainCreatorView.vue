<script setup lang="ts">
import { computed, ref } from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../../../../../interfaces/common/ToolTabTypes";
import CreateNew from "./tabs/new/CreateNew.vue";
import Released from "./tabs/released/ReleasedTable.vue";
import Dashboard from "./tabs/dashboard/Dashboard.vue";
import { useStepperStore } from "../../../../../../stores/documents/creator/useStepperStore";
import { useI18n } from "vue-i18n";
import Archived from "./tabs/released/ArchivedTable.vue";

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
    name: "released",
    icon: "mdi-file-document-check-outline",
    meta: {
      group: "matrix",
      subgroup: "documents",
    },
  },
];

const router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();

const store = useStepperStore();

const { t } = useI18n();

const functionality = computed(() => route.params.functionality);

const title = computed(() => {
  if (functionality.value === "new") {
    if (!!route.params.id && store.stepper !== null) {
      return t(`tools.tcd.mainView.title.update`, {
        name: store.stepper!.name,
      });
    } else if (!route.params.id && store.stepper !== null) {
      return t(`tools.tcd.mainView.title.basedOn`, {
        name: store.stepper!.name,
      });
    } else {
      return t(`tools.tcd.mainView.title.create`);
    }
  }
  // else if (functionality.value === "drafts") {
  //   return t(`tools.tcd.mainView.title.drafts`);
  // }
  else return;
});

const push = (tabName: string) => {
  if (tabName === "new") {
    // store.setStepper({
    //   type: DocumentCreatorStepper.EStepperType.INSTRUCTION,
    //   navigation: {
    //     router,
    //   },
    // });
    store.clearStepper();
  }
  router.push({ path: `/tool/matrix/browse/documents/creator/${tabName}` });
};
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
                  v-model="functionality"
                  color="secondary"
                  class="ma-4"
                  :direction="showAsMobile ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in tabs"
                    :key="tab.id"
                    :value="tab.name"
                    class="rounded"
                    @click="() => push(tab.name)"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.tcd.mainView.tabs.${tab.name}`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="showAsMobile ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-alert
                v-if="title"
                border="start"
                border-color="primary"
                class="ma-1 mb-6"
                :title="title"
                type="info"
                variant="tonal"
              >
              </v-alert>

              <v-window v-model="functionality" class="w-100" :touch="false">
                <v-window-item value="dashboard">
                  <dashboard></dashboard>
                </v-window-item>
                <v-window-item value="new">
                  <create-new></create-new>
                </v-window-item>
                <v-window-item value="released">
                  <v-container fluid>
                    <v-row no-gutters class="mb-8">
                      <v-col :cols="12">
                        <released></released>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col :cols="12">
                        <archived></archived>
                      </v-col>
                    </v-row>
                  </v-container>
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
