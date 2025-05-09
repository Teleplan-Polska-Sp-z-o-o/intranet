<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { Moment } from "moment";
import "moment-timezone";
import { useI18n } from "vue-i18n";

// Store
const stepperStore = useStepperStore();
const { t } = useI18n();

// Reactive State
const autoCache = ref<boolean>(stepperStore.flags.isAutoSaveStarted);
const elapsedSeconds = ref<number>(0);
const disableCancel = ref<boolean>(false);
const interval = ref<ReturnType<typeof setInterval> | null>(null);

// Computed
const lastCachedText = computed<string>(() => {
  const saved = stepperStore.flags.lastSavedAt as Moment | null;
  if (!saved) return t(`tools.tcd.createNew.cache.preLastCachedText`);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return saved.isValid()
    ? saved.tz(timeZone).format("YYYY-MM-DD HH:mm:ss")
    : t(`tools.tcd.createNew.cache.lastCachedTextError`);
});

const cancelTimerText = computed(() => {
  return t(`tools.tcd.createNew.cache.cancelTimerText`, {
    seconds: 30 - elapsedSeconds.value,
  });
});

// Static
const notAutoCacheText = computed(() => {
  return t(`tools.tcd.createNew.cache.notAutoCacheText`, {
    tableTitle: t(`tools.tcd.drafts.myUnsavedWork`),
  });
});
const cancelText = computed(() => {
  return t(`tools.tcd.createNew.cache.cancelText`);
});
const enableAutoCacheText = computed(() => {
  return t(`tools.tcd.createNew.cache.enableAutoCacheText`);
});

// Timer logic
const startTimer = () => {
  elapsedSeconds.value = 0;
  disableCancel.value = false;
  if (interval.value) clearInterval(interval.value);
  interval.value = setInterval(() => {
    elapsedSeconds.value++;
    if (elapsedSeconds.value >= 30) {
      disableCancel.value = true;
      clearInterval(interval.value!);
      interval.value = null;
    }
  }, 1000);
};
const stopTimer = () => {
  if (interval.value) clearInterval(interval.value);
  interval.value = null;
  disableCancel.value = false;
  elapsedSeconds.value = 0;
};

// Auto-cache toggle
const toggleAutoSave = (): void => {
  if (autoCache.value) {
    stepperStore.startAutoSave();
    startTimer();
  } else {
    stepperStore.stopAutoSave();
    stopTimer();
  }
};

watch(autoCache, () => toggleAutoSave());
onBeforeUnmount(() => {
  stopTimer();
});
</script>

<template>
  <v-list-item class="bg-surface-2" lines="two" variant="flat">
    <v-list-item-subtitle :opacity="autoCache ? 0.8 : undefined">
      <v-alert border="start" :border-color="autoCache ? 'success' : 'tertiary'" elevation="2">
        <template #prepend>
          <v-icon
            :icon="autoCache ? 'mdi-timer-play-outline' : 'mdi-timer-stop-outline'"
            class="ma-1"
          />
        </template>
        <template #text>
          <div class="d-flex justify-space-between align-center">
            <v-scroll-y-reverse-transition mode="out-in">
              <div :key="`cache-text-${autoCache}`">
                {{ autoCache ? lastCachedText : notAutoCacheText }}
              </div>
            </v-scroll-y-reverse-transition>
            <v-spacer></v-spacer>
            <v-fade-transition mode="out-in">
              <v-btn
                :key="`cache-${autoCache}`"
                :border="`thin ${autoCache ? 'error' : 'tertiary'}`"
                :color="autoCache ? 'error' : 'tertiary'"
                :prepend-icon="autoCache ? 'mdi-stop' : 'mdi-play'"
                :slim="autoCache"
                :variant="autoCache ? 'plain' : 'tonal'"
                class="me-2 text-none"
                @click="autoCache = !autoCache"
                :disabled="autoCache && disableCancel"
              >
                <template v-if="autoCache && (disableCancel || elapsedSeconds >= 30)">{{
                  cancelText
                }}</template>
                <template v-else-if="autoCache"> {{ cancelTimerText }}</template>
                <template v-else> {{ enableAutoCacheText }}</template>
              </v-btn>
            </v-fade-transition>
          </div>
        </template>
      </v-alert>
    </v-list-item-subtitle>
  </v-list-item>
</template>
