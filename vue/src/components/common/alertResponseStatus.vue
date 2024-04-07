<script setup lang="ts">
import { ComputedRef, computed, ref, watch } from "vue";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  status: IResponseStatus | null;
  persist?: boolean | null;
}>();

const { t } = useI18n();

const status = ref<IResponseStatus | null>(props.status || null);
const timeoutId = ref<NodeJS.Timeout | null>(null);

watch(
  () => props.status,
  (newValue) => {
    status.value = newValue || null;

    // Clear previous timeout
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
    }

    if (newValue && !props.persist) {
      timeoutId.value = setTimeout(() => {
        status.value = null;
      }, 4000);
    }
  }
);

const statusType: ComputedRef<"success" | "error"> = computed((): "success" | "error" => {
  const code: number = status.value!.code;
  const isSuccess: boolean = code >= 200 && code < 300;
  return isSuccess ? "success" : "error";
});

const statusMessage: ComputedRef<string> = computed((): string =>
  t(`common.status_message.${status.value!.message}`)
);
</script>

<template>
  <v-alert v-if="status" :type="statusType" :text="statusMessage"></v-alert>
</template>
