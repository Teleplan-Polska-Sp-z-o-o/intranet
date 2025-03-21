<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchLanguages, MSLanguageOption } from "../../helpers/microsoftLanguages";
// import { IDraftEntity } from "../../../../../../../../../interfaces/document/creator/IDraftEntity";
import { useDocumentGenerateUploadStore } from "../../../../../../../../../stores/documents/useDocumentUploadStore";

// import { useI18n } from "vue-i18n";

// const { t } = useI18n();
// const tBase = "tools.matrix.tabs.documents.creator.drafts";

// const props = defineProps<{
//   item: IDraftEntity | null;
// }>();
const genUplStore = useDocumentGenerateUploadStore();

// LANGUAGE PICKER
const languageOptions = ref<MSLanguageOption[]>([]);
onMounted(() => {
  (async () => {
    languageOptions.value = await fetchLanguages();
  })();
});
//
</script>

<template>
  <div>
    <div class="text-h6 mb-1">{{ "Select languages" }}</div>
    <div class="text-body-2 text-medium-emphasis mb-3">
      {{ "The generated documents will be saved and assigned under this draft." }}
    </div>
    <v-chip-group v-model="genUplStore.languages" column multiple class="mb-3">
      <template v-for="language in languageOptions">
        <v-chip
          :value="language.code"
          :text="language.name"
          :variant="genUplStore.languages.includes(language.code) ? undefined : 'outlined'"
          :color="genUplStore.languages.includes(language.code) ? 'secondary' : undefined"
          filter
        ></v-chip>
      </template>
    </v-chip-group>
    <v-progress-linear
      v-if="genUplStore.processing.inProgress"
      :model-value="genUplStore.filesToUpload.length"
      :max="genUplStore.languages.length"
      color="primary"
      striped
      height="10"
    ></v-progress-linear>
  </div>
</template>
