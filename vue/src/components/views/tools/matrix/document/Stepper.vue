<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import VerifyTables from "./VerifyTables.vue";
import FilesForm from "./FilesForm.vue";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { nodeConfig } from "../../../../../config/env";
import axios from "axios";
import { FileItem } from "../../../../../models/document/FileItem";

const emit = defineEmits(["save-data", "verified"]);

const props = defineProps<{
  componentProps: any;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);

const activeStep = ref<number>(1);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 3);

const document = ref<IDocumentEntity>(props.componentProps.editedItem);

watchEffect(() => {
  document.value = props.componentProps.editedItem;
});

const files = ref<Array<IFileItem>>([]);

const retrievedFiles = ref<Array<IFileItem>>([]);

(async () => {
  const docType = document.value.type;
  const docName = document.value.name;
  const docRef = document.value.ref;
  const docLangs = document.value.languages;

  if (docType && docName && docRef && docLangs) {
    for (const [index, lang] of Object.entries(docLangs)) {
      const fileName = `${docName}_qs_langs=${lang}&uuid=${docRef}`;
      const fileUrl = `${nodeConfig.origin}:${nodeConfig.port}/uploads/documents/${fileName}.pdf`;

      try {
        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const fileContent = response.data;

        const blob = new Blob([fileContent]);

        const file = new File([blob], fileName, { type: response.headers["content-type"] });

        const fileItem: FileItem = new FileItem(parseInt(index, 10), [file], [lang]);

        retrievedFiles.value.push(fileItem);
      } catch (error) {
        console.error(`Error fetching file for language ${lang}:`, error);
      }
    }
  }
})();

const hasFiles = computed<boolean>(() => files.value.length > 0);
const handleFiles = (filesData: Array<IFileItem>) => {
  files.value = filesData;
};

const newDocData = computed(() => {
  return {
    ref: document.value.ref,
    type: document.value.type,
    name: document.value.name,
    description: document.value.description,
    revision: document.value.revision,

    files: files.value,
  };
});

watchEffect(() => {
  if (
    !!document.value.type &&
    !!document.value.name &&
    !!document.value.description &&
    !!document.value.revision &&
    hasFiles.value &&
    activeStep.value === 3
  ) {
    emit("verified", false);
    emit("save-data", newDocData.value);
  } else {
    emit("verified", true);
  }
});
</script>

<template>
  <v-stepper :mobile="smallScreen ? true : false" v-model="activeStep" class="rounded-xl">
    <v-stepper-header class="rounded-xl">
      <v-stepper-item
        color="secondary"
        :complete="
          activeStep > 1 && !!document.name && !!document.description && !!document.revision
        "
        :value="1"
        title="Base Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 2 && hasFiles"
        :value="2"
        subtitle="One or multiple"
        title="Input Files"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 3"
        :value="3"
        title="Verify"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-select
            v-model="document.type"
            label="Type"
            :items="['Instruction', 'Visual']"
            variant="underlined"
          ></v-select>
          <v-text-field v-model="document.name" variant="underlined" label="Name"></v-text-field>
          <v-text-field
            v-model="document.description"
            variant="underlined"
            label="Description"
          ></v-text-field>
          <v-text-field
            v-model="document.revision"
            variant="underlined"
            label="Revision"
          ></v-text-field>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <files-form @files="handleFiles" :retrieved="retrievedFiles"></files-form>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat>
          <verify-tables :eDoc="document" :pFiles="files"></verify-tables>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="prevStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!prevable"
          >Previous</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >Next</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>
