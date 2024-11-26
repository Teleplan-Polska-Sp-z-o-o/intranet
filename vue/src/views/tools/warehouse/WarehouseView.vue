<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../../stores/userStore";
import { usePermissionStore } from "../../../stores/permissionStore";
import Documentation from "../../../components/views/tools/analytic/Documentation.vue";
import { tabsObj } from "./tabsObj";
// raws

const smallScreen = ref<boolean>(window.innerWidth < 960);
const router = useRouter();
const route = useRoute();

const tabs: ToolTab[] = tabsObj;

const filteredToolTabs = ref<ToolTab[]>([]);
const toggled = ref<string[]>([]);
const windowItem = ref<string>("documentation");

// Helper function to find the corresponding IDs for program, category, and subcategory
const findTabIds = (program: string, cat?: string, sub?: string): string[] => {
  const programTab = tabs.find((tab) => tab.name === program);
  if (!programTab) return [];

  const ids = [programTab.id]; // Start with the program ID

  if (cat && programTab.children) {
    const categoryTab = programTab.children.find((child) => child.name === cat);
    if (categoryTab) {
      ids.push(categoryTab.id);

      if (sub && categoryTab.children) {
        const subTab = categoryTab.children.find((child) => child.name === sub);
        if (subTab) {
          ids.push(subTab.id);
        }
      }
    }
  }

  return ids;
};

const location = (program: string, cat?: string, sub?: string): void => {
  const newPath = [program, cat, sub].filter(Boolean).join("/");
  windowItem.value = cat && sub ? [program, cat, sub].filter(Boolean).join("-") : "documentation";
  router.push({
    path: `/tool/warehouse/browse/${newPath}`,
  });
};

const isActive = (subId: string): boolean => {
  const routeProgram = route.params.program as string;
  const routeCat = route.params.cat as string | undefined;
  const routeSub = route.params.sub as string | undefined;

  const ids: string[] = findTabIds(routeProgram, routeCat, routeSub);
  return ids.length === 3 && ids.at(2) === subId;
};

onMounted(async () => {
  const userInfo = useUserStore().info();
  if (!userInfo) return;
  filteredToolTabs.value = await usePermissionStore().filterToolTabs<ToolTab>(userInfo, tabs);
  const { program, cat, sub } = route.params as {
    program: string;
    cat: string | undefined;
    sub: string | undefined;
  };
  // Use the findTabIds function to dynamically get the tab ids based on the current route
  toggled.value = findTabIds(program, cat, sub);
  windowItem.value = cat && sub ? `${program}-${cat}-${sub}` : "documentation";
});
</script>

<template>
  <v-container class="layout-view-container bg-background">
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
                <v-list v-model:opened="toggled" class="bg-surface-2">
                  <v-list-group
                    v-for="program in filteredToolTabs"
                    :key="program.id"
                    :value="program.id"
                  >
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props" @click="location(program.name)">
                        <v-list-item-title class="text-uppercase">
                          {{ program.name }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>

                    <v-list-group v-for="cat in program.children" :key="cat.id" :value="cat.id">
                      <template v-slot:activator="{ props }">
                        <v-list-item
                          v-bind="props"
                          :title="cat.title"
                          @click="location(program.name, cat.name)"
                        ></v-list-item>
                      </template>

                      <v-list-item
                        v-for="sub in cat.children"
                        :key="sub.id"
                        :prepend-icon="sub.icon"
                        :title="sub.title"
                        :value="sub.id"
                        :active="isActive(sub.id)"
                        @click="location(program.name, cat.name, sub.name)"
                      ></v-list-item>
                    </v-list-group>
                  </v-list-group>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="windowItem" class="w-100" :touch="false">
                <v-window-item value="documentation">
                  <documentation></documentation>
                </v-window-item>
                <!-- stocktaking -->
                <v-window-item value="stocktaking-wip-report"> </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
