<script setup lang="ts">
import { computed, ref } from "vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

interface Tool {
  id: number;
  times: number;
  title: string;
  to: string;
}

const tools = ref<Array<Tool>>([
  {
    id: 1,
    times: 86,
    title: "Documents",
    to: "/tool/documents",
  },
  {
    id: 2,
    times: 56,
    title: "Matrix",
    to: "/tool/matrix",
  },
  {
    id: 3,
    times: 32,
    title: "Admin",
    to: "/tool/admin",
  },
]);

const toolsSorted = computed(() => [...tools.value].sort((a, b) => b.times - a.times));

const toolSubtitle = (index: number) => {
  switch (index) {
    case 0:
      return "Most Utilized";
    case 1:
      return "Runner-Up";
    case 2:
      return "Common Choice";
  }
};

const cols = computed(() => (smallScreen ? 3 : 2));
</script>

<template>
  <v-col :cols="cols" v-for="(tool, i) in toolsSorted" :key="tool.id">
    <v-card :class="`bg-tertiary-container text-on-tertiary-container rounded-xl mx-4`">
      <v-card-item class="text-center">
        <v-card-title>{{ tool.title }}</v-card-title>
        <v-card-subtitle>{{ toolSubtitle(i) }}</v-card-subtitle>
      </v-card-item>

      <v-card-text class="text-center">
        <v-btn variant="tonal" class="rounded-lg" :size="56" :to="tool.to">
          <v-icon icon="mdi-open-in-app" :size="24" />
        </v-btn>
      </v-card-text>
    </v-card>
  </v-col>
</template>
