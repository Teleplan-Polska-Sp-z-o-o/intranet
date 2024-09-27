<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";
import { AnalyticFileTypes } from "../Types";

const store = useAnalyticStore();
const manager: AnalyticFileManager = new AnalyticFileManager();
const compProps = defineProps<{
  driveUuid: string;
  fileUuid?: string;

  /**
   * entity
   */
  entity?: AnalyticFileTypes.IAnalyticFileEntity;
}>();
const { driveUuid, fileUuid, entity } = toRefs(compProps);

const processingPostData = ref<boolean>(false);
// Handle form submission
const handlePostData = async () => {
  try {
    processingPostData.value = true;

    if (!!entity.value) {
      await manager.delete(entity.value.id, true);
    }
  } catch (error) {
    console.log(error);
  } finally {
    processingPostData.value = false;
    store.loadItems(driveUuid.value);
    store.closeDialog(fileUuid.value ?? driveUuid.value);
  }
};

const isEntity = computed(() => !!entity.value?.id);
</script>

<template>
  <v-card class="w-50 mx-auto elevation-2" :loading="processingPostData ? 'secondary' : false">
    <v-card-title class="d-flex justify-space-between">
      <span>File Deletion</span>
      <v-icon icon="mdi-close" @click="store.closeDialog(fileUuid ?? driveUuid)"></v-icon>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handlePostData">
        <v-alert v-if="isEntity" border="start" variant="tonal" type="warning" class="my-4">
          {{ `Deleting this file is a permanent action.` }}
          {{ `Are you sure you want to delete the file: ${entity?.normalizedFileName}?` }}
        </v-alert>
        <v-alert v-else border="start" variant="tonal" type="error" class="my-4">
          {{ `Error: File not loaded.` }}
        </v-alert>

        <v-btn class="mt-2" type="submit" block :disabled="!isEntity">Delete</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
