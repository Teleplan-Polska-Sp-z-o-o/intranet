<script setup lang="ts">
import { ref } from "vue";
import { nodeConfig } from "../../config/env";

const props = defineProps<{
  name: string | undefined;
  number?: string;
}>();

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/flows/`;
const pdfSource = `${backend}${props.name}.png`;

const smallScreen = ref<boolean>(window.innerWidth < 960);
</script>

<template>
  <v-dialog v-if="props.name" max-width="60vw" max-height="80vh">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="!smallScreen"
        v-bind="activatorProps"
        prepend-icon="mdi-chart-timeline-variant-shimmer"
        variant="plain"
        text="Flow Chart"
      />
      <v-btn v-else v-bind="activatorProps" icon="mdi-chart-timeline-variant-shimmer" />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        :title="`Flow Chart ${number ? `(${number})` : ''}`"
        color="primary"
        variant="outlined"
        class="bg-background rounded-xl"
      >
        <v-img :src="pdfSource"></v-img>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            text="Close Flow Chart"
            @click="isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
