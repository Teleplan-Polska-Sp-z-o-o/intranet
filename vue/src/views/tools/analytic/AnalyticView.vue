<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../../stores/userStore";
import { usePermissionStore } from "../../../stores/permissionStore";
import FileDrive from "../../../components/views/tools/analytic/files/drive/FileDrive.vue";
import Documentation from "../../../components/views/tools/analytic/Documentation.vue";
// raws
import TransactionsRawSkyDataTable from "../../../components/views/tools/analytic/sky/common/transactions/TransactionsRawSkyDataTable.vue";
// import TransactionsRawSkyDataTable2 from "../../../components/views/tools/analytic/sky/transactions2/TransactionsRawSkyDataTable.vue";
import TransactionsRawLenovoDataTable from "../../../components/views/tools/analytic/lenovo/transactions/TransactionsRawLenovoDataTable.vue";
import TransactionsRawIngenicoDataTable from "../../../components/views/tools/analytic/ingenico/common/transactions/TransactionsRawIngenicoDataTable.vue";
import TransactionsRawLibertyDataTable from "../../../components/views/tools/analytic/liberty/common/transactions/TransactionsRawLibertyDataTable.vue";
import TransactionsRawDellDataTable from "../../../components/views/tools/analytic/dell/common/transactions/TransactionsRawDellDataTable.vue";

// sky "../../.
// import SkyPackedUnitsOverview from "../../../components/views/tools/analytic/sky/packing/packed/PackedUnitsOverview.vue";
import SkyPackingEfficiencyOverview from "../../../components/views/tools/analytic/sky/packing/PackingEfficiencyOverview.vue";
import SkyCosmeticEfficiencyOverview from "../../../components/views/tools/analytic/sky/cosmetic/CosmeticEfficiencyOverview.vue";
import SkyOobaEfficiencyOverview from "../../../components/views/tools/analytic/sky/ooba/OobaEfficiencyOverview.vue";
import SkyTestEfficiencyOverview from "../../../components/views/tools/analytic/sky/test/TestEfficiencyOverview.vue";

// lenovo
import LenovoRepairEfficiencyOverview from "../../../components/views/tools/analytic/lenovo/repair/efficiency/RepairEfficiencyOverview.vue";
import LenovoCleaningEfficiencyOverview from "../../../components/views/tools/analytic/lenovo/cleaning/efficiency/CleaningEfficiencyOverview.vue";
import LenovoFinalEfficiencyOverview from "../../../components/views/tools/analytic/lenovo/final/efficiency/FinalEfficiencyOverview.vue";
import LenovoRegistrationEfficiencyOverview from "../../../components/views/tools/analytic/lenovo/registration/efficiency/RegistrationEfficiencyOverview.vue";
import LenovoPackingEfficiencyOverview from "../../../components/views/tools/analytic/lenovo/packing/efficiency/PackingEfficiencyOverview.vue";

// ingenico
import VmiEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/vmi/VmiEfficiencyOverview.vue";
import ScreeningEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/screening/ScreeningEfficiencyOverview.vue";
import WintestEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/wintest/WintestEfficiencyOverview.vue";
import FinaltestEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/finaltest/FinaltestEfficiencyOverview.vue";
import ActivationEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/activation/ActivationEfficiencyOverview.vue";
import CustomizationEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/customization/CustomizationEfficiencyOverview.vue";
import KeyinjectionEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/keyinjection/KeyinjectionEfficiencyOverview.vue";
import FgiEfficiencyOverview from "../../../components/views/tools/analytic/ingenico/fgi/FgiEfficiencyOverview.vue";
import Repair2EfficiencyOverview from "../../../components/views/tools/analytic/ingenico/repair/Repair2EfficiencyOverview.vue";
import Repair3EfficiencyOverview from "../../../components/views/tools/analytic/ingenico/repair/Repair3EfficiencyOverview.vue";

// liberty
import LibertyVmiEfficiencyOverview from "../../../components/views/tools/analytic/liberty/vmi/VmiEfficiencyOverview.vue";
import LibertyTestEfficiencyOverview from "../../../components/views/tools/analytic/liberty/test/TestEfficiencyOverview.vue";
import LibertyDebugrepairEfficiencyOverview from "../../../components/views/tools/analytic/liberty/debugrepair/DebugrepairEfficiencyOverview.vue";
import LibertyHighpotEfficiencyOverview from "../../../components/views/tools/analytic/liberty/highpot/HighpotEfficiencyOverview.vue";
import LibertyCosmeticEfficiencyOverview from "../../../components/views/tools/analytic/liberty/cosmetic/CosmeticEfficiencyOverview.vue";
import LibertyPackEfficiencyOverview from "../../../components/views/tools/analytic/liberty/pack/PackEfficiencyOverview.vue";
// import LibertyShipEfficiencyOverview from "../../../components/views/tools/analytic/liberty/ship/ShipEfficiencyOverview.vue";
import LibertyOobaEfficiencyOverview from "../../../components/views/tools/analytic/liberty/ooba/OobaEfficiencyOverview.vue";
import { tabsObj } from "./tabsObj";

