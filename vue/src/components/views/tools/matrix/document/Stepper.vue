<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import VerifyTables from "./VerifyTables.vue";
import FilesForm from "../../common/FilesForm.vue";
import { IFileItem, ICompetence } from "../../../../../interfaces/document/DocumentTypes";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { nodeConfig } from "../../../../../config/env";
import { FileItem } from "../../../../../models/document/FileItem";
import { CompetenceManager } from "../../../../../models/document/CompetenceManager";
import jwtAxios from "../../../../../config/axios/jwtAxios";

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

const competences = ref<Array<ICompetence>>([]);

(async () => {
  const competenceManager: CompetenceManager = new CompetenceManager();
  const options: Array<ICompetence> = await competenceManager.get();
  competences.value = options;
})();

(async () => {
  const docType = document.value.type;
  const docConfidentiality = document.value.confidentiality;
  const docName = document.value.name;
  const docRef = document.value.ref;
  const docLangs = document.value.languages;

  if (docType && docConfidentiality && docName && docRef && docLangs) {
    for (const [index, lang] of Object.entries(docLangs)) {
      const fileName = `${docName}_qs_langs=${lang}&uuid=${docRef}`;
      const fileUrl = `${nodeConfig.origin}:${nodeConfig.port}/uploads/documents/${fileName}.pdf`;

      try {
        const response = await jwtAxios.get(fileUrl, { responseType: "arraybuffer" });
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

watch(files, (newV) => {
  files.value = newV;
});

const newDocData = computed(() => {
  return {
    ref: document.value.ref,
    type: document.value.type,
    name: document.value.name,
    description: document.value.description,
    revision: document.value.revision,
    confidentiality: document.value.confidentiality,
    competences: document.value.competences,

    files: files.value,
  };
});

watchEffect(() => {
  if (
    !!document.value.type &&
    !!document.value.confidentiality &&
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
        :title="$t(`tools.matrix.tabs.documents.stepper.vStepperItem['1']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 2 && hasFiles"
        :value="2"
        subtitle="One or multiple"
        :title="$t(`tools.matrix.tabs.documents.stepper.vStepperItem['2']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 3"
        :value="3"
        :title="$t(`tools.matrix.tabs.documents.stepper.vStepperItem['3']`)"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-select
            v-model="document.type"
            :label="$t(`tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].type.label`)"
            :items="['Instruction', 'Visual', 'MSD']"
            variant="underlined"
          ></v-select>
          <v-select
            v-model="document.confidentiality"
            :label="
              $t(
                `tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].confidentiality.label`
              )
            "
            :items="['public', 'restricted', 'secret']"
            variant="underlined"
          ></v-select>
          <v-text-field
            v-model="document.name"
            variant="underlined"
            :label="$t(`tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].name.label`)"
          ></v-text-field>
          <v-text-field
            v-model="document.description"
            variant="underlined"
            :label="
              $t(`tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].description.label`)
            "
          ></v-text-field>

          <v-number-input
            v-model="document.revision"
            :reverse="false"
            controlVariant="default"
            :label="
              $t(`tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].revision.label`)
            "
            :hideInput="false"
            inset
            :min="1"
            :prefix="document.revision < 10 ? '0' : ''"
          ></v-number-input>

          <v-autocomplete
            variant="underlined"
            :label="
              $t(`tools.matrix.tabs.documents.stepper.vStepperWindowItem['1'].competences.label`)
            "
            :items="competences"
            item-title="name"
            item-value="id"
            clearable
            chips
            multiple
            :modelValue="document.competences.length > 0 ? document.competences : null"
            @update:modelValue="(value: Array<string>) => (document.competences = value)"
          ></v-autocomplete>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <files-form
            @files="handleFiles"
            :retrieved="retrievedFiles"
            :accept="['.pdf']"
          ></files-form>
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
        >
          {{ $t(`tools.matrix.tabs.documents.stepper.actions.prev`) }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
        >
          {{ $t(`tools.matrix.tabs.documents.stepper.actions.next`) }}
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>
