<script setup lang="ts">
import { computed, ref, watch } from "vue";
import FileLanguage from "./FileLanguage.vue";
import { FileItem } from "../../../../models/document/FileItem";
import { IFileItem } from "../../../../interfaces/document/DocumentTypes";
import { CommonTypes } from "../../../../interfaces/common/CommonTypes";

const emit = defineEmits(["files"]);

const props = defineProps<{
  retrieved: Array<IFileItem>;
  accept: CommonTypes.FileTypes.AcceptedType[];
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

const filterFiles = (files: Array<IFileItem>) => {
  const filtered = files.filter(
    (fileItem) =>
      fileItem.file !== undefined &&
      fileItem.file.length > 0 &&
      fileItem.langs !== undefined &&
      fileItem.langs.length > 0
  );
  return filtered;
};

watch(
  files,
  (newFiles) => {
    emit("files", filterFiles(newFiles));
  },
  { deep: true }
);

if (props.retrieved.length > 0) {
  files.value = props.retrieved;
}
</script>

<template>
  <div class="d-flex flex-column align-center justify-center w-100">
    <v-alert
      class="mb-4 prevent-select"
      :title="$t(`common.component.file_form.info_title`)"
      :text="$t(`common.component.file_form.info_text`, { accepts: props.accept.join(', ') })"
      type="info"
    ></v-alert>
    <v-btn
      v-if="!hasFiles"
      @click="addFile"
      variant="tonal"
      color="primary"
      class="rounded-lg pa-4"
      :height="56"
    >
      <v-icon icon="mdi-plus" :size="24" />
    </v-btn>
    <div v-for="file in files" :key="file.id" class="d-flex align-center w-100">
      <FileLanguage
        @file-change="handleFileChange"
        :file="file"
        :accept="props.accept"
        class="flex-grow-1"
      />
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
      >{{ $t(`common.component.file_form.add_file`) }}</v-btn
    >
  </div>
</template>
