<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import FileDrive from "../../components/views/tools/analytic/files/drive/FileDrive.vue";
import Documentation from "../../components/views/tools/analytic/Documentation.vue";
// raws
import TransactionsRawSkyDataTable from "../../components/views/tools/analytic/sky/transactions/TransactionsRawSkyDataTable.vue";
import TransactionsRawLenovoDataTable from "../../components/views/tools/analytic/lenovo/transactions/TransactionsRawLenovoDataTable.vue";
import TransactionsRawIngenicoDataTable from "../../components/views/tools/analytic/ingenico/transactions/TransactionsRawIngenicoDataTable.vue";
import TransactionsRawLibertyDataTable from "../../components/views/tools/analytic/liberty/common/transactions/TransactionsRawLibertyDataTable.vue";

// sky
import SkyPackedUnitsOverview from "../../components/views/tools/analytic/sky/packing/packed/PackedUnitsOverview.vue";
import SkyPackingEfficiencyOverview from "../../components/views/tools/analytic/sky/packing/efficiency/PackingEfficiencyOverview.vue";
import SkyCosmeticEfficiencyOverview from "../../components/views/tools/analytic/sky/cosmetic/efficiency/CosmeticEfficiencyOverview.vue";
import SkyOobaEfficiencyOverview from "../../components/views/tools/analytic/sky/ooba/efficiency/OobaEfficiencyOverview.vue";
// lenovo
import LenovoRepairEfficiencyOverview from "../../components/views/tools/analytic/lenovo/repair/efficiency/RepairEfficiencyOverview.vue";
import LenovoCleaningEfficiencyOverview from "../../components/views/tools/analytic/lenovo/cleaning/efficiency/CleaningEfficiencyOverview.vue";
import LenovoFinalEfficiencyOverview from "../../components/views/tools/analytic/lenovo/final/efficiency/FinalEfficiencyOverview.vue";
import LenovoRegistrationEfficiencyOverview from "../../components/views/tools/analytic/lenovo/registration/efficiency/RegistrationEfficiencyOverview.vue";
import LenovoPackingEfficiencyOverview from "../../components/views/tools/analytic/lenovo/packing/efficiency/PackingEfficiencyOverview.vue";

// ingenico
import VmiEfficiencyOverview from "../../components/views/tools/analytic/ingenico/vmi/VmiEfficiencyOverview.vue";
import ScreeningEfficiencyOverview from "../../components/views/tools/analytic/ingenico/screening/ScreeningEfficiencyOverview.vue";
import WintestEfficiencyOverview from "../../components/views/tools/analytic/ingenico/wintest/WintestEfficiencyOverview.vue";
import FinaltestEfficiencyOverview from "../../components/views/tools/analytic/ingenico/finaltest/FinaltestEfficiencyOverview.vue";
import ActivationEfficiencyOverview from "../../components/views/tools/analytic/ingenico/activation/ActivationEfficiencyOverview.vue";
import CustomizationEfficiencyOverview from "../../components/views/tools/analytic/ingenico/customization/CustomizationEfficiencyOverview.vue";
import KeyinjectionEfficiencyOverview from "../../components/views/tools/analytic/ingenico/keyinjection/KeyinjectionEfficiencyOverview.vue";
import FgiEfficiencyOverview from "../../components/views/tools/analytic/ingenico/fgi/FgiEfficiencyOverview.vue";
import Repair2EfficiencyOverview from "../../components/views/tools/analytic/ingenico/repair/Repair2EfficiencyOverview.vue";
import Repair3EfficiencyOverview from "../../components/views/tools/analytic/ingenico/repair/Repair3EfficiencyOverview.vue";

