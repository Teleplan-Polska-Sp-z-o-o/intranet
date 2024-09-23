<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ToolTab } from "../../interfaces/common/ToolTabTypes";
import { useUserStore } from "../../stores/userStore";
import { usePermissionStore } from "../../stores/permissionStore";
import FileDrive from "../../components/views/tools/analytic/files/drive/FileDrive.vue";
import Documentation from "../../components/views/tools/analytic/Documentation.vue";
import TransactionsRawDataTable from "../../components/views/tools/analytic/sky/transactions/TransactionsRawDataTable.vue";
import { AnalyticRawManager } from "../../models/analytic/AnalyticRawManager";
import TransactionsModelsPlan from "../../components/views/tools/analytic/sky/kpi/TransactionsModelsPlan.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const router = useRouter();
const route = useRoute();

const tabs: ToolTab[] = [
  {
    id: 0,
    name: "sky",
    icon: undefined,
    meta: {
      group: "analytic",
      subgroup: "sky",
    },
    children: [
      {
        id: 0,
        title: "Packing",
        name: "packing",
        icon: undefined,
        children: [
          {
            id: 0,
            title: "Drive",
            name: "drive",
            icon: "mdi-database",
          },
          {
            id: 1,
            title: "Data",
            name: "data",
            icon: "mdi-chart-box-multiple-outline",
          },
        ],
      },
    ],
  },
];

const filteredToolTabs = ref<ToolTab[]>([]);
const toggled = ref<string[]>([]);
const windowItem = ref<string>("documentation");

const filterUndefined = (arr: (string | undefined)[]): string[] =>
  arr.filter((v): v is string => v !== undefined);

const location = (program: string, cat?: string, sub?: string): void => {
  const newPath = filterUndefined([program, cat, sub]).join("/");
  router.push({
    path: `/tool/analytic/browse/${newPath}`,
  });
  windowItem.value = sub ? filterUndefined([program, cat, sub]).join("-") : "documentation";
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

  toggled.value = filterUndefined([program, cat, sub]);

  windowItem.value = sub ? filterUndefined([program, cat, sub]).join("-") : "documentation";
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
                    :value="program.name"
                  >
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props" @click="location(program.name)">
                        <v-list-item-title class="text-uppercase">
                          {{ program.name }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>

                    <v-list-group v-for="cat in program.children" :key="cat.id" :value="cat.name">
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
                        :value="sub.name"
                        :active="route.params.sub === sub.name"
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
                <v-window-item value="sky-packing-drive">
                  <file-drive
                    subtitle="SKY Packing"
                    identification="sky-packing-drive"
                  ></file-drive>
                </v-window-item>
                <v-window-item value="sky-packing-data">
                  <transactions-raw-data-table
                    :manager="new AnalyticRawManager('sky')"
                    identification="sky-packing-data"
                  ></transactions-raw-data-table>
                  <transactions-models-plan rawIdentification="sky-packing-data" class="mt-6">
                  </transactions-models-plan>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
