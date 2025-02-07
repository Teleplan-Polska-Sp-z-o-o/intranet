<script setup lang="ts">
import { nextTick, ref, unref, watch } from "vue";
import { findOrCreateCustomTemplate, imageTemplateOptions, ITemplate } from "./ImageTemplates";
import { components } from "../../../../../../../../../../plugins/vuetify/components";
import {
  EStatus,
  useStepperStore,
} from "../../../../../../../../../../stores/documents/creator/useStepperStore";

const THIS_STEP = 2;
const store = useStepperStore();
const formBefore = ref<components.VForm | null>(null);

const templates = imageTemplateOptions; // Import your predefined templates
const selectedLogosTemplate = ref<ITemplate | null>(null);
// const logoPreviews = ref<{ name: string; preview: string }[]>([]);
// const mapPreviews = (template: ITemplate) => {
//   const previews = template.images.map((image, index) => ({
//     name: `'${template.name}' template - image ${index + 1}`,
//     preview: image,
//   }));

//   return previews;
// };

const convertBase64ToFiles = async (base64Images: string[]): Promise<File[]> => {
  const files: File[] = [];

  for (let i = 0; i < base64Images.length; i++) {
    const base64 = base64Images[i];
    const file = await fetch(base64)
      .then((res) => res.blob())
      .then((blob) => new File([blob], `image_${i + 1}.png`, { type: "image/png" }));

    files.push(file);
  }

  return files;
};

const uploadedFiles = ref<{ filesTypeBase64: string[]; filesTypeFile: File[] }>({
  filesTypeBase64: [],
  filesTypeFile: [],
});

watch(
  [() => store.stepper, () => store.status],
  ([stepper, status], [_oldStepper, oldStatus]) => {
    if (stepper === null || status === null) return;

    const window = stepper.getWindow(THIS_STEP);
    const step = stepper.currentStep;

    if (status.tick !== oldStatus?.tick)
      nextTick(async () => {
        if (status.enum !== EStatus.EDIT) {
          const form = unref(formBefore);
          if (!form) return;

          form.reset();
        }

        // const stepperImages = window.model.logosTemplate;
        // const template = findOrCreateCustomTemplate(stepperImages);
        // selectedLogosTemplate.value = template;

        const stepperImages = window.model.logosTemplate;
        const template = findOrCreateCustomTemplate(stepperImages);
        selectedLogosTemplate.value = template;
        uploadedFiles.value.filesTypeBase64 = template.images;
        uploadedFiles.value.filesTypeFile = await convertBase64ToFiles(template.images);
      });

    if (step !== THIS_STEP)
      nextTick(async () => {
        const form = unref(formBefore);
        if (!form) return;

        // console.log("form and step are both valid");
        const isEditState = status.enum === EStatus.EDIT;
        if (isEditState) {
          // console.log("validate form");
          await stepper.validateForm(form);
        }

        if (!window.form) {
          // console.log("assign of form");
          window.form = form;
        }
      });
  },
  { deep: true, immediate: true }
);

watch(
  () => selectedLogosTemplate.value,
  (template) => {
    if (!template) return;

    (async () => {
      uploadedFiles.value = {
        filesTypeBase64: template.images,
        filesTypeFile: await convertBase64ToFiles(template.images),
      };
    })();

    store.stepper!.getWindow(THIS_STEP).model.logosTemplate = uploadedFiles.value.filesTypeBase64;

    // logoPreviews.value = mapPreviews(newTemplate);

    // store.stepper!.getWindow(THIS_STEP).model.logosTemplate = logoPreviews.value.map(
    //   (p) => p.preview
    // );
  },
  { deep: true, immediate: true }
);

