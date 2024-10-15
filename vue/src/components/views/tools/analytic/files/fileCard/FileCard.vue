<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, toRefs, unref, watch } from "vue";
import { CommonTypes } from "../../../../../../interfaces/common/CommonTypes";
import FileCardSimpleViewTable from "./FileCardTable.vue";
import FileCardMenu from "./FileCardMenu.vue";
// import { useUserStore } from "../../../../../stores/userStore";
// import { Endpoints } from "../../../../../config/axios/Endpoints";
// import { nodeConfig } from "../../../../../config/env";
import Activator from "../dialog/Activator.vue";
import ViewForXlsx from "./ViewForXlsx.vue";
import Upsert from "../drive/Upsert.vue";
import { AnalyticFileTypes, XLSXTypes } from "../Types";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
import { v4 as uuidv4 } from "uuid";
import { TimeHelper } from "../../../../../../models/common/TimeHelper";
import { FileHelper } from "../../../../../../models/common/files/FileHelper";
import Delete from "../drive/Delete.vue";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";

const store = useAnalyticStore();
const manager = new AnalyticFileManager();
const fileUuid = uuidv4();
const compProps = defineProps<{
  /**
   * File entities
   */
  fileEntity: AnalyticFileTypes.IAnalyticFileEntity;

  driveUuid: string;
}>();

const { fileEntity, driveUuid } = toRefs(compProps);

// A STRING INDICATING WHETHER THE FILE WAS UPDATED OR ONLY CREATED
const lastAction = computed<{
  action: CommonTypes.Api.OrmTypes.IOrmUserAction;
  type: string;
}>(() => {
  const updatedBy = fileEntity.value.updatedBy;
  const createdBy = fileEntity.value.createdBy;

  return {
    action: !updatedBy.length ? createdBy : updatedBy.at(updatedBy.length - 1)!,
    type: !updatedBy.length ? "Created " : "Updated ",
  };
});

const excelFile = ref<File | null>(null);
const excelBlob = ref<Blob | null>(null);

// Reactive variable for storing the Excel View
const excelPreview = ref<XLSXTypes.Sheet>([]);
const excelView = ref<XLSXTypes.Sheets>({});

const handleExcelObjectJson = (excelObjectJson: string) => {
  // Parse the excelObjectJson to an object
  const sheetsObject = JSON.parse(excelObjectJson) as XLSXTypes.Sheets;
  // Get the first sheet name
  const firstSheetName = Object.keys(sheetsObject)[0];
  // Assign the first sheet to excelPreview.value and all sheets to excelView.value
  excelPreview.value = sheetsObject[firstSheetName].slice(0, 3);
  excelView.value = sheetsObject;
};

watch(
  () => unref(fileEntity).excelObjectJson,
  (newE, oldE) => {
    if (oldE && newE !== oldE) handleExcelObjectJson(newE);
  },
  { deep: true }
);

// ON MOUNT ACTIONS
onMounted(async () => {
  try {
    const fileHelper = new FileHelper(fileEntity.value.fileName, "analytic", [".xls", ".xlsx"]);
    await fileHelper.retrieveFromServer();
    excelBlob.value = fileHelper.blob;
    excelFile.value = fileHelper.file;

    handleExcelObjectJson(fileEntity.value.excelObjectJson);
  } catch (error: any) {
    console.log(error.message);
  }
});

