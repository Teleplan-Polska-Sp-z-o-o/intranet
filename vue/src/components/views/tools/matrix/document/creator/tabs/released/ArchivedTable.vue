<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useI18n } from "vue-i18n";
import { DocumentCreatorManager } from "../../../../../../../../models/document/creator/CreatorManager";
import { useDraftsStore } from "../../../../../../../../stores/documents/drafts/useDraftsStore";
// import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { IDraftEntity } from "../../../../../../../../interfaces/document/creator/IDraftEntity";
import { DocumentCreatorStepper } from "../new/StepperTypes";
import { v4 as uuidv4 } from "uuid";
import { deepSafeParse } from "../helpers/deepSaveParse";
import { tableDate } from "../helpers/tableDate";
import { tableStatus } from "../helpers/tableStatus";

// const router = useRouter();
const route = useRoute();
const manager = new DocumentCreatorManager();

const uuid = uuidv4();
const draftsStore = useDraftsStore();
draftsStore.addController(uuid);

// const stepperStore = useStepperStore();

const { t } = useI18n();
const tBase = "tools.tcd.drafts";

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

const openedItem = ref<IDraftEntity | null>(null);
const loading = ref<"secondary" | false>(false);

const chosenFiles = ref<string[]>([]);
const chosenFilesOptions = computed<string[]>(() => {
  return openedItem.value?.stepper.fileNames ?? [];
});

const dialogDownload = ref<boolean>(false);
const openDownloadDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogDownload.value = true;
};
const closeDownloadDialog = () => {
  openedItem.value = null;
  dialogDownload.value = false;
  chosenFiles.value = [];
};

const downloadGeneratedDocuments = async () => {
  try {
    loading.value = "secondary";
    if (openedItem.value) {
      const formData: FormData = new FormData();
      formData.append("fileNamesToDownload", JSON.stringify(chosenFiles.value));
      await manager.downloadGeneratedDocuments(openedItem.value.id, formData, true);
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeDownloadDialog();
  }
};

const loadingTable = ref<string | false>(false);
const loadTable = async () => {
  try {
    loadingTable.value = "primary";

    const formData: FormData = new FormData();
    formData.append("createdByMe", JSON.stringify(false));

    formData.append(
      "ofStepperStatus",
      JSON.stringify([DocumentCreatorStepper.EStepperStatus.ARCHIVED])
    );

    const drafts = await manager.get(formData);

    return drafts;
  } finally {
    loadingTable.value = false;
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
    if (functionality.includes("released")) {
      draftsStore.controller[uuid].drafts = await loadTable();
    }
  },
  { immediate: true, deep: true }
);

onUnmounted(async () => {
  draftsStore.removeController(uuid);
});
</script>

<template>
  <v-dialog v-model="dialogDownload" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading ? 'secondary' : false">
      <v-card-title class="text-h5">{{ t(`${tBase}.download.selectFilesTitle`) }}</v-card-title>

      <v-card-text>
        <v-select
          v-model="chosenFiles"
          :items="chosenFilesOptions"
          multiple
          :label="t(`${tBase}.download.selectFilesLabel`)"
          prepend-icon="mdi-format-list-text"
          :hint="t(`${tBase}.download.selectFilesHint`)"
          persistent-hint
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeDownloadDialog">{{
          t(`${tBase}.cancel`)
        }}</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          @click="downloadGeneratedDocuments"
          :disabled="chosenFiles.length === 0"
          >{{ t(`${tBase}.ok`) }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-fade-transition hide-on-leave>
    <v-card
      class="rounded-xl elevation-2 ma-1"
      prepend-icon="mdi-shield-crown"
      color="primary"
      :title="t(`${tBase}.archivedDrafts`)"
    >
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="draftsStore.getComputedDrafts(uuid)"
          :loading="loadingTable"
          class="bg-surface-2 rounded-xl"
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
            <v-tooltip :text="t(`${tBase}.downloadGeneratedDocumentsTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="primary"
                  v-bind="tooltip"
                  @click="openDownloadDialog(item as IDraftEntity)"
                  icon="mdi-file-download-outline"
                  class="ma-2"
                />
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-fade-transition>
</template>
