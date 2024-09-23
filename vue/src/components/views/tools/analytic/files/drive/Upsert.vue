<script setup lang="ts">
import { ref, computed, toRefs, onMounted, watch } from "vue";
import { XLSXHelper } from "../../../../../../models/common/files/excel/XLSXHelper";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticTypes } from "../Types";
import { useRoute } from "vue-router";

const store = useAnalyticStore();
const manager: AnalyticFileManager = new AnalyticFileManager();
const compProps = defineProps<{
  driveUuid: string;
  fileUuid?: string;

  /**
   * entity
   */
  entity?: AnalyticTypes.IAnalyticFileEntity;

  /**
   * retrieved file
   */
  file?: File | null;
}>();
const { driveUuid, fileUuid, entity, file } = toRefs(compProps);
const formData = ref<AnalyticTypes.IAnalyticFileFrontendFields>(entity.value ?? manager.new());

// Route params setup
const route = useRoute();
formData.value.progName = route.params.program as AnalyticTypes.AnalyticProg;
formData.value.catName = route.params.cat as AnalyticTypes.AnalyticCat;
formData.value.subName = route.params.sub as AnalyticTypes.AnalyticSub;

// File Type options
const fileTypeOptions = computed(() => {
  return AnalyticTypes.fileTypeObject[formData.value.progName][formData.value.catName][
    formData.value.subName
  ];
});

// File input and XLSX processing setup
const fileData = ref<File | undefined>(file.value ?? undefined);
const xlsxHelper = new XLSXHelper();

// Desired column format for validation
const requiredColumns: Record<string, string[]> = {
  models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO"],
  planning: [
    "LINE", // "linia",
    "DATE", // "data",
    "SHIFT", // "zmiana",
    "PACKING", // "pakowanie",
  ],
};

interface Validation {
  progress: boolean;
  status: "pass" | "error" | null;
  message: string | null;
}

const normalizedValidation = ref<Validation>({
  status: null,
  message: null,
  progress: false,
});

const validateNormalized = () => {
  const v = normalizedValidation.value;
  v.status = null;
  v.message = null;

  if (formData.value.normalizedFileName) {
    v.status = "pass";
    return true;
  } else {
    v.status = "error";
    v.message = "This field is required.";
    return false;
  }
};

const fileValidation = ref<Validation>({
  status: null,
  message: null,
  progress: false,
});
/**
 * Validates the uploaded Excel file by checking the first row's column headers.
 * If the headers don't match, sets an error message.
 */
const validateExcelFile = async () => {
  const v = fileValidation.value;
  v.status = null;
  v.message = null;
  v.progress = true;

  if (!fileData.value) {
    throw new Error("No file selected.");
  }

  try {
    if (formData.value.fileType !== "miscellaneous") {
      const loadedXlsxHelper = await xlsxHelper.loadWorkbook(fileData.value);
      const firstSheetName = loadedXlsxHelper.getSheetNames(0) as string;
      const firstSheet = loadedXlsxHelper.getWorksheets(firstSheetName);

      // Extract first row (column headers)
      const firstRow = loadedXlsxHelper.getPreviewData(firstSheet, 1)[0];

      // Check if columns match the required format
      const isValid = requiredColumns[formData.value.fileType].every((col) => {
        return firstRow.includes(col);
      });

      if (!isValid) {
        throw new Error(
          `Invalid file format. Expected columns: ${requiredColumns[formData.value.fileType].join(
            ", "
          )}.`
        );
      }
    }

    v.status = "pass";
    v.message = `File passed validation.`;
    return true; // Validation passed
  } catch (error: any) {
    v.status = "error";
    v.message = error.message;
    return false;
  } finally {
    v.progress = false;
  }
};

onMounted(() => {
  if (!!entity.value && !!file.value) {
    // normalizedValidation.value.status = "pass";
    // fileValidation.value.status = "pass";
    validateNormalized();
    validateExcelFile();
  }
});

const validated = computed<boolean>(() => {
  return (
    // typeValidation.value.status === "pass" &&
    normalizedValidation.value.status === "pass" &&
    fileValidation.value.status === "pass" &&
    !!fileData.value
  );
});