// Dell
import DellEfficiencyOverview from "../../../components/views/tools/analytic/dell/common/efficiency/EfficiencyOverview.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const router = useRouter();
const route = useRoute();

const tabs: ToolTab[] = tabsObj;

const dellTab = tabs.filter((tab: ToolTab) => tab.name === "dell");

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
    path: `/tool/analytic/browse/${newPath}`,
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
                    <!-- <sky-packed-units-overview
                      rawIdentification="sky-packing-overview"
                      class="mt-6"
                    >
                    </sky-packed-units-overview> -->
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
                <!-- Test -->
                <v-window-item v-if="windowItem === 'sky-test-drive'" value="sky-test-drive">
                  <template v-if="windowItem === 'sky-test-drive'">
                    <file-drive subtitle="SKY Test" identification="sky-test-drive"></file-drive>
                  </template>
                </v-window-item>
                <v-window-item value="sky-test-overview">
                  <template v-if="windowItem === 'sky-test-overview'">
                    <transactions-raw-sky-data-table
                      program="sky"
                      group="test"
                      identification="sky-test-overview"
                    ></transactions-raw-sky-data-table>
                    <sky-test-efficiency-overview
                      rawIdentification="sky-test-overview"
                      class="mt-6"
                    >
                    </sky-test-efficiency-overview>
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
                    <liberty-vmi-efficiency-overview
                      raw-identification="liberty-vmi-overview"
                      ttKey="VMI_TT"
                      class="mt-6"
                    />
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
                    <liberty-test-efficiency-overview
                      raw-identification="liberty-test-overview"
                      ttKey="TEST_TT"
                      class="mt-6"
                    />
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
                    <liberty-debugrepair-efficiency-overview
                      raw-identification="liberty-debugrepair-overview"
                      ttKey="DEB_REP_TT"
                      class="mt-6"
                    />
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
                    <liberty-cosmetic-efficiency-overview
                      raw-identification="liberty-cosmetic-overview"
                      class="mt-6"
                    />
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
                    <liberty-highpot-efficiency-overview
                      raw-identification="liberty-highpot-overview"
                      ttKey="HIPOT_TT"
                      class="mt-6"
                    />
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
                    <liberty-pack-efficiency-overview
                      raw-identification="liberty-pack-overview"
                      ttKey="PACK_TT"
                      class="mt-6"
                    />
                  </template>
                </v-window-item>

                <!-- Liberty SHIP -->
                <!-- <v-window-item value="liberty-ship-drive">
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
                    <liberty-ship-efficiency-overview
                      raw-identification="liberty-ship-overview"
                      ttKey="SHIP_TT"
                      class="mt-6"
                    />
                  </template>
                </v-window-item> -->

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
                    <liberty-ooba-efficiency-overview
                      raw-identification="liberty-ooba-overview"
                      ttKey="OBA_TT"
                      class="mt-6"
                    />
                  </template>
                </v-window-item>

                <!-- DELL -->
                <v-window-item
                  v-for="subTab in dellTab.at(0)!.children!"
                  :key="subTab.id"
                  :value="`dell-${subTab.name}-drive`"
                >
                  <template v-if="windowItem === `dell-${subTab.name}-drive`">
                    <file-drive
                      :subtitle="`Dell ${subTab.title}`"
                      :identification="`dell-${subTab.name}-drive`"
                    ></file-drive>
                  </template>
                </v-window-item>

                <v-window-item
                  v-for="subTab in dellTab.at(0)!.children!"
                  :key="subTab.id"
                  :value="`dell-${subTab.name}-overview`"
                >
                  <template v-if="windowItem === `dell-${subTab.name}-overview`">
                    <transactions-raw-dell-data-table
                      program="dell"
                      :group="subTab.name"
                      :identification="`dell-${subTab.name}-overview`"
                    ></transactions-raw-dell-data-table>
                    <dell-efficiency-overview
                      :raw-identification="`dell-${subTab.name}-overview`"
                      :title="`Employee ${subTab.title} Efficiency Overview`"
                      class="mt-6"
                    ></dell-efficiency-overview>
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
