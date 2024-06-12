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

const route = useRoute();
const params = route.params;

const loading = ref<boolean>(true);

const docManager = new DocumentManager();

const equalConfidentiality = ref<boolean>(false);
const responseStatus = ref<IResponseStatus | null>(null);
const test = async () => {
  try {
    const desiredDocument = await docManager.getByUuidAndLangs(
      params.fileUUID as string,
      params.fileLangs as string
    );
    console.log("desiredDocument", desiredDocument);

    const userInfo: IUserEntity | false = useUserStore().info();
    if (!userInfo) throw new Error("unknown");

    equalConfidentiality.value =
      desiredDocument.confidentiality === userInfo.permission.confidentiality;

    if (!equalConfidentiality.value) throw new Error("unauthorized");

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

const handleDocumentRender = (): void => {
  loading.value = false;
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

      <v-col class="pdf" v-if="equalConfidentiality && !responseStatus">
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
