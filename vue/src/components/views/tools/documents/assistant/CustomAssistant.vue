<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { AiAssistant } from "../../../../../models/assistants/AiAssistant";
import { useAssistantStore } from "../../../../../stores/assistantStore";
import { TAssistantResponseMessages } from "../../../../../interfaces/assistants/TAssistantResponse";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { AssistantTranslations } from "../../../../../interfaces/common/Translations";
import NoStreamConversation from "./NoStreamConversation.vue";

const props = defineProps<{
  tab: string;
  assistantKey: string;
}>();

const loading = ref<boolean>(true);
const preparingResponse = ref<boolean>(false);
const assistant = ref<AiAssistant>(new AiAssistant(props.assistantKey));

const messages = ref<TAssistantResponseMessages>([{}]);
// const message = ref<TAssistantResponseMessage>([]);

const create = async (newConversation: boolean = false): Promise<void> => {
  try {
    if (!loading.value) loading.value = true;
    assistant.value = await assistant.value.createConversation(newConversation);
    nextTick();
    if (assistant.value) loading.value = false;
  } catch (error) {
    console.error(`create at CustomAssistant, ${error}`);
  }
};

onMounted(async () => {
  await create();
});

const userInput = ref<string>("");
const disableSend = ref<boolean>(true);
watch(userInput, (newV) => {
  if (newV) disableSend.value = false;
  else disableSend.value = true;
});

const sendQuestion = async () => {
  try {
    preparingResponse.value = true;
    const input = userInput.value.trim();
    if (input === "") return;
    userInput.value = "";
    await assistant.value.question(input);
    preparingResponse.value = false;
  } catch (error) {
    console.error(`sendQuestion at CustomAssistant, ${error}`);
  }
};

watch(
  () => useAssistantStore().storedConversations[props.assistantKey],
  (storedMessages) => {
    messages.value = storedMessages;
  },
  { deep: true, immediate: true }
);

const specificRoutePath = "/tool/documents/browse/assistant";
watch(
  () => useRoute(),
  async (newRoute) => {
    if (newRoute && newRoute?.path === specificRoutePath) {
      if (!messages.value.length)
        messages.value = useAssistantStore().storedConversations[props.assistantKey];
    }
  },
  { deep: true }
);

const { t } = useI18n();
const tPath = `tools.documents.tabs.${props.tab}`;
const translation = computed<AssistantTranslations>(() => {
  return {
    title: t(`${tPath}.title`),
    send: t(`${tPath}.send`),
    placeholder: t(`${tPath}.placeholder`),
    new: t(`${tPath}.new`),
  };
});
</script>

<template>
  <v-card
    class="rounded-xl elevation-2 bg-surface-2 h-auto d-flex flex-column justify-center align-center"
  >
    <v-progress-circular v-if="loading" color="secondary" indeterminate></v-progress-circular>
    <v-card
      v-else
      class="height-assistant w-100 rounded-xl elevation-0 bg-surface-2 d-flex flex-column justify-center align-center"
    >
      <v-card-title>
        <span class="text-h5 card-title-gradient">{{ translation.title }}</span>
        <v-btn variant="plain" color="primary" :height="27" @click="() => create(true)">{{
          translation.new
        }}</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="height-assistant-conversation w-100 px-0 d-flex flex-column flex-grow-1 border-md border-primary rounded-xl"
      >
        <div class="div-list rounded-xl bg-transparent w-75 h-100 px-4 mx-auto">
          <no-stream-conversation
            :messages="messages"
            :assistantKey="props.assistantKey"
            :preparingResponse="preparingResponse"
          ></no-stream-conversation>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-flex align-start justify-space-around ga-16 w-100 pl-0">
        <v-textarea
          v-model="userInput"
          color="primary"
          :placeholder="translation.placeholder"
          rows="2"
          density="compact"
          variant="outlined"
          rounded
          no-resize
          persistent-clear
          clearable
          persistent-counter
          counter
          :rules="[(v) => v.length <= 300 || 'Max 300 characters']"
          @keyup.enter="sendQuestion"
        ></v-textarea>
        <v-btn
          :disabled="disableSend"
          variant="flat"
          class="glow capitalize"
          :height="50"
          width="auto"
          :min-width="50"
          color="primary"
          @click="sendQuestion"
        >
          {{ translation.send }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">
$bar-height: 64px;
$breadcrumb-height: 84px;
$paddings: 48px;
$footer-height: 32px;
$menu: 120px;

$assistant-height: calc(
  100vh - ($bar-height + 2 * $breadcrumb-height + 2 * $paddings + $footer-height)
);

.height-assistant {
  height: $assistant-height !important;
}

$title: 48px;
$card-text-padding: 2 * 16px;
$actions: 102px;

.height-assistant-conversation {
  height: calc($assistant-height - ($title + $card-text-padding + $actions));
  .div-list {
    overflow-y: scroll;
  }
}

@media (max-width: 960px) {
  .height-assistant {
    height: calc(
      100vh - ($bar-height + 2 * $breadcrumb-height + 2 * $paddings + $footer-height + $menu)
    ) !important;
  }
}

.card-title-gradient {
  background: linear-gradient(to right, #345ca8, #006e23);
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

.v-btn {
  &.capitalize {
    text-transform: capitalize !important;
  }
  &.lowercase {
    text-transform: lowercase !important;
  }
}

.glow {
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  margin: 7px;
}

.glow:before {
  content: "";
  background: linear-gradient(45deg, #d9e2ff, #345ca8, #8ffa94, #006e23);
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing 20s linear infinite;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
