<script setup lang="ts">
import { onMounted, ref } from "vue";
import { DocumentAssistant } from "../../../../../models/assistants/DocumentAssistant";
import { useUserStore } from "../../../../../stores/userStore";

const isEmptyState = useUserStore().isEmptyState("maciej.zablocki");

const loading = ref<boolean>(true);
const assistant = ref<DocumentAssistant>(new DocumentAssistant());

onMounted(async () => {
  await assistant.value.createConversation();
  loading.value = false;
  console.log(assistant.value);
});
</script>

<template>
  <v-card
    class="rounded-xl elevation-2 bg-surface-2 h-auto d-flex flex-column justify-center align-center"
  >
    <v-progress-circular v-if="loading" color="secondary" indeterminate></v-progress-circular>
    <!-- <custom-assistant show="!loading"></custom-assistant> -->
    <v-empty-state
      :show="!loading && isEmptyState"
      headline="Whoops, 403"
      title="Forbidden"
      text="The page you are looking for is currently being built."
    ></v-empty-state>
  </v-card>
</template>

<style scoped lang="scss">
$bar-height: 64px;
$breadcrumb-height: 84px;
$paddings: 48px;
$footer-height: 32px;

.custom-assistant-height {
  height: calc(100vh - ($bar-height + 2 * $breadcrumb-height + 2 * $paddings + $footer-height));
}
</style>
