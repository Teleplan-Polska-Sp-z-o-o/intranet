<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DocumentCreatorManager } from "../../../../../../../../models/document/creator/CreatorManager";
import { IDraftEntity } from "../../../../../../../../models/document/creator/IDraftEntity";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import jwtAxios from "../../../../../../../../config/axios/jwtAxios";
import { DocumentCreatorStepper } from "../new/StepperTypes";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const manager = new DocumentCreatorManager();
const store = useStepperStore();
const search = ref<string>("");

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.drafts";

function deepSafeParse<T>(item: unknown): T {
  try {
    if (typeof item === "string") {
      return deepSafeParse(JSON.parse(item)); // Parse the string and recursively process it
    } else if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // Recursively process each item in the array
        return item.map((element) => deepSafeParse(element)) as unknown as T;
      } else {
        // Recursively process each key-value pair in the object
        return Object.entries(item).reduce((acc, [key, value]) => {
          (acc as Record<string, unknown>)[key] = deepSafeParse(value);
          return acc;
        }, {} as Record<string, unknown>) as T;
      }
    }
    return item as T; // Return as-is if not a string or object
  } catch {
    return item as T; // Return as-is if parsing fails
  }
}

const headers = computed<object[]>(() => {
  return [
    { title: t(`${tBase}.recordId`), align: "start", key: "id", value: "id" },
    { title: t(`${tBase}.draftName`), align: "start", key: "name", value: "name" },
    {
      title: t(`${tBase}.documentTitle`),
      align: "start",
      key: "title",
      value: (item: IDraftEntity) => {
        try {
          // return deepSafeParse<IDraftEntity>(item).stepper.body.windows[2].model.title;
          return deepSafeParse<IDraftEntity>(item).stepper._documentTitle || "- - -";
        } catch (error) {
          console.error(`Error at getting value of stepper title: ${error}. Returning "- - -"`);
          return "- - -";
        }
      },
    },
    {
      title: t(`${tBase}.documentIdRev`),
      align: "start",
      key: "document_id_rev",
      value: (item: IDraftEntity) => {
        try {
          // const model = deepSafeParse<IDraftEntity>(item).stepper.body.windows[2].model;
          return deepSafeParse<IDraftEntity>(item).stepper._documentIdRevision || "- - -";
        } catch (error) {
          console.error(`Error at getting value of stepper title: ${error}. Returning "- - -"`);
          return "- - -";
        }
      },
    },
    {
      title: t(`${tBase}.actions`),
      align: "start",
      key: "actions",
      value: "actions",
      sortable: false,
    },
  ];
});
const drafts = ref<IDraftEntity[]>([]);

const editDraft = (item: IDraftEntity) => {
  const stepper: DocumentCreatorStepper.IStepper = deepSafeParse<IDraftEntity>(item).stepper;
  let type = stepper.type;
  // must be
  if (!type) type = DocumentCreatorStepper.EStepperType.INSTRUCTION;
  store.setStepper({
    type,
    stepper,
    navigation: {
      router,
      path: `/tool/matrix/browse/documents/creator/new/${item.id}`,
    },
  });
};

const openedItem = ref<IDraftEntity | null>(null);

const loading = ref<"secondary" | false>(false);

