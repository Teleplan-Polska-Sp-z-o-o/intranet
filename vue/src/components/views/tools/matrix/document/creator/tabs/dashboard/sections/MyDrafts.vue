<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useI18n } from "vue-i18n";

import { DocumentCreatorManager } from "../../../../../../../../../models/document/creator/CreatorManager";
import { useDraftsStore } from "../../../../../../../../../stores/documents/drafts/useDraftsStore";
import { useStepperStore } from "../../../../../../../../../stores/documents/creator/useStepperStore";
import { IDraftEntity } from "../../../../../../../../../interfaces/document/creator/IDraftEntity";
import { DocumentCreatorStepper } from "../../new/StepperTypes";
import { deepSafeParse } from "../../helpers/deepSaveParse";

import { tableDate } from "../../helpers/tableDate";
import { tableStatus } from "../../helpers/tableStatus";
import {
  fetchLanguages,
  mapLanguageToFlag,
  MSLanguageOption,
} from "../../helpers/microsoftLanguages";
import StatusHistoryTimeline from "./StatusHistoryTimeline.vue";

import { v4 as uuidv4 } from "uuid";

const router = useRouter();
const route = useRoute();
const manager = new DocumentCreatorManager();

const uuid = uuidv4();
const draftsStore = useDraftsStore();
draftsStore.addController(uuid);

const stepperStore = useStepperStore();

const { t } = useI18n();
const tBase = "tools.tcd.drafts";

// function tableStatus(item: IDraftEntity | DocumentCreatorStepper.EStepperStatus): {
//   enum: undefined | DocumentCreatorStepper.EStepperStatus;
//   color: undefined | string;
//   text: string;
// } {
//   const status =
//     typeof item === "number" ? item : deepSafeParse<IDraftEntity>(item).stepper._status;
//   switch (status) {
//     case DocumentCreatorStepper.EStepperStatus.DRAFT:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.DRAFT,
//         color: "gray",
//         text: t(`${tBase}.draftStatus.chip.draftOption`),
//       };
//     case DocumentCreatorStepper.EStepperStatus.FOR_RELEASE:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.FOR_RELEASE,
//         color: "amber",
//         text: t(`${tBase}.draftStatus.chip.forReleaseOption`),
//       };

//     case DocumentCreatorStepper.EStepperStatus.RELEASED:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.RELEASED,
//         color: "blue",
//         text: t(`${tBase}.draftStatus.chip.releasedOption`),
//       };

//     case DocumentCreatorStepper.EStepperStatus.LATEST_RELEASE:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.LATEST_RELEASE,
//         color: "green",
//         text: t(`${tBase}.draftStatus.chip.archived`),
//       };

//     default:
//       return {
//         enum: undefined,
//         color: undefined,
//         text: t(`${tBase}.draftStatus.chip.unknown`),
//       };
//   }
// }

