<script setup lang="ts">
import { computed, ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/style/index.css";
import "vue-pdf-embed/dist/style/annotationLayer.css";
import "vue-pdf-embed/dist/style/textLayer.css";
import { useRoute } from "vue-router";
import { nodeConfig } from "../config/env";

const route = useRoute();
const params = route.params;

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/documents/`;
const document = `${params.fileName}_qs_langs=${params.fileLangs}&uuid=${params.fileUUID}`;
const pdfSource = ref<any>(`${backend}${document}.pdf`);

const pageCount = ref<number | undefined>(undefined);
const page = ref<number>(1);

const index = computed(() => `${page.value}/${pageCount.value}`);

const isPrev = computed<boolean>(() => page.value >= 2);
const prev = (): void => {
  if (isPrev.value) page.value--;
};

const isNext = computed<boolean>(() => !!(pageCount.value && page.value < pageCount.value));
const next = (): void => {
  if (isNext.value) page.value++;
};

const handleDocumentLoad = ({ numPages }: { numPages: number }): void => {
  pageCount.value = numPages;
};

const loading = ref<boolean>(true);

const handleDocumentRender = (): void => {
  loading.value = false;
};
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row class="justify-center align-center">
      <v-progress-circular v-if="loading" color="primary" indeterminate></v-progress-circular>

      <h1 v-else class="text-h4">{{ params.fileName }} {{ index }}</h1>
    </v-row>
    <v-row class="justify-center align-center">
      <v-btn
        @click="prev"
        :disabled="!isPrev"
        icon="mdi-arrow-left-thick"
        class="ml-4 arrow arrow-left"
      >
      </v-btn>
      <v-btn
        @click="next"
        :disabled="!isNext"
        icon="mdi-arrow-right-thick"
        class="mr-4 arrow arrow-right"
      >
      </v-btn>

      <v-col class="pdf">
        <vue-pdf-embed
          annotation-layer
          text-layer
          :source="pdfSource"
          @loaded="handleDocumentLoad"
          @rendered="handleDocumentRender"
          :page="page"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.pdf {
  position: relative;
}
.arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;

  &-left {
    left: 0;
  }

  &-right {
    right: 0;
  }
}
</style>