const dialogDelete = ref<boolean>(false);
const openDeleteDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogDelete.value = true;
};
const closeDeleteDialog = () => {
  openedItem.value = null;
  dialogDelete.value = false;
};
const deleteDraftConfirm = async () => {
  try {
    loading.value = "secondary";
    if (openedItem.value) {
      await manager.delete(openedItem.value.id, true); // delete
      drafts.value = await manager.get();
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeDeleteDialog();
  }
};

interface MSLanguageOption {
  code: string;
  name: string;
}
interface MSLanguage {
  name: string;
  nativeName: string;
  dir: string;
}

const language = ref<string>("");

const languageOptions = ref<MSLanguageOption[]>([]);

// Allowed language codes
const allowedLanguages = new Set(["pl", "uk", "cs", "en"]);

const fetchLanguages = async () => {
  try {
    const response = await jwtAxios.get(
      "https://api-eur.cognitive.microsofttranslator.com/languages?api-version=3.0",
      {
        headers: {
          "Accept-Language": "en", // Force English response
        },
      }
    );

    // Parse response into [{code: "af", name: "Afrikaans"}, ...]
    languageOptions.value = Object.entries(response.data.translation as Record<string, MSLanguage>)
      .filter(([code]) => allowedLanguages.has(code))
      .map(([code, details]) => ({
        code,
        name: details.name,
      }));
    // languageOptions.value.unshift({
    //   code: "original",
    //   name: "Preserve Original Language",
    // });
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

const mapLanguageToFlag = (code: string) => {
  const flagMap: Record<string, string> = {
    pl: "pl",
    uk: "ua", // Ukrainian language → Ukraine flag
    cs: "cz", // Czech language → Czech Republic flag
    en: "gb", // English → UK flag (or use "us" for US)
  };
  return flagMap[code] || code; // Default to the same code if not mapped
};

onMounted(() => {
  fetchLanguages();
});

const dialogLanguage = ref<boolean>(false);
const openLanguageDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogLanguage.value = true;
};
const closeLanguageDialog = () => {
  openedItem.value = null;
  dialogLanguage.value = false;
  language.value = "";
};

const generateDraftConfirm = async () => {
  try {
    loading.value = "secondary";
    if (openedItem.value) {
      await manager.generate(openedItem.value.id, language.value, true);
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeLanguageDialog();
  }
};

watch(
  () => route.params.functionality,
  async (functionality: string | string[]) => {
    if (functionality === "drafts") {
      drafts.value = await manager.get();
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading ? 'secondary' : false">
      <v-card-title class="text-h5">{{ t(`${tBase}.deleteConfirmation`) }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeDeleteDialog">{{
          t(`${tBase}.cancel`)
        }}</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          @click="deleteDraftConfirm"
          :disabled="!openedItem"
          >{{ t(`${tBase}.ok`) }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogLanguage" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading ? 'secondary' : false">
      <v-card-title class="text-h5">{{ t(`${tBase}.selectDocumentLanguage`) }}</v-card-title>

      <v-card-text>
        <v-autocomplete
          v-model="language"
          :items="languageOptions"
          item-title="name"
          item-value="code"
          :label="t(`${tBase}.documentLanguage`)"
          prepend-icon="mdi-format-list-text"
          :hint="t(`${tBase}.selectOrSearchLanguageHint`)"
          :rules="[(v) => !!v || t(`${tBase}.pleaseSelectLanguage`)]"
          persistent-hint
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #title>
                <div class="d-flex align-center ga-3">
                  <span class="fi" :class="`fi-${mapLanguageToFlag(item.raw.code)}`"></span>
                  <span>{{ item.raw.name }}</span>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeLanguageDialog">{{
          t(`${tBase}.cancel`)
        }}</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          @click="generateDraftConfirm"
          :disabled="!language"
          >{{ t(`${tBase}.ok`) }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
    <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        :label="t(`${tBase}.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-data-table v-model:search="search" :headers="headers" :items="drafts" class="bg-surface-2">
      <template v-slot:item.actions="{ item }">
        <v-tooltip :text="t(`${tBase}.editRecordTooltip`)">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="info"
              size="small"
              v-bind="tooltip"
              @click="editDraft(item as IDraftEntity)"
              icon="mdi-pencil"
              class="ma-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip :text="t(`${tBase}.removeRecordTooltip`)">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="error"
              size="small"
              v-bind="tooltip"
              @click="openDeleteDialog(item as IDraftEntity)"
              icon="mdi-delete"
              class="ma-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip :text="t(`${tBase}.generateDocumentTooltip`)">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              v-bind="tooltip"
              @click="openLanguageDialog(item as IDraftEntity)"
              icon="mdi-file-download-outline"
              class="ma-2"
            />
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>
