<script setup lang="ts">
import { computed } from "vue";
import { TAssistantResponseMessages } from "../../../../../interfaces/assistants/AssistantResponse";
import { outputMessage, outputSource } from "./outputFunctions";

const props = defineProps<{
  messages: TAssistantResponseMessages;
  preparingResponse: boolean;
}>();

const messages = computed<TAssistantResponseMessages>(() => props.messages);
</script>

<template>
  <div
    v-for="(message, index) in messages"
    :key="index"
    :class="outputSource(message, 'flex')"
    class="my-2"
  >
    <div class="w-75" :class="outputSource(message, 'flex')">
      <div
        :class="outputSource(message, 'background')"
        class="text-body-1 rounded-xl pa-4"
        v-html="outputMessage(message)"
      ></div>
    </div>
  </div>
  <div>
    <v-skeleton-loader
      v-if="props.preparingResponse"
      color="secondary-container"
      type="list-item-three-line"
      class="w-75 rounded-xl"
    ></v-skeleton-loader>
  </div>
</template>

<style scoped>
.user-message {
  display: flex;
  justify-content: end;
  text-align: right;
}
.assistant-message {
  display: flex;
  justify-content: start;
  text-align: left;
}
.hr {
  height: 0.6px;
  background-color: #111;
  border: none;
}
</style>
