<script setup lang="ts">
import { computed, ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/style/index.css";
import "vue-pdf-embed/dist/style/annotationLayer.css";
import "vue-pdf-embed/dist/style/textLayer.css";
import { useRoute } from "vue-router";
import { nodeConfig } from "../config/env";
import { DocumentManager } from "../models/document/DocumentManager";
import { useUserStore } from "../stores/userStore";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { IUserEntity } from "../interfaces/user/IUserEntity";
import { Helper } from "../models/common/Helper";
import { useI18n } from "vue-i18n";

const route = useRoute();
const params = route.params;

const loading = ref<boolean>(true);

const docManager = new DocumentManager();

const confidentialityPassed = ref<boolean>(false);
const responseStatus = ref<IResponseStatus | null>(null);
const test = async () => {
  try {
    const desiredDocument = await docManager.getByUuidAndLangs(
      params.fileUUID as string,
      params.fileLangs as string
    );

    const userInfo: IUserEntity | false = useUserStore().info();
    if (!userInfo) throw new Error("unknown");

    const confidentialityRestrictions = Helper.confidentialRestriction(
      desiredDocument.confidentiality
    );
    confidentialityPassed.value = confidentialityRestrictions?.includes(
      userInfo.permission.confidentiality
    );

    if (!confidentialityPassed.value) throw new Error("unauthorized");

    return;
  } catch (error) {
    loading.value = false;
    console.log(error);
    if (
      error instanceof Error &&
      (error.message === "unknown" || error.message === "unauthorized")
    ) {
      responseStatus.value = new ResponseStatus({ code: 400, message: error.message });
    } else {
      console.log(`test at DocumentView, ${error}`);
    }
  }
};

test();

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/documents/`;
const doc = `${params.fileName}_qs_langs=${params.fileLangs}&uuid=${params.fileUUID}`;
const pdfSource = ref<any>(`${backend}${doc}.pdf`);

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

const handleDocumentRender = (): void => {
  loading.value = false;
};

const sliderScale = ref<number>(0.8);

const formatNumber = (num: number) => {
  return (num * 10).toFixed(0).padStart(2, "0");
};
const pdfClassExtension = computed(() => formatNumber(sliderScale.value));
const { t } = useI18n();
const ticks = computed(() => ({
  0.6: t("common.default_layout.pages.viewDocument.small"),
  0.7: "",
  0.8: "",
  0.9: "",
  1: t("common.default_layout.pages.viewDocument.large"),
}));
const increaseScale = () => {
  if (sliderScale.value < 1) {
    sliderScale.value = +(sliderScale.value + 0.1).toFixed(1);
  }
};
const decreaseScale = () => {
  if (sliderScale.value > 0.6) {
    sliderScale.value = +(sliderScale.value - 0.1).toFixed(1);
  }
};
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row class="justify-center align-center">
      <alert-response-status
        v-if="responseStatus"
        :status="responseStatus"
        :persist="true"
      ></alert-response-status>
      <v-progress-circular
        v-if="loading && !responseStatus"
        color="primary"
        indeterminate
      ></v-progress-circular>

      <h1 v-if="!loading && !responseStatus" class="text-h4">{{ params.fileName }} {{ index }}</h1>
    </v-row>
    <v-row class="justify-center align-center w-50 mx-auto">
      <v-slider
        v-if="!loading && !responseStatus"
        v-model="sliderScale"
        :max="1"
        :min="0.6"
        append-icon="mdi-image-size-select-actual"
        prepend-icon="mdi-image-size-select-large"
        :ticks="ticks"
        :step="0.1"
        show-ticks="always"
        @click:append="increaseScale"
        @click:prepend="decreaseScale"
        color="primary"
      ></v-slider>
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

      <v-col
        class="pdfDocumentView"
        :class="`canvas-scale-${pdfClassExtension}`"
        v-if="confidentialityPassed && !responseStatus"
      >
        <vue-pdf-embed
          ref="pdfEmbed"
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

<style lang="scss">
.pdfDocumentView {
  position: relative;

  &.canvas-scale-06 {
    canvas {
      width: 60% !important;
      height: 60% !important;
      margin: auto !important;
    }
  }

  &.canvas-scale-07 {
    canvas {
      width: 70% !important;
      height: 70% !important;
      margin: auto !important;
    }
  }

  &.canvas-scale-08 {
    canvas {
      width: 80% !important;
      height: 80% !important;
      margin: auto !important;
    }
  }

  &.canvas-scale-09 {
    canvas {
      width: 90% !important;
      height: 90% !important;
      margin: auto !important;
    }
  }

  &.canvas-scale-10 {
    canvas {
      width: 100% !important;
      height: 100% !important;
      margin: auto !important;
    }
  }
}
</style>
