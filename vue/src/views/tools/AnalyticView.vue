<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import FileDrive from "../../components/views/tools/analytic/files/drive/FileDrive.vue";
import Documentation from "../../components/views/tools/analytic/Documentation.vue";
import TransactionsRawSkyDataTable from "../../components/views/tools/analytic/sky/transactions/TransactionsRawSkyDataTable.vue";
import TransactionsRawLenovoDataTable from "../../components/views/tools/analytic/lenovo/transactions/TransactionsRawLenovoDataTable.vue";
import PackedUnitsOverview from "../../components/views/tools/analytic/sky/packing/packed/PackedUnitsOverview.vue";
import PackingEfficiencyOverview from "../../components/views/tools/analytic/sky/packing/efficiency/PackingEfficiencyOverview.vue";
import CosmeticEfficiencyOverview from "../../components/views/tools/analytic/sky/cosmetic/efficiency/CosmeticEfficiencyOverview.vue";
import OobaEfficiencyOverview from "../../components/views/tools/analytic/sky/ooba/efficiency/OobaEfficiencyOverview.vue";
import RepairEfficiencyOverview from "../../components/views/tools/analytic/lenovo/repair/efficiency/RepairEfficiencyOverview.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const router = useRouter();
const route = useRoute();

const tabs: ToolTab[] = [
  {
    id: 1,
    name: "sky",
    icon: undefined,
    meta: {
      group: "analytic",
      subgroup: "sky",
    },
    children: [
      {
        id: 11,
        title: "Packing",
        name: "packing",
        icon: undefined,
        children: [
          {
            id: 111,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 112,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 12,
        title: "Cosmetic",
        name: "cosmetic",
        icon: undefined,
        children: [
          {
            id: 121,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 122,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 13,
        title: "OOBA",
        name: "ooba",
        icon: undefined,
        children: [
          {
            id: 131,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 132,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "lenovo",
    icon: undefined,
    meta: {
      group: "analytic",
      subgroup: "lenovo",
    },
    children: [
      {
        id: 21,
        title: "Repair",
        name: "repair",
        icon: undefined,
        children: [
          {
            id: 211,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 212,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
    ],
  },
];

const filteredToolTabs = ref<ToolTab[]>([]);
const toggled = ref<number[]>([]);
const windowItem = ref<string>("documentation");

// Helper function to find the corresponding IDs for program, category, and subcategory
const findTabIds = (program: string, cat?: string, sub?: string): number[] => {
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
  router.push({
    path: `/tool/analytic/browse/${newPath}`,
  });

  windowItem.value = cat && sub ? [program, cat, sub].filter(Boolean).join("-") : "documentation";
};

const isActive = (subId: number): boolean => {
  const routeProgram = route.params.program as string;
  const routeCat = route.params.cat as string | undefined;
  const routeSub = route.params.sub as string | undefined;

  const ids: number[] = findTabIds(routeProgram, routeCat, routeSub);
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
                <!-- Packing -->
                <v-window-item value="sky-packing-drive">
                  <file-drive
                    subtitle="SKY Packing"
                    identification="sky-packing-drive"
                  ></file-drive>
                </v-window-item>
                <v-window-item value="sky-packing-overview">
                  <transactions-raw-sky-data-table
                    program="sky"
                    group="packing"
                    identification="sky-packing-overview"
                  ></transactions-raw-sky-data-table>
                  <packed-units-overview rawIdentification="sky-packing-overview" class="mt-6">
                  </packed-units-overview>
                  <packing-efficiency-overview
                    rawIdentification="sky-packing-overview"
                    class="mt-6"
                  >
                  </packing-efficiency-overview>
                </v-window-item>
                <!-- Cosmetic -->
                <v-window-item value="sky-cosmetic-drive">
                  <file-drive
                    subtitle="SKY Cosmetic"
                    identification="sky-cosmetic-drive"
                  ></file-drive>
                </v-window-item>
                <v-window-item value="sky-cosmetic-overview">
                  <transactions-raw-sky-data-table
                    program="sky"
                    group="cosmetic"
                    identification="sky-cosmetic-overview"
                  ></transactions-raw-sky-data-table>
                  <cosmetic-efficiency-overview
                    rawIdentification="sky-cosmetic-overview"
                    class="mt-6"
                  >
                  </cosmetic-efficiency-overview>
                </v-window-item>
                <!-- OOBA -->
                <v-window-item value="sky-ooba-drive">
                  <file-drive subtitle="SKY OOBA" identification="sky-ooba-drive"></file-drive>
                </v-window-item>
                <v-window-item value="sky-ooba-overview">
                  <transactions-raw-sky-data-table
                    program="sky"
                    group="ooba"
                    identification="sky-ooba-overview"
                  ></transactions-raw-sky-data-table>
                  <ooba-efficiency-overview rawIdentification="sky-ooba-overview" class="mt-6">
                  </ooba-efficiency-overview>
                </v-window-item>

                <!-- LENOVO -->
                <!-- REPAIR -->
                <v-window-item value="lenovo-repair-drive">
                  <file-drive
                    subtitle="Lenovo Repair"
                    identification="lenovo-repair-drive"
                  ></file-drive>
                </v-window-item>
                <v-window-item value="lenovo-repair-overview">
                  <transactions-raw-lenovo-data-table
                    program="lenovo"
                    group="repair"
                    identification="lenovo-repair-overview"
                  ></transactions-raw-lenovo-data-table>
                  <repair-efficiency-overview
                    rawIdentification="lenovo-repair-overview"
                    class="mt-6"
                  ></repair-efficiency-overview>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