// liberty

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
      {
        id: 22,
        title: "Registration",
        name: "registration",
        icon: undefined,
        children: [
          {
            id: 221,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 222,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 23,
        title: "Cleaning",
        name: "cleaning",
        icon: undefined,
        children: [
          {
            id: 231,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 232,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 24,
        title: "Final Test",
        name: "final",
        icon: undefined,
        children: [
          {
            id: 241,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 242,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 25,
        title: "Packing",
        name: "packing",
        icon: undefined,
        children: [
          {
            id: 251,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 252,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "ingenico",
    icon: undefined,
    meta: {
      group: "analytic",
      subgroup: "ingenico",
    },
    children: [
      {
        id: 31,
        title: "VMI",
        name: "vmi",
        icon: undefined,
        children: [
          {
            id: 311,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 312,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 32,
        title: "Screening",
        name: "screening",
        icon: undefined,
        children: [
          {
            id: 321,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 322,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 33,
        title: "Win Test",
        name: "wintest",
        icon: undefined,
        children: [
          {
            id: 331,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 332,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 34,
        title: "Final Test",
        name: "finaltest",
        icon: undefined,
        children: [
          {
            id: 341,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 342,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 35,
        title: "Activation",
        name: "activation",
        icon: undefined,
        children: [
          {
            id: 351,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 352,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 36,
        title: "Customization",
        name: "customization",
        icon: undefined,
        children: [
          {
            id: 361,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 362,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 37,
        title: "Key Injection",
        name: "keyinjection",
        icon: undefined,
        children: [
          {
            id: 371,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 372,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 38,
        title: "FGI",
        name: "fgi",
        icon: undefined,
        children: [
          {
            id: 381,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 382,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 39,
        title: "L2",
        name: "repair2",
        icon: undefined,
        children: [
          {
            id: 391,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 392,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 310,
        title: "L3",
        name: "repair3",
        icon: undefined,
        children: [
          {
            id: 3101,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 3102,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "liberty",
    icon: undefined,
    meta: {
      group: "analytic",
      subgroup: "liberty",
    },
    children: [
      {
        id: 41,
        title: "VMI",
        name: "vmi",
        icon: undefined,
        children: [
          {
            id: 411,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 412,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 42,
        title: "TEST",
        name: "test",
        icon: undefined,
        children: [
          {
            id: 421,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 422,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 43,
        title: "DEBUG / REPAIR",
        name: "debugrepair",
        icon: undefined,
        children: [
          {
            id: 431,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 432,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 44,
        title: "COSMETIC",
        name: "cosmetic",
        icon: undefined,
        children: [
          {
            id: 441,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 442,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 45,
        title: "HIGH-POT",
        name: "highpot",
        icon: undefined,
        children: [
          {
            id: 451,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 452,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 46,
        title: "PACK",
        name: "pack",
        icon: undefined,
        children: [
          {
            id: 461,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 462,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 47,
        title: "SHIP",
        name: "ship",
        icon: undefined,
        children: [
          {
            id: 471,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 472,
            title: "Overview",
            name: "overview",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
      {
        id: 48,
        title: "OOBA",
        name: "ooba",
        icon: undefined,
        children: [
          {
            id: 481,
            title: "Drive",
            name: "drive",
            icon: "mdi-folder-file-outline",
          },
          {
            id: 482,
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
  windowItem.value = cat && sub ? [program, cat, sub].filter(Boolean).join("-") : "documentation";
  router.push({
    path: `/tool/analytic/browse/${newPath}`,
  });
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
                <!-- SKY -->
                <!-- Packing -->
                <v-window-item value="sky-packing-drive">
                  <template v-if="windowItem === 'sky-packing-drive'">
                    <file-drive
                      subtitle="SKY Packing"
                      identification="sky-packing-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="sky-packing-overview">
                  <template v-if="windowItem === 'sky-packing-overview'">
                    <transactions-raw-sky-data-table
                      program="sky"
                      group="packing"
                      identification="sky-packing-overview"
                    ></transactions-raw-sky-data-table>
                    <sky-packed-units-overview
                      rawIdentification="sky-packing-overview"
                      class="mt-6"
                    >
                    </sky-packed-units-overview>
                    <sky-packing-efficiency-overview
                      rawIdentification="sky-packing-overview"
                      class="mt-6"
                    >
                    </sky-packing-efficiency-overview>
                  </template>
                </v-window-item>
                <!-- Cosmetic -->
                <v-window-item value="sky-cosmetic-drive">
                  <template v-if="windowItem === 'sky-cosmetic-drive'">
                    <file-drive
                      subtitle="SKY Cosmetic"
                      identification="sky-cosmetic-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="sky-cosmetic-overview">
                  <template v-if="windowItem === 'sky-cosmetic-overview'">
                    <transactions-raw-sky-data-table
                      program="sky"
                      group="cosmetic"
                      identification="sky-cosmetic-overview"
                    ></transactions-raw-sky-data-table>
                    <sky-cosmetic-efficiency-overview
                      rawIdentification="sky-cosmetic-overview"
                      class="mt-6"
                    >
                    </sky-cosmetic-efficiency-overview>
                  </template>
                </v-window-item>
                <!-- OOBA -->
                <v-window-item v-if="windowItem === 'sky-ooba-drive'" value="sky-ooba-drive">
                  <template v-if="windowItem === 'sky-ooba-drive'">
                    <file-drive subtitle="SKY OOBA" identification="sky-ooba-drive"></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="sky-ooba-overview">
                  <template v-if="windowItem === 'sky-ooba-overview'">
                    <transactions-raw-sky-data-table
                      program="sky"
                      group="ooba"
                      identification="sky-ooba-overview"
                    ></transactions-raw-sky-data-table>
                    <sky-ooba-efficiency-overview
                      rawIdentification="sky-ooba-overview"
                      class="mt-6"
                    >
                    </sky-ooba-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- LENOVO -->

                <!-- REPAIR -->
                <v-window-item value="lenovo-repair-drive">
                  <template v-if="windowItem === 'lenovo-repair-drive'">
                    <file-drive
                      subtitle="Lenovo Repair"
                      identification="lenovo-repair-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="lenovo-repair-overview">
                  <template v-if="windowItem === 'lenovo-repair-overview'">
                    <transactions-raw-lenovo-data-table
                      program="lenovo"
                      group="repair"
                      identification="lenovo-repair-overview"
                    ></transactions-raw-lenovo-data-table>
                    <lenovo-repair-efficiency-overview
                      rawIdentification="lenovo-repair-overview"
                      class="mt-6"
                    ></lenovo-repair-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- CLEANING -->
                <v-window-item value="lenovo-cleaning-drive">
                  <template v-if="windowItem === 'lenovo-cleaning-drive'">
                    <file-drive
                      subtitle="Lenovo Cleaning"
                      identification="lenovo-cleaning-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="lenovo-cleaning-overview">
                  <template v-if="windowItem === 'lenovo-cleaning-overview'">
                    <transactions-raw-lenovo-data-table
                      program="lenovo"
                      group="cleaning"
                      identification="lenovo-cleaning-overview"
                    ></transactions-raw-lenovo-data-table>
                    <lenovo-cleaning-efficiency-overview
                      rawIdentification="lenovo-cleaning-overview"
                      class="mt-6"
                    >
                    </lenovo-cleaning-efficiency-overview>
                  </template>
                </v-window-item>
                <!-- REGISTRATION -->
                <v-window-item value="lenovo-registration-drive">
                  <template v-if="windowItem === 'lenovo-registration-drive'">
                    <file-drive
                      subtitle="Lenovo Registration"
                      identification="lenovo-registration-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="lenovo-registration-overview">
                  <template v-if="windowItem === 'lenovo-registration-overview'">
                    <transactions-raw-lenovo-data-table
                      program="lenovo"
                      group="registration"
                      identification="lenovo-registration-overview"
                    ></transactions-raw-lenovo-data-table>
                    <lenovo-registration-efficiency-overview
                      rawIdentification="lenovo-registration-overview"
                      class="mt-6"
                    >
                    </lenovo-registration-efficiency-overview>
                  </template>
                </v-window-item>
                <!-- FINAL TEST -->
                <v-window-item value="lenovo-final-drive">
                  <template v-if="windowItem === 'lenovo-final-drive'">
                    <file-drive
                      subtitle="Lenovo Final Test"
                      identification="lenovo-final-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="lenovo-final-overview">
                  <template v-if="windowItem === 'lenovo-final-overview'">
                    <transactions-raw-lenovo-data-table
                      program="lenovo"
                      group="final"
                      identification="lenovo-final-overview"
                    ></transactions-raw-lenovo-data-table>
                    <lenovo-final-efficiency-overview
                      rawIdentification="lenovo-final-overview"
                      class="mt-6"
                    >
                    </lenovo-final-efficiency-overview>
                  </template>
                </v-window-item>
                <!-- PACKING -->
                <v-window-item value="lenovo-packing-drive">
                  <template v-if="windowItem === 'lenovo-packing-drive'">
                    <file-drive
                      subtitle="Lenovo Packing"
                      identification="lenovo-packing-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="lenovo-packing-overview">
                  <template v-if="windowItem === 'lenovo-packing-overview'">
                    <transactions-raw-lenovo-data-table
                      program="lenovo"
                      group="packing"
                      identification="lenovo-packing-overview"
                    ></transactions-raw-lenovo-data-table>
                    <lenovo-packing-efficiency-overview
                      rawIdentification="lenovo-packing-overview"
                      class="mt-6"
                    >
                    </lenovo-packing-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- INGENICO -->
                <!-- VMI Group -->
                <v-window-item value="ingenico-vmi-drive">
                  <template v-if="windowItem === 'ingenico-vmi-drive'">
                    <file-drive
                      subtitle="Ingenico VMI"
                      identification="ingenico-vmi-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-vmi-overview">
                  <template v-if="windowItem === 'ingenico-vmi-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="vmi"
                      identification="ingenico-vmi-overview"
                    ></transactions-raw-ingenico-data-table>
                    <vmi-efficiency-overview
                      raw-identification="ingenico-vmi-overview"
                      class="mt-6"
                    ></vmi-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Screening Group -->
                <v-window-item value="ingenico-screening-drive">
                  <template v-if="windowItem === 'ingenico-screening-drive'">
                    <file-drive
                      subtitle="Ingenico Screening"
                      identification="ingenico-screening-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-screening-overview">
                  <template v-if="windowItem === 'ingenico-screening-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="screening"
                      identification="ingenico-screening-overview"
                    ></transactions-raw-ingenico-data-table>
                    <screening-efficiency-overview
                      raw-identification="ingenico-screening-overview"
                      class="mt-6"
                    ></screening-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Win Test Group -->
                <v-window-item value="ingenico-wintest-drive">
                  <template v-if="windowItem === 'ingenico-wintest-drive'">
                    <file-drive
                      subtitle="Ingenico Win Test"
                      identification="ingenico-wintest-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-wintest-overview">
                  <template v-if="windowItem === 'ingenico-wintest-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="wintest"
                      identification="ingenico-wintest-overview"
                    ></transactions-raw-ingenico-data-table>
                    <wintest-efficiency-overview
                      raw-identification="ingenico-wintest-overview"
                      class="mt-6"
                    >
                    </wintest-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Final Test Group -->
                <v-window-item value="ingenico-finaltest-drive">
                  <template v-if="windowItem === 'ingenico-finaltest-drive'">
                    <file-drive
                      subtitle="Ingenico Final Test"
                      identification="ingenico-finaltest-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-finaltest-overview">
                  <template v-if="windowItem === 'ingenico-finaltest-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="finaltest"
                      identification="ingenico-finaltest-overview"
                    ></transactions-raw-ingenico-data-table>
                    <finaltest-efficiency-overview
                      raw-identification="ingenico-finaltest-overview"
                      class="mt-6"
                    ></finaltest-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Activation Group -->
                <v-window-item value="ingenico-activation-drive">
                  <template v-if="windowItem === 'ingenico-activation-drive'">
                    <file-drive
                      subtitle="Ingenico Activation"
                      identification="ingenico-activation-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-activation-overview">
                  <template v-if="windowItem === 'ingenico-activation-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="activation"
                      identification="ingenico-activation-overview"
                    ></transactions-raw-ingenico-data-table>
                    <activation-efficiency-overview
                      raw-identification="ingenico-activation-overview"
                      class="mt-6"
                    ></activation-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Customization Group -->
                <v-window-item value="ingenico-customization-drive">
                  <template v-if="windowItem === 'ingenico-customization-drive'">
                    <file-drive
                      subtitle="Ingenico Customization"
                      identification="ingenico-customization-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-customization-overview">
                  <template v-if="windowItem === 'ingenico-customization-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="customization"
                      identification="ingenico-customization-overview"
                    ></transactions-raw-ingenico-data-table>
                    <customization-efficiency-overview
                      raw-identification="ingenico-customization-overview"
                      class="mt-6"
                    ></customization-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Key Injection Group -->
                <v-window-item value="ingenico-keyinjection-drive">
                  <template v-if="windowItem === 'ingenico-keyinjection-drive'">
                    <file-drive
                      subtitle="Ingenico Key Injection"
                      identification="ingenico-keyinjection-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-keyinjection-overview">
                  <template v-if="windowItem === 'ingenico-keyinjection-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="keyinjection"
                      identification="ingenico-keyinjection-overview"
                    ></transactions-raw-ingenico-data-table>
                    <keyinjection-efficiency-overview
                      raw-identification="ingenico-keyinjection-overview"
                      class="mt-6"
                    ></keyinjection-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- FGI Group -->
                <v-window-item value="ingenico-fgi-drive">
                  <template v-if="windowItem === 'ingenico-fgi-drive'">
                    <file-drive
                      subtitle="Ingenico FGI"
                      identification="ingenico-fgi-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-fgi-overview">
                  <template v-if="windowItem === 'ingenico-fgi-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="fgi"
                      identification="ingenico-fgi-overview"
                    ></transactions-raw-ingenico-data-table>
                    <fgi-efficiency-overview
                      raw-identification="ingenico-fgi-overview"
                      class="mt-6"
                    ></fgi-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Repair 2 Group -->
                <v-window-item value="ingenico-repair2-drive">
                  <template v-if="windowItem === 'ingenico-repair2-drive'">
                    <file-drive
                      subtitle="Ingenico L2"
                      identification="ingenico-repair2-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-repair2-overview">
                  <template v-if="windowItem === 'ingenico-repair2-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="repair2"
                      identification="ingenico-repair2-overview"
                    ></transactions-raw-ingenico-data-table>
                    <repair-2-efficiency-overview
                      raw-identification="ingenico-repair2-overview"
                      class="mt-6"
                    ></repair-2-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Repair 3 Group -->
                <v-window-item value="ingenico-repair3-drive">
                  <template v-if="windowItem === 'ingenico-repair3-drive'">
                    <file-drive
                      subtitle="Ingenico L3"
                      identification="ingenico-repair3-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="ingenico-repair3-overview">
                  <template v-if="windowItem === 'ingenico-repair3-overview'">
                    <transactions-raw-ingenico-data-table
                      program="ingenico"
                      group="repair3"
                      identification="ingenico-repair3-overview"
                    ></transactions-raw-ingenico-data-table>
                    <repair-3-efficiency-overview
                      raw-identification="ingenico-repair3-overview"
                      class="mt-6"
                    ></repair-3-efficiency-overview>
                  </template>
                </v-window-item>

                <!-- Liberty VMI -->
                <v-window-item value="liberty-vmi-drive">
                  <template v-if="windowItem === 'liberty-vmi-drive'">
                    <file-drive
                      subtitle="Liberty VMI"
                      identification="liberty-vmi-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-vmi-overview">
                  <template v-if="windowItem === 'liberty-vmi-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="vmi"
                      identification="liberty-vmi-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty TEST -->
                <v-window-item value="liberty-test-drive">
                  <template v-if="windowItem === 'liberty-test-drive'">
                    <file-drive
                      subtitle="Liberty Test"
                      identification="liberty-test-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-test-overview">
                  <template v-if="windowItem === 'liberty-test-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="test"
                      identification="liberty-test-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty DEBUG / REPAIR -->
                <v-window-item value="liberty-debugrepair-drive">
                  <template v-if="windowItem === 'liberty-debugrepair-drive'">
                    <file-drive
                      subtitle="Liberty Debug / Repair"
                      identification="liberty-debugrepair-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-debugrepair-overview">
                  <template v-if="windowItem === 'liberty-debugrepair-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="debugrepair"
                      identification="liberty-debugrepair-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty COSMETIC -->
                <v-window-item value="liberty-cosmetic-drive">
                  <template v-if="windowItem === 'liberty-cosmetic-drive'">
                    <file-drive
                      subtitle="Liberty Cosmetic"
                      identification="liberty-cosmetic-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-cosmetic-overview">
                  <template v-if="windowItem === 'liberty-cosmetic-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="cosmetic"
                      identification="liberty-cosmetic-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty HIGH-POT -->
                <v-window-item value="liberty-highpot-drive">
                  <template v-if="windowItem === 'liberty-highpot-drive'">
                    <file-drive
                      subtitle="Liberty High-Pot"
                      identification="liberty-highpot-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-highpot-overview">
                  <template v-if="windowItem === 'liberty-highpot-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="highpot"
                      identification="liberty-highpot-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty PACK -->
                <v-window-item value="liberty-pack-drive">
                  <template v-if="windowItem === 'liberty-pack-drive'">
                    <file-drive
                      subtitle="Liberty Pack"
                      identification="liberty-pack-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-pack-overview">
                  <template v-if="windowItem === 'liberty-pack-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="pack"
                      identification="liberty-pack-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty SHIP -->
                <v-window-item value="liberty-ship-drive">
                  <template v-if="windowItem === 'liberty-ship-drive'">
                    <file-drive
                      subtitle="Liberty Ship"
                      identification="liberty-ship-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-ship-overview">
                  <template v-if="windowItem === 'liberty-ship-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="ship"
                      identification="liberty-ship-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>

                <!-- Liberty OOBA -->
                <v-window-item value="liberty-ooba-drive">
                  <template v-if="windowItem === 'liberty-ooba-drive'">
                    <file-drive
                      subtitle="Liberty OOBA"
                      identification="liberty-ooba-drive"
                    ></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="liberty-ooba-overview">
                  <template v-if="windowItem === 'liberty-ooba-overview'">
                    <transactions-raw-liberty-data-table
                      program="liberty"
                      group="ooba"
                      identification="liberty-ooba-overview"
                    ></transactions-raw-liberty-data-table>
                  </template>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
