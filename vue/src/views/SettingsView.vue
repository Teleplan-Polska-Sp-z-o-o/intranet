<script setup lang="ts">
import { ref } from "vue";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";
import ApplicationWindow from "../components/views/settings/ApplicationWindow.vue";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";

const responseStatus = ref<IResponseStatus | null>(null);
const handleResponseStatus = (status: IResponseStatus) => (responseStatus.value = status);

const smallScreen = ref<boolean>(window.innerWidth < 960);

const currentTab = ref<number>(1);

const tabs = [
  {
    id: 1,
    name: "application",
    icon: "mdi-office-building",
  },
];
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
                    {{
                      smallScreen ? "" : $t(`common.default_layout.pages.settings.${tab.name}.name`)
                    }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTab" class="w-100">
                <v-window-item :value="1">
                  <application-window @response-status="handleResponseStatus" />
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
