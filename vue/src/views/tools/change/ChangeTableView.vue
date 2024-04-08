<script setup lang="ts">
import { DefineComponent } from "vue";

const props = defineProps<{
  is: DefineComponent<{ tab: string }, any, any> | undefined;
  tab: string;
}>();
</script>

<template>
  <component :is="props.is" :tab="props.tab"></component>
</template>