const processingPostData = ref<boolean>(false);
// Handle form submission
const handlePostData = async () => {
  if (validated.value) {
    try {
      processingPostData.value = true;

      const preFormData: AnalyticTypes.PreFormData = {
        fields: manager.new(formData.value),
        file: fileData.value!,
      };

      if (!!entity.value && !!file.value) {
        await manager.put(manager.createFormData(preFormData), true);
      } else {
        await manager.post(manager.createFormData(preFormData), true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      processingPostData.value = false;
      store.loadItems(driveUuid.value);
      store.closeDialog(fileUuid.value ?? driveUuid.value);
    }
  }
};

const title = computed(() => (!!entity.value && !!file.value ? "File Update" : "File Upload"));

watch(
  () => formData.value.fileType,
  async (newFileType) => {
    if (newFileType !== "miscellaneous" && fileData.value) await validateExcelFile();
  }
);
</script>

<template>
  <v-card class="w-50 mx-auto elevation-2" :loading="processingPostData ? 'secondary' : false">
    <v-card-title class="d-flex justify-space-between">
      <span> {{ title }}</span>
      <v-icon icon="mdi-close" @click="store.closeDialog(fileUuid ?? driveUuid)"></v-icon>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handlePostData">
        <!-- @update:modelValue="validateFileType" -->
        <v-autocomplete
          v-model="formData.fileType"
          label="File Type"
          :items="fileTypeOptions"
          persistent-hint
          :hint="`File Type defines rules for file validation.`"
        >
          <template v-slot:prepend>
            <v-sheet width="24px"> </v-sheet>
          </template>
          <template v-slot:append>
            <v-sheet width="24px">
              <!-- <v-progress-circular
                v-if="typeValidation.progress"
                indeterminate
                size="24"
                color="secondary"
                class="pr-3"
              ></v-progress-circular>
              <v-icon
                v-if="!typeValidation.progress && typeValidation.status"
                :icon="typeValidation.status === 'error' ? 'mdi-exclamation' : 'mdi-check'"
                :color="typeValidation.status === 'error' ? 'error' : 'success'"
              ></v-icon> -->
            </v-sheet>
          </template>
        </v-autocomplete>

        <!-- <v-alert border="start" variant="tonal" type="info" class="my-4">
          {{ `Each file of type is unique within the same location.` }}
        </v-alert> -->

        <!-- <v-alert
          v-if="typeValidation.status"
          border="start"
          variant="tonal"
          :type="typeValidation.status === 'error' ? 'error' : 'success'"
          class="mb-4"
        >
          {{ typeValidation.message }}
        </v-alert> -->

        <v-text-field
          v-model="formData.normalizedFileName"
          label="Display File Name"
          persistent-hint
          hint="User-friendly display name for the file."
          @input="validateNormalized"
          @blur="validateNormalized"
        >
          <template v-slot:prepend>
            <v-sheet width="24px"> </v-sheet>
          </template>
          <template v-slot:append>
            <v-sheet width="24px">
              <v-icon
                v-if="normalizedValidation.status"
                :icon="normalizedValidation.status === 'error' ? 'mdi-exclamation' : 'mdi-check'"
                :color="normalizedValidation.status === 'error' ? 'error' : 'success'"
              ></v-icon>
            </v-sheet>
          </template>
        </v-text-field>

        <v-alert
          v-if="normalizedValidation.status === 'error'"
          border="start"
          variant="tonal"
          type="error"
          class="my-4"
        >
          {{ normalizedValidation.message }}
        </v-alert>

        <v-file-input
          v-model="fileData"
          clearable
          show-size
          label="Upload Excel File"
          persistent-hint
          :hint="fileValidation.status ? '' : 'Ensure the file follows the correct format.'"
          @change="validateExcelFile"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <template v-slot:append>
            <v-sheet width="24px">
              <v-progress-circular
                v-if="fileValidation.progress"
                indeterminate
                size="24"
                color="secondary"
                class="pr-3"
              ></v-progress-circular>
              <v-icon
                v-if="!fileValidation.progress && fileValidation.status"
                :icon="
                  fileValidation.status === 'error'
                    ? 'mdi-file-document-alert-outline'
                    : 'mdi-file-check-outline'
                "
                :color="fileValidation.status === 'error' ? 'error' : 'success'"
              ></v-icon>
            </v-sheet>
          </template>
        </v-file-input>

        <v-alert
          v-if="fileValidation.status"
          border="start"
          variant="tonal"
          :type="fileValidation.status === 'error' ? 'error' : 'success'"
          class="my-4"
        >
          {{ fileValidation.message }}
          <v-sheet v-if="fileValidation.status === 'error'" class="mt-2">
            <strong>Tip:</strong> The issue might be related to trailing/leading spaces or column
            formatting. Please ensure that the column headers in your file match the expected format
            exactly.
          </v-sheet>
        </v-alert>

        <v-btn class="mt-2" type="submit" block :disabled="!validated">Submit</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
