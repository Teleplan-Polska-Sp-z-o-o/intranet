<script setup lang="ts">
import { ref } from "vue";
import { watchEffect } from "vue";
import { IProcessChangeRequestBase } from "../../../../../interfaces/change/IProcessChangeRequestBase";

const props = defineProps<{
  eRequest: IProcessChangeRequestBase;
}>();

const request = ref<IProcessChangeRequestBase>(props.eRequest);

watchEffect(() => {
  request.value = props.eRequest;
});

const formatDate = (date: Date | string | undefined): string => {
  if (date) {
    let dateObj: Date;

    if (typeof date === "string") dateObj = new Date(date);
    else dateObj = date;

    const day: string = (dateObj?.getDate() || 1).toString().padStart(2, "0");
    const month: string = (dateObj?.getMonth() + 1 || 1).toString().padStart(2, "0"); // Note: Month is zero-based, so we add 1
    const year: string = (dateObj?.getFullYear() || 1).toString().padStart(2, "0");

    const formattedDate: string = `${day}/${month}/${year}`;
    return formattedDate;
  } else return "Empty date";
};

const camelCaseToTitleCase = (str: string) => {
  let titleCase = str.replace(/([A-Z])/g, " $1");
  titleCase = titleCase.charAt(0).toUpperCase() + titleCase.slice(1);
  return titleCase;
};

const disallowedKeys = ["id", "year", "requestedBy", "updatable"];

const testReasonAndDescription = (value: Date | string, key: string) => {
  if ((typeof value === "string" && key === "changeReason") || key === "changeDescription") {
    const changeReasonDefault = '<p><span style="color:hsl(0, 0%, 60%);">Change Reason</span></p>';
    const changeDescriptionDefault =
      '<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>';

    if (value === changeReasonDefault || value === changeDescriptionDefault) return false;
  }

  return true;
};
</script>

<template>
  <v-sheet border class="rounded-xl mb-4">
    <template v-for="(value, key, index) in request" :key="key">
      <v-card
        v-if="value && testReasonAndDescription(value, key as string) && !disallowedKeys.includes(key as string)"
        color="transparent"
        elevation="0"
        outlined="false"
        class="pa-2"
      >
        <v-card-subtitle>{{ camelCaseToTitleCase(key as string) }}</v-card-subtitle>
        <v-card-text
          v-html="value instanceof Date ? formatDate(value) : value.toString()"
        ></v-card-text>
      </v-card>
      <v-divider
        class="mx-4"
        v-if="value && !disallowedKeys.includes(key as string) && index !== Object.keys(request).length - 1"
      ></v-divider>
    </template>
  </v-sheet>
</template>