const headers = computed<object[]>(() => {
  return [
    // { title: t(`${tBase}.recordId`), align: "start", key: "id", value: "id" },
    { title: t(`${tBase}.draftName`), align: "start", key: "name", value: "name" },
    {
      title: t(`${tBase}.draftStatus.title`),
      align: "start",
      key: "status",
    },
    {
      title: t(`${tBase}.documentTitle`),
      align: "start",
      key: "title",
      value: (item: IDraftEntity) => {
        try {
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
          return deepSafeParse<IDraftEntity>(item).stepper._documentIdRevision || "- - -";
        } catch (error) {
          console.error(`Error at getting value of stepper title: ${error}. Returning "- - -"`);
          return "- - -";
        }
      },
    },
    {
      title: t(`${tBase}.created`),
      align: "start",
      key: "created",
    },
    {
      title: t(`${tBase}.lastUpdate`),
      align: "start",
      key: "lastUpdate",
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

// const drafts = ref<IDraftEntity[]>([]);

const editDraft = (item: IDraftEntity) => {
  const stepper: DocumentCreatorStepper.IStepper = deepSafeParse<IDraftEntity>(item).stepper;
  const type = stepper.type;
  if (!type) return;

  stepperStore.clearStepper();

  nextTick(() => {
    stepperStore.setStepper({
      type,
      stepper,
      navigation: {
        router,
        path: `/tool/tcd/browse/new/${item.id}`,
      },
    });
  });
};

const openedItem = ref<IDraftEntity | null>(null);

const loadingTable = ref<string | false>(false);
const loadTable = async () => {
  try {
    loadingTable.value = "primary";

    const formData: FormData = new FormData();
    formData.append("createdByMe", JSON.stringify(true));

    formData.append(
      "ofStepperStatus",
      JSON.stringify([
        DocumentCreatorStepper.EStepperStatus.DRAFT,
        DocumentCreatorStepper.EStepperStatus.FOR_RELEASE,
      ])
    );

    const drafts = await manager.get(formData);

    return drafts;
  } finally {
    loadingTable.value = false;
  }
};

const loading = ref<"secondary" | false>(false);

// const targetDraftStatus = ref<DocumentCreatorStepper.EStepperStatus | null>(null);
const targetDraftStatusComment = ref<string>("");
const dialogChangeOfDraftStatus = ref<boolean>(false);
const openChangeOfDraftStatusDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogChangeOfDraftStatus.value = true;
};
const closeChangeOfDraftStatusDialog = () => {
  openedItem.value = null;
  dialogChangeOfDraftStatus.value = false;
};
const changeOfDraftStatusConfirm = async () => {
  try {
    loading.value = "secondary";

    if (openedItem.value) {
      const formData: FormData = new FormData();
      formData.append("comment", JSON.stringify(targetDraftStatusComment.value));
      targetDraftStatusComment.value = "";

      await manager.changeStatusOfDraft(
        openedItem.value.id,
        DocumentCreatorStepper.EStepperStatus.FOR_RELEASE,
        formData,
        true
      );

      draftsStore.controller[uuid].drafts = await loadTable();
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeChangeOfDraftStatusDialog();
    draftsStore.triggerSignal(uuid);
  }
};

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

      draftsStore.controller[uuid].drafts = await loadTable();
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeDeleteDialog();
    draftsStore.triggerSignal(uuid);
  }
};

const language = ref<string>("");
const languageOptions = ref<MSLanguageOption[]>([]);

onMounted(() => {
  (async () => {
    languageOptions.value = await fetchLanguages();
  })();
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
  () => draftsStore.signal,
  async (signal) => {
    if (signal.uuid !== uuid) {
      // only react if signal is from another uuid
      draftsStore.controller[uuid].drafts = await loadTable();
    }
  },
  { deep: true }
);
watch(
  [() => route.params.functionality],
  async (functionality: [string | string[]]) => {
    if (functionality.includes("dashboard")) {
      draftsStore.controller[uuid].drafts = await loadTable();
    }
  },
  { immediate: true, deep: true }
);

onUnmounted(() => {
  draftsStore.removeController(uuid);
});
</script>

<template>
  <v-dialog v-model="dialogChangeOfDraftStatus" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading ? 'secondary' : false">
      <v-card-title class="text-h5">{{
        t(`${tBase}.changeOfDraftStatusConfirmationTitle`)
      }}</v-card-title>
      <v-card-text>
        <div class="mb-6">
          {{ t(`${tBase}.changeOfDraftStatusConfirmationText`) }}
        </div>
        <status-history-timeline class="mb-6" :item="(openedItem as IDraftEntity)" />
        <v-textarea
          v-model="targetDraftStatusComment"
          :label="t(`${tBase}.draftStatus.targetDraftStatusComment.label`)"
          variant="solo-filled"
          rows="3"
          counter="100"
          persistent-counter
          maxLength="100"
          flat
        >
        </v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeChangeOfDraftStatusDialog">{{
          t(`${tBase}.cancel`)
        }}</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          @click="changeOfDraftStatusConfirm"
          :disabled="!openedItem"
          >{{ t(`${tBase}.ok`) }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading ? 'secondary' : false">
      <!-- <v-card-title class="text-h5">{{ t(`${tBase}.deleteConfirmation`) }}</v-card-title> -->
      <v-card-title class="text-h5">{{ t(`${tBase}.deleteConfirmationTextTitle`) }}</v-card-title>
      <v-card-text>
        <div class="mb-6">
          {{ t(`${tBase}.deleteConfirmationText`) }}
        </div>
      </v-card-text>
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
        <div class="mb-6" v-if="language === 'original'">
          {{ t(`${tBase}.originalAlert`) }}
        </div>

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

  <v-fade-transition hide-on-leave>
    <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
      <v-card-title class="d-flex align-center pe-2"> {{ t(`${tBase}.myDrafts`) }} </v-card-title>
      <!-- 
      <draft-filters></draft-filters> -->

      <!-- v-model:search="search" -->

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="draftsStore.getComputedDrafts(uuid)"
          :loading="loadingTable"
          class="bg-surface-2"
        >
          <template v-slot:item.created="{ item }">
            <span class="no-wrap">{{ tableDate(item as IDraftEntity, "createdBy") }}</span>
          </template>
          <template v-slot:item.lastUpdate="{ item }">
            <span class="no-wrap">{{ tableDate(item as IDraftEntity, "lastUpdate") }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="tableStatus(item as IDraftEntity, t).color">
              {{ tableStatus(item as IDraftEntity, t).text }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip :text="t(`${tBase}.editRecordTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="info"
                  v-bind="tooltip"
                  @click="editDraft(item as IDraftEntity)"
                  icon="mdi-pencil"
                  class="ma-2"
                  :disabled="tableStatus(item as IDraftEntity, t).enum === DocumentCreatorStepper.EStepperStatus.FOR_RELEASE"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="t(`${tBase}.changeOfDraftStatusTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="primary"
                  v-bind="tooltip"
                  @click="openChangeOfDraftStatusDialog(item as IDraftEntity)"
                  icon="mdi-file-send-outline"
                  class="ma-2"
                  :disabled="tableStatus(item as IDraftEntity, t).enum === DocumentCreatorStepper.EStepperStatus.FOR_RELEASE"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="t(`${tBase}.removeRecordTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="error"
                  v-bind="tooltip"
                  @click="openDeleteDialog(item as IDraftEntity)"
                  icon="mdi-delete"
                  class="ma-2"
                  :disabled="tableStatus(item as IDraftEntity, t).enum === DocumentCreatorStepper.EStepperStatus.FOR_RELEASE"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="t(`${tBase}.generateDocumentTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="primary"
                  v-bind="tooltip"
                  @click="openLanguageDialog(item as IDraftEntity)"
                  icon="mdi-translate"
                  class="ma-2"
                  :disabled="tableStatus(item as IDraftEntity, t).enum === DocumentCreatorStepper.EStepperStatus.FOR_RELEASE"
                />
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-fade-transition>
</template>
