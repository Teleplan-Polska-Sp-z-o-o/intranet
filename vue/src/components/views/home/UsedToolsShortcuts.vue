<script setup lang="ts">
import { computed, ComputedRef, ref, watchEffect } from "vue";
import { UserToolStatisticsManager } from "../../../models/user/UserToolStatisticsManager";
import { TPermissionGroup, UserTypes } from "../../../interfaces/user/UserTypes";
import { useUserStore } from "../../../stores/userStore";
import { usePermissionStore } from "../../../stores/permissionStore";
import { useRouter } from "vue-router";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const manager = new UserToolStatisticsManager();
const statistics = ref<UserTypes.ToolStatistics.StatisticsEntity[]>([]);
const formattedStatistics: ComputedRef<UserTypes.ToolStatistics.ToolFilteredStatistics[]> =
  computed(() =>
    statistics.value.map((s) => {
      return {
        ...s,
        href: "",
        meta: {
          group: s.toolName as TPermissionGroup,
          baseHref: `/tool/${s.toolName}/browse/`,
        },
      };
    })
  );

const filteredStatistics = ref<UserTypes.ToolStatistics.ToolFilteredStatistics[]>([]);

watchEffect(async () => {
  statistics.value = await manager.get();

  const userInfo = useUserStore().info();
  if (userInfo) {
    usePermissionStore()
      .filterTools<UserTypes.ToolStatistics.ToolFilteredStatistics>(
        userInfo,
        formattedStatistics.value
      )
      .then((fT) => (filteredStatistics.value = fT));
  }
});

const statisticsSorted = computed(() =>
  [...filteredStatistics.value].sort((a, b) => b.enterCount - a.enterCount)
);

const cols = computed(() => (smallScreen ? 3 : 2));

const router = useRouter();
const push = async (href: string, toolName: TPermissionGroup): Promise<void> => {
  await new UserToolStatisticsManager().post(toolName);
  router.push({ path: href });
};
</script>

<template>
  <v-col
    v-if="!smallScreen"
    :cols="cols"
    v-for="statistics in statisticsSorted"
    :key="statistics.id"
  >
    <v-card
      class="rounded-xl mx-4 w-100 bg-surface-1 d-flex flex-column"
      :image="`../tools/${statistics.meta.group}.png`"
      height="200px"
      @click="push(statistics.href, statistics.meta.group)"
      link
    >
      <v-spacer></v-spacer>
      <template v-slot:actions>
        <v-btn
          append-icon="mdi-chevron-right"
          color="tertiary"
          :text="statistics.toolName"
          variant="outlined"
          class="rounded-xl bg-background"
          block
        ></v-btn>
      </template>
    </v-card>
  </v-col>
  <v-col :cols="12" v-else>
    <v-slide-group show-arrows>
      <v-slide-group-item v-for="statistics in statisticsSorted" :key="statistics.id">
        <v-card
          class="rounded-xl mx-4 w-100 bg-surface-1 d-flex flex-column"
          :image="`../tools/${statistics.meta.group}.png`"
          height="200px"
          @click="push(statistics.href, statistics.meta.group)"
          link
        >
          <v-spacer></v-spacer>
          <template v-slot:actions>
            <v-btn
              append-icon="mdi-chevron-right"
              color="tertiary"
              :text="statistics.toolName"
              variant="outlined"
              class="rounded-xl bg-background text-caption"
              block
            ></v-btn>
          </template>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-col>
</template>
