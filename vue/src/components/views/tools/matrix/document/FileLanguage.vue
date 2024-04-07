<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";

const emit = defineEmits(["file-change"]);

const props = defineProps<{
  file: IFileItem;
}>();

const transFile = {
  ...props.file,
  langs: props.file?.langs?.flatMap((lang) => lang.split("_")) as Array<string>,
};

const fileData = ref<IFileItem>(transFile);

const languages = [
  { name: "en", value: "en" },
  { name: "pl", value: "pl" },
  { name: "ua", value: "ua" },
];

const selectedLanguagesCount = computed(() =>
  fileData.value.langs?.length ? fileData.value.langs?.length - 1 : ""
);

const languageOrder = ["en", "pl", "ua"];

watchEffect(() => {
  fileData.value.langs = fileData.value.langs?.sort((a, b) => {
    return languageOrder.indexOf(a) - languageOrder.indexOf(b);
  });

  if (fileData.value) emit("file-change", fileData.value);
});
</script>

<template>
  <div class="d-flex">
    <div class="w-50">
      <v-file-input
        v-model="fileData.file"
        label="Document"
        accept=".pdf"
        variant="underlined"
        class="flex-4 text-no-wrap overflow-hidden mr-4"
      >
      </v-file-input>
    </div>

    <div class="d-flex w-50">
      <v-select
        :items="languages"
        label="Languages"
        v-model="fileData.langs"
        multiple
        variant="underlined"
        item-title="name"
        item-value="value"
      >
        <template v-slot:selection="{ item, index }" class="d-flex align-center text-no-wrap">
          <span v-if="index === 0">{{ item.title }}</span>
          <span class="grey--text caption" v-else-if="index === 1">
            &nbsp;(+{{ selectedLanguagesCount }})
          </span>
        </template>
      </v-select>
    </div>
  </div>
</template>

<style scoped>
.file-label {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
../../../../../interfaces/document/IFileItem
