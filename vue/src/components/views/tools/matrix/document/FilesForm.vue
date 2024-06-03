<script setup lang="ts">
import { computed, ref, watch } from "vue";
import FileLanguage from "./FileLanguage.vue";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";
import { FileItem } from "../../../../../models/document/FileItem";

const emit = defineEmits(["files"]);

const props = defineProps<{
  retrieved: Array<IFileItem>;
}>();

const files = ref<Array<IFileItem>>([]);
const hasFiles = computed(() => files.value.length > 0);

let currId = props.retrieved.length > 0 ? props.retrieved.length - 1 : 0;
const addFile = () => {
  files.value.push(new FileItem(++currId));
};

addFile();

const handleFileChange = (fileData: IFileItem) => {
  const existingIndex = files.value.findIndex((item) => item.id === fileData.id);

  if (existingIndex !== -1) {
    files.value.splice(existingIndex, 1, fileData);
  } else {
    files.value.push(fileData);
  }
};

const removeFile = (id: number) =>
  (files.value = files.value.filter((fileItem) => fileItem.id !== id));

const filterFiles = () => {
  return files.value.filter(
    (fileItem) =>
      fileItem.file !== undefined &&
      fileItem.file.length > 0 &&
      fileItem.langs !== undefined &&
      fileItem.langs.length > 0
  );
};

watch(
  files,
  () => {
    emit("files", filterFiles());
  },
  { deep: true }
);

if (props.retrieved.length > 0) {
  files.value = props.retrieved;
}
</script>

<template>
  <div class="d-flex flex-column align-center justify-center w-100">
    <v-btn
      v-if="!hasFiles"
      @click="addFile"
      variant="tonal"
      color="primary"
      class="rounded-lg pa-4"
      :height="56"
    >
      <v-icon icon="mdi-plus" :size="24" /> File
    </v-btn>
    <div v-for="file in files" :key="file.id" class="d-flex align-center w-100">
      <FileLanguage @file-change="handleFileChange" :file="file" class="flex-grow-1" />
      <v-btn
        @click="() => removeFile(file.id)"
        class="ml-4"
        color="primary"
        variant="tonal"
        density="compact"
        icon="mdi-minus"
      ></v-btn>
    </div>

    <v-btn
      v-if="hasFiles"
      @click="addFile"
      class="rounded-xl"
      color="primary"
      variant="tonal"
      prepend-icon="mdi-plus"
      >File</v-btn
    >
  </div>
</template>
