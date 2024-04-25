<script setup lang="ts">
import { ref, DefineComponent } from "vue";

const props = defineProps<{
  is: DefineComponent<{ tab: string; no: string }, any, any> | undefined;
  tab: string;
  no: string | undefined;
}>();

const no = ref<string | undefined>(props.no);
</script>

<template>
  <component :is="props.is" :tab="props.tab" :no="no"></component>
</template>