// ACTION CLICK AND LOADING
const openActionId = ref<number>(0);
const itemColor = ref<string>("secondary");
const cardLoading: ComputedRef<string | false> = computed(() => {
  if (fileUuid in store.loadingActions && store.loadingActions[fileUuid]?.length > 0) {
    return itemColor.value;
  }

  return false;
});
const handleMenuClick = async (actionId: number, color: string | undefined) => {
  switch (actionId) {
    // DOWNLOAD
    case 2:
      try {
        itemColor.value = color ? color : "secondary";
        store.startLoadingAction(fileUuid, actionId);
        openActionId.value = 2;

        if (!excelBlob.value) throw new Error("Blob at FileCard download evaluates to null.");
        // Step 1: Create a downloadable URL from the Blob
        const downloadUrl = URL.createObjectURL(excelBlob.value);
        // Step 2: Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileEntity.value.fileName; // The filename to save as
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.log(error);
      } finally {
        store.stopLoadingAction(fileUuid, actionId);
      }

      break;

    // UPDATE
    case 3:
      try {
        itemColor.value = color ? color : "secondary";
        store.startLoadingAction(fileUuid, actionId);
        openActionId.value = 3;

        store.openDialog(fileUuid);
      } catch (error) {
        console.log(error);
      } finally {
        store.stopLoadingAction(fileUuid, actionId);
      }

      break;

    // DELETE
    case 4:
      try {
        itemColor.value = color ? color : "secondary";
        store.startLoadingAction(fileUuid, actionId);
        openActionId.value = 4;

        store.openDialog(fileUuid);
      } catch (error) {
        console.log(error);
      } finally {
        store.stopLoadingAction(fileUuid, actionId);
      }

      break;

    // OPEN IN DIALOG
    case 5:
      try {
        itemColor.value = color ? color : "secondary";
        store.startLoadingAction(fileUuid, actionId);
        openActionId.value = 5;

        store.openDialog(fileUuid);
      } catch (error) {
        console.log(error);
      } finally {
        store.stopLoadingAction(fileUuid, actionId);
      }

      break;

    // RESTORE
    case 9:
      try {
        itemColor.value = color ? color : "secondary";
        store.startLoadingAction(fileUuid, actionId);

        manager.restore(unref(fileEntity).id, true);
      } catch (error) {
        console.log(error);
      } finally {
        store.loadItems(driveUuid.value);
        store.stopLoadingAction(fileUuid, actionId);
      }

      break;

    default:
      break;
  }
};
</script>

<template>
  <v-col cols="12" sm="6" md="4">
    <v-card class="rounded-xl bg-surface-3" :loading="cardLoading">
      <!-- file type icon -->
      <template v-slot:prepend>
        <v-icon color="#1D6F42" icon="mdi-file-excel-box"></v-icon>
      </template>

      <!-- file title (normalized) -->
      <template v-slot:title>
        {{ fileEntity.normalizedFileName }}
        <v-chip color="primary" label v-if="fileEntity.considered">
          <span class="d-inline-block text-truncate">Considered</span>
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <v-icon icon="mdi-information-outline" class="ml-1" v-bind="tooltip"></v-icon>
            </template>
            <span
              >This file is the most recent within its file type and will be considered for data
              analysis.</span
            >
          </v-tooltip>
        </v-chip>
      </template>

      <!-- file actions -->
      <template v-slot:append>
        <file-card-menu
          :uuid="fileUuid"
          :file-entity="fileEntity"
          @menu-click="handleMenuClick"
        ></file-card-menu>
        <activator
          :drive-uuid="driveUuid"
          :file-uuid="fileUuid"
          :hideActivator="true"
          v-slot="{ fileUuid }"
        >
          <view-for-xlsx
            v-if="openActionId === 5"
            :analytic-file-entity="fileEntity"
            :xlsx-sheets="excelView"
            :file-uuid="fileUuid!"
          ></view-for-xlsx>
          <upsert
            v-if="openActionId === 3"
            :drive-uuid="driveUuid"
            :file-uuid="fileUuid"
            :entity="fileEntity"
            :file="excelFile"
          ></upsert>
          <delete
            v-if="openActionId === 4"
            :drive-uuid="driveUuid"
            :file-uuid="fileUuid"
            :entity="fileEntity"
          ></delete>
        </activator>
      </template>

      <v-card-text id="e1b3566c-2021-4947-95ef-c1dfac30aaf4">
        <file-card-simple-view-table :excel-preview="excelPreview"></file-card-simple-view-table>
      </v-card-text>

      <v-spacer></v-spacer>

      <!-- file state changes -->
      <v-card-subtitle style="padding-bottom: 10px">
        {{ lastAction.action.user.username }}
        <v-icon icon="mdi-circle-small" size="x-small"></v-icon>
        {{ lastAction.type }}
        {{ TimeHelper.removeTimezone(TimeHelper.convertToLocalTime(lastAction.action.date)) }}
      </v-card-subtitle>
    </v-card>
  </v-col>
</template>

<style>
#e1b3566c-2021-4947-95ef-c1dfac30aaf4 .v-table .v-table__wrapper {
  overflow-x: hidden;
}
</style>
