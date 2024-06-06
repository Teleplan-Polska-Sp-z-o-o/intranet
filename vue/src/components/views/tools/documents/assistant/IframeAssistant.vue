<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { getDocumentsAssistantConfig } from "../../../../../config/env";

const { url, token } = getDocumentsAssistantConfig();

const endpoint = new URL(url);
endpoint.searchParams.set("token", token);

const iframeEndpoint = endpoint.toString();
const iframeTitle = "Documents AI Assistant";

/* 
attr:
referrerpolicy	
__
description:
Specifies which referrer information to send when fetching the iframe
__
values:
no-referrer
no-referrer-when-downgrade
origin
origin-when-cross-origin
same-origin
strict-origin-when-cross-origin
unsafe-url	
*/

const loading = ref<boolean>(true);
const iframeRef = ref<HTMLIFrameElement | null>(null);

const onIframeLoad = (): void => {
  loading.value = false;
};

onMounted((): void => {
  if (iframeRef.value) {
    iframeRef.value.addEventListener("load", onIframeLoad);
  }
});

onUnmounted((): void => {
  if (iframeRef.value) {
    iframeRef.value.removeEventListener("load", onIframeLoad);
  }
});
</script>

<template>
  <v-card
    class="rounded-xl elevation-2 bg-surface-2 h-auto d-flex flex-column justify-center align-center"
  >
    <v-progress-circular v-if="loading" color="secondary" indeterminate></v-progress-circular>
    <iframe
      v-show="!loading"
      ref="iframeRef"
      :src="iframeEndpoint"
      :title="iframeTitle"
      width="100%"
      class="iframe-assistant-height"
      frameborder="0"
      @load="onIframeLoad"
    ></iframe>
  </v-card>
</template>

<style scoped lang="scss">
$bar-height: 64px;
$breadcrumb-height: 84px;
$paddings: 48px;
$footer-height: 32px;

.iframe-assistant-height {
  height: calc(100vh - ($bar-height + 2 * $breadcrumb-height + 2 * $paddings + $footer-height));
}
</style>