// Handle file uploads
const onFileUpload = async (newFiles: File[]) => {
  // Convert existing `selectedLogosTemplate.images` to files
  const existingFiles = await convertBase64ToFiles(selectedLogosTemplate.value?.images || []);

  // Merge old and new files

  uploadedFiles.value.filesTypeFile = [...newFiles, ...existingFiles];
  uploadedFiles.value.filesTypeBase64 = await Promise.all(
    uploadedFiles.value.filesTypeFile.map(fileToBase64)
  );

  // Update store model
  store.stepper!.getWindow(THIS_STEP).model.logosTemplate = uploadedFiles.value.filesTypeBase64;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

// const onFileChange = (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   const files = input?.files;

//   if (!files || files.length === 0) return;

//   logoPreviews.value = mapPreviews(selectedLogosTemplate.value!);

//   Array.from(files).forEach((file) => {
//     if (!file.type.startsWith("image/")) {
//       console.error(`File ${file.name} is not an image.`);
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       if (typeof reader.result === "string") {
//         logoPreviews.value.unshift({ name: file.name, preview: reader.result }); // Add at the beginning
//         logoPreviews.value.at(-1)!.name = `'Custom' template - image ${logoPreviews.value.length}`;
//         store.stepper!.getWindow(THIS_STEP).model.logosTemplate = logoPreviews.value.map(
//           (p) => p.preview
//         );
//       }
//     };

//     reader.readAsDataURL(file);
//   });
// };

const rules = {
  title: [
    (v: string | null) =>
      typeof v === "string" ? !!v.trim() || "Title is required" : "Title is required",
  ],
  documentTemplate: [
    (v: string | null) =>
      typeof v === "string"
        ? !!v.trim() || "Document Template is required"
        : "Document Template is required",
  ],
  // logosTemplate: [(v: ITemplate) => !!v || "Logos Template is required"],
};
</script>

<template>
  <v-form ref="formBefore" class="bg-surface-2">
    <v-text-field
      v-model="store.stepper!.getWindow(THIS_STEP).model.title"
      :rules="rules.title"
      label="Document Title"
      hint="The title should be clear and concise."
      variant="solo-filled"
      prepend-icon="mdi-text-short"
    ></v-text-field>

    <v-select
      v-model="store.stepper!.getWindow(THIS_STEP).model.documentTemplate"
      :rules="rules.documentTemplate"
      :items="['BYD-QA-TMP-0001_01']"
      label="Document Template"
      prepend-icon="mdi-format-list-text"
      hint="Choose a template for Front Page Logos or select 'Custom' to upload your own images."
      variant="solo-filled"
      persistent-hint
    ></v-select>

    <!-- :rules="rules.logosTemplate" -->
    <v-select
      v-model="selectedLogosTemplate"
      :items="templates"
      item-title="name"
      return-object
      label="Logos Template"
      prepend-icon="mdi-image-multiple"
      hint="Choose a template for Front Page Logos or select 'Custom' to upload your own image."
      variant="solo-filled"
      persistent-hint
    ></v-select>

    <!-- multiple -->
    <!-- <v-file-input
      v-if="selectedLogosTemplate?.name === 'Custom'"
      label="Upload image"
      prepend-icon="mdi-camera"
      accept="image/*"
      variant="solo-filled"
      show-size
      @change="onFileChange"
    ></v-file-input> -->

    <!-- @change="onFileChange" -->
    <div class="ml-10">
      <v-file-upload
        v-if="selectedLogosTemplate?.name === 'Custom'"
        :model-value="uploadedFiles.filesTypeFile"
        @update:model-value="onFileUpload"
        :multiple="false"
        scrim="primary"
        density="compact"
        variant="compact"
        title="Drop your file here or click to upload"
      ></v-file-upload>
    </div>

    <!-- Expansion Panel for Previews -->
    <!-- <v-expansion-panels v-if="logoPreviews.length" class="mb-4 pl-10 pb-1">
      <template v-for="(file, _index) in logoPreviews" :key="index">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters align="center">
                <v-col class="text-grey text-left" cols="6">
                  <span v-if="expanded" key="0"> {{ file.name }} Preview </span>
                  <span v-else key="1"> Click to view {{ file.name }} </span>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex justify-center align-center">
              <img :src="file.preview" :alt="`Preview of ${file.name}`" style="max-width: 100%" />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
    </v-expansion-panels> -->

    <v-text-field
      v-model="store.stepper!.getWindow(THIS_STEP).model.id"
      label="Document Id"
      variant="solo-filled"
      prepend-icon="mdi-text-short"
    ></v-text-field>

    <v-number-input
      v-model="store.stepper!.getWindow(THIS_STEP).model.revision"
      :reverse="false"
      controlVariant="default"
      label="Document Revision"
      :hideInput="false"
      inset
      :min="1"
      :prefix="store.stepper!.getWindow(THIS_STEP).model.revision < 10 ? 'R0' : 'R'"
      variant="solo-filled"
      prepend-icon="mdi-text-short"
    ></v-number-input>
  </v-form>
</template>
