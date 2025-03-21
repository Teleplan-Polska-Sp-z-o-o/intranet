<script setup lang="ts">
import { computed, ref } from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import Dashboard from "../../components/views/tools/matrix/document/creator/tabs/dashboard/Dashboard.vue";
import CreateNew from "../../components/views/tools/matrix/document/creator/tabs/new/CreateNew.vue";
import Released from "../../components/views/tools/matrix/document/creator/tabs/released/Released.vue";
import { useStepperStore } from "../../stores/documents/creator/useStepperStore";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";

const showAsMobile = ref<boolean>(true);
const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs: ToolTab[] = [
  {
    id: "1",
    name: "dashboard",
    icon: "mdi-view-dashboard",
    meta: {
      group: "tcd",
      subgroup: "dashboard",
    },
  },
  {
    id: "2",
    name: "new",
    icon: "mdi-format-float-center",
    meta: {
      group: "tcd",
      subgroup: "new",
    },
  },
  {
    id: "3",
    name: "released",
    icon: "mdi-file-document-check-outline",
    meta: {
      group: "tcd",
      subgroup: "released",
    },
  },
];

// filter tabs
const userInfo = useUserStore().info();
const filteredToolTabs = ref<ToolTab[]>([]);

if (userInfo) {
  usePermissionStore()
    .filterToolTabs<ToolTab>(userInfo, tabs)
    .then((fTT) => {
      filteredToolTabs.value = fTT;
    });
}

const router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();

const store = useStepperStore();

const { t } = useI18n();

const functionality = computed(() => route.params.functionality);

const title = computed(() => {
  if (functionality.value === "new") {
    if (!!route.params.id && store.stepper !== null) {
      return t(`tools.matrix.tabs.documents.creator.mainView.title.update`, {
        name: store.stepper!.name,
      });
    } else if (!route.params.id && store.stepper !== null) {
      return t(`tools.matrix.tabs.documents.creator.mainView.title.basedOn`, {
        name: `${store.stepper!.body.windows[2].model._id}-${
          store.stepper!.body.windows[2].model._revision
        }`,
      });
    } else {
      return t(`tools.matrix.tabs.documents.creator.mainView.title.create`);
    }
  } else return;
});

const push = (tabName: string) => {
  if (tabName === "new") {
    store.clearStepper();
  }
  router.push({ path: `/tool/tcd/browse/${tabName}` });
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
                    v-for="tab in filteredToolTabs"
                    :key="tab.id"
                    :value="tab.name"
                    class="rounded"
                    @click="() => push(tab.name)"
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
                  <released></released>
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
