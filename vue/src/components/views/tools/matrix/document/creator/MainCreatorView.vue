<script setup lang="ts">
import { computed, ref } from "vue";
import { RouteLocationNormalizedLoadedGeneric, useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../../../../../interfaces/common/ToolTabTypes";
import CreateNew from "./tabs/new/CreateNew.vue";
import Drafts from "./tabs/drafts/Drafts.vue";
import Dashboard from "./tabs/dashboard/Dashboard.vue";
import { useStepperStore } from "../../../../../../stores/documents/creator/useStepperStore";
import { useI18n } from "vue-i18n";

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
const route: RouteLocationNormalizedLoadedGeneric = useRoute();

const store = useStepperStore();

const { t } = useI18n();

const functionality = computed(() => route.params.functionality);

const title = computed(() => {
  if (functionality.value !== "new") return;
  if (!!route.params.id && store.stepper !== null) {
    return t(`tools.matrix.tabs.documents.creator.mainView.title.update`, {
      name: store.stepper!.name,
    });
  } else {
    return t(`tools.matrix.tabs.documents.creator.mainView.title.create`);
  }
});

const push = (tabName: string) => {
  if (tabName === "new") {
    store.setStepper({
      navigation: {
        router,
      },
    });
  } else router.push({ path: `/tool/matrix/browse/documents/creator/${tabName}` });
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
                <v-window-item value="drafts">
                  <drafts></drafts>
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
