<script setup lang="ts">
import { computed, ComputedRef, onMounted, onUnmounted, Ref, ref, unref } from "vue";
import { DocumentViewer } from "../../models/document/DocumentViewer/DocumentViewer";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/style/index.css";
import "vue-pdf-embed/dist/style/annotationLayer.css";
import "vue-pdf-embed/dist/style/textLayer.css";
import { useI18n } from "vue-i18n";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const loading: Ref<boolean> = ref<boolean>(true);
const loaded: Ref<boolean> = ref<boolean>(false);

const documentViewer: DocumentViewer = new DocumentViewer();
const amIAuthorized: Ref<boolean> = ref<boolean>(false);
const source: Ref<string | null> = ref(null);

const pageCount: Ref<number | undefined> = ref<number | undefined>(undefined);
const pageNumber: Ref<number> = ref<number>(1);

const pageMessage: ComputedRef<string> = computed(() => {
  return t("common.default_layout.pages.viewDocument.pageMessage", {
    currentPage: pageNumber.value,
    totalPages: pageCount.value,
  });
});

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const isPrev = computed<boolean>(() => pageNumber.value >= 2);
const prev = (): void => {
  if (isPrev.value) {
    pageNumber.value--;
    scrollToTop();
  }
};

const isNext = computed<boolean>(() => !!(pageCount.value && pageNumber.value < pageCount.value));
const next = (): void => {
  if (isNext.value) {
    pageNumber.value++;
    scrollToTop();
  }
};

const handleLoaded = ({ numPages }: { numPages: number }): void => {
  pageCount.value = numPages;
  loading.value = false;
  loaded.value = true;
};

const handleRendered = (): void => {};

// page size
const sliderScale = ref<number>(smallScreen.value ? 1 : 0.7);
const formatNumber = (num: number) => {
  return (num * 10).toFixed(0).padStart(2, "0");
};
const pdfClassExtension = computed(() => formatNumber(sliderScale.value));
const { t } = useI18n();
const ticks = computed(() => ({
  0.4: t("common.default_layout.pages.viewDocument.small"),
  0.5: "",
  0.6: "",
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
  if (sliderScale.value > 0.4) {
    sliderScale.value = +(sliderScale.value - 0.1).toFixed(1);
  }
};
// Prevent default Ctrl + Scroll behavior and handle scaling
const handleCtrlScroll = (event: WheelEvent) => {
  if (event.ctrlKey) {
    event.preventDefault();
    if (event.deltaY < 0) {
      increaseScale();
    } else {
      decreaseScale();
    }
  }
};

const isSupported = ref<boolean>(true);
const downloadNotSupported = (fileSource: string | null) => {
  if (!fileSource) return;
  const anchor = document.createElement("a");
  anchor.href = fileSource;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

onMounted(async () => {
  window.addEventListener("wheel", handleCtrlScroll, { passive: false });

  amIAuthorized.value = await documentViewer.amIAuthorized();

  source.value = await documentViewer.getSource();

  const src = unref(source);
  // Check if the source does not end with `.pdf`
  if (src && typeof src === "string") {
    if (!src.endsWith(".pdf")) {
      isSupported.value = false;
    }
  } else {
    console.error("Invalid source or source is not set.");
  }
});
onUnmounted(() => {
  window.removeEventListener("wheel", handleCtrlScroll);
});

const handleError = (error: any) => {
  console.error("Error loading PDF:", error);
};
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row class="justify-center align-center position-relative">
      <v-progress-circular
        v-if="loading && isSupported"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-alert v-if="!isSupported" class="mx-8" type="info" variant="tonal" border="start">
        <p>
          <strong>{{ $t("common.default_layout.pages.viewDocument.important") }}:</strong>
          {{ $t("common.default_layout.pages.viewDocument.unsupported") }}
        </p>
        <v-btn class="mt-2" color="primary" variant="tonal" @click="downloadNotSupported(source)">
          {{ $t("common.default_layout.pages.viewDocument.download") }}
        </v-btn>
      </v-alert>

      <h1 v-if="loaded && amIAuthorized" class="text-body-2 position-absolute">
        {{ pageMessage }}
      </h1>
    </v-row>
    <v-row class="justify-center align-center">
      <v-btn
        v-show="loaded"
        @click="prev"
        :disabled="!isPrev"
        icon="mdi-arrow-left-thick"
        class="ml-4 arrow arrow-left"
        :class="{ 'arrow-top-mobile': smallScreen }"
        color="primary"
      >
      </v-btn>
      <v-btn
        v-show="loaded"
        @click="next"
        :disabled="!isNext"
        icon="mdi-arrow-right-thick"
        class="mr-4 arrow arrow-right"
        :class="{ 'arrow-top-mobile': smallScreen }"
        color="primary"
      >
      </v-btn>
      <v-slider
        v-if="loaded && amIAuthorized && !smallScreen"
        v-model="sliderScale"
        :max="1"
        :min="0.4"
        append-icon="mdi-image-size-select-actual"
        prepend-icon="mdi-image-size-select-large"
        :ticks="ticks"
        :step="0.1"
        show-ticks="always"
        @click:append="increaseScale"
        @click:prepend="decreaseScale"
        color="secondary"
        direction="vertical"
        class="slider-ae905726-0509 ml-7 h-25"
      ></v-slider>

      <v-col class="pdfDocumentView-45183477-16ad" :class="`canvas-scale-${pdfClassExtension}`">
        <vue-pdf-embed
          v-if="amIAuthorized && !!source"
          ref="pdfEmbed"
          annotation-layer
          text-layer
          :source="source"
          @loaded="handleLoaded"
          @rendered="handleRendered"
          @error="handleError"
          :page="pageNumber"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.arrow {
  position: fixed;
  top: 65%;
  transform: translateY(-50%);
  z-index: 999;

  &-top-mobile {
    top: 85% !important;
  }

  &-left {
    left: 0;
  }

  &-right {
    right: 0;
  }
}
</style>

<style lang="scss">
.slider-ae905726-0509 {
  position: fixed;
  top: 40%;
  left: 0;
  transform: translateY(-50%);
  z-index: 999;

  .v-input__control {
    min-height: 0px !important;
    height: 20vh !important;
  }
}

.pdfDocumentView-45183477-16ad {
  position: relative;

  &.canvas-scale-04 {
    canvas {
      width: 40% !important;
      height: 40% !important;
      margin: auto !important;
    }
  }
  &.canvas-scale-05 {
    canvas {
      width: 50% !important;
      height: 50% !important;
      margin: auto !important;
    }
  }
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
