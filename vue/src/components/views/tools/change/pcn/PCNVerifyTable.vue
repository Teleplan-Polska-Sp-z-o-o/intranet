<script setup lang="ts">
import { ref } from "vue";
import { watchEffect } from "vue";
import { IProcessChangeNoticeFields } from "../../../../../interfaces/change/IProcessChangeNoticeFields";

const props = defineProps<{
  eNotice: IProcessChangeNoticeFields;
}>();

const notice = ref<IProcessChangeNoticeFields>(props.eNotice);

watchEffect(() => {
  notice.value = props.eNotice;
});

const camelCaseToTitleCase = (str: string) => {
  let titleCase = str.replace(/([A-Z])/g, " $1");
  titleCase = titleCase.charAt(0).toUpperCase() + titleCase.slice(1);
  return titleCase;
};

const disallowedKeys = ["id", "year", "requestedBy", "updatable"];

const testDescription = (value: boolean | string, key: string) => {
  if (typeof value === "string" && key === "changeDescription") {
    const changeDescriptionDefault =
      '<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>';

    if (value === changeDescriptionDefault) return false;
  }

  return true;
};
</script>

<template>
  <v-sheet border class="rounded-xl mb-4">
    <template v-for="(value, key, index) in notice" :key="key">
      <v-card
        v-if="value && testDescription(value, key as string) && !disallowedKeys.includes(key as string)"
        color="transparent"
        elevation="0"
        outlined="false"
        class="pa-2"
      >
        <v-card-subtitle>{{ camelCaseToTitleCase(key as string) }}</v-card-subtitle>
        <v-card-text v-html="value.toString()"></v-card-text>
      </v-card>
      <v-divider
        class="mx-4"
        v-if="value && !disallowedKeys.includes(key as string) && index !== Object.keys(notice).length - 1"
      ></v-divider>
    </template>
  </v-sheet>
</template>
