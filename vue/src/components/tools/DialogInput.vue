<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits(["save-data"]);

const props = defineProps<{
  componentProps: any;
}>();

const item = ref<any>(props.componentProps.editedItem);
const label = props.componentProps.label;
const property = props.componentProps.property;
const items = props.componentProps.items;

const model = ref<string>(items ? "" : property ? item.value[property] : item.value);
watch(model, (newValue) => {
  model.value = newValue;
  if (model.value) {
    emit("save-data", {
      model: model.value,
      item: item.value,
    });
  }
});
</script>

<template>
  <v-select v-if="items" v-model="model" :label="label" :items="items"></v-select>
  <v-text-field v-else v-model="model" variant="underlined" :label="label"></v-text-field>
</template>
