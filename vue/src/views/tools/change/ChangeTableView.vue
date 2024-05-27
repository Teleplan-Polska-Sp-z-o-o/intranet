<script setup lang="ts">
import { DefineComponent } from "vue";
import { ResponseStatus } from "../../../models/common/ResponseStatus";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  is: DefineComponent<{ tab: string; no: string }, any, any> | undefined;
  tab: string;
}>();
// no: string | undefined;

// const no = ref<string | undefined>(props.no);

const handleResponseStatus = (status: ResponseStatus) => emit("responseStatus", status);
</script>

<template>
  <component :is="props.is" :tab="props.tab" @responseStatus="handleResponseStatus"></component>
  <!-- :no="no" -->
</template>
