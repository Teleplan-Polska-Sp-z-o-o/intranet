<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useI18n } from "vue-i18n";
import { useStepperStore } from "../../../../../../../../../stores/documents/creator/useStepperStore";
import { deepSafeParse } from "../../helpers/deepSaveParse";
import { tableDate } from "../../helpers/tableDate";
import {
  CreatorCacheManager,
  ICache,
  ICacheResponse,
} from "../../../../../../../../../models/document/creator/CreatorCacheManager";
import { useRoute, useRouter } from "vue-router";

const manager = new CreatorCacheManager();
const stepperStore = useStepperStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const tBase = "tools.tcd.drafts";

const headers = computed<object[]>(() => {
  return [
    {
      title: t(`${tBase}.documentTitle`),
      align: "start",
      key: "stepper._documentTitle",
    },
    {
      title: t(`${tBase}.documentIdRev`),
      align: "start",
      key: "stepper._documentIdRevision",
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
      sortable: false,
    },
  ];
});

const caches = ref<ICache[]>([]);

const editCache = (cache: ICache) => {
  stepperStore.clearStepper();
  nextTick(() => {
    stepperStore.loadFromServer({
      cache,
      navigation: {
        router,
        path: `/tool/tcd/browse/new`,
      },
    });
  });
};

const openedItem = ref<ICache | null>(null);

const loadingTable = ref<string | false>(false);
const loadTable = async () => {
  try {
    loadingTable.value = "primary";
    const draftsCaches: ICacheResponse = await manager.get();
    return draftsCaches.cache.map((item) => {
      return {
        ...item,
        stepper: deepSafeParse<ICache>(item).stepper,
      };
    });
  } finally {
    loadingTable.value = false;
  }
};

const loading = ref<"secondary" | false>(false);

const dialogDelete = ref<boolean>(false);
const openDeleteDialog = (item: ICache) => {
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
      await manager.delete(openedItem.value.id);
      caches.value = await loadTable();
    }
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    closeDeleteDialog();
  }
};

watch(
  () => route.params.functionality,
  async (functionality: string | string[] | undefined) => {
    if (functionality && functionality.includes("dashboard")) {
      caches.value = await loadTable();
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card class="rounded-xl elevation-2" :loading="loading">
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

  <v-fade-transition hide-on-leave>
    <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
      <v-card-title class="d-flex align-center pe-2">
        {{ t(`${tBase}.myUnsavedWork`) }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="caches"
          :loading="loadingTable"
          class="bg-surface-2"
        >
          <template v-slot:item.created="{ item }">
            <span class="no-wrap">{{ tableDate(item as ICache, "createdBy") }}</span>
          </template>
          <template v-slot:item.lastUpdate="{ item }">
            <span class="no-wrap">{{ tableDate(item as ICache, "lastUpdate") }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip :text="t(`${tBase}.editRecordTooltip`)">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  variant="tonal"
                  color="info"
                  v-bind="tooltip"
                  @click="editCache(item as ICache)"
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
                  v-bind="tooltip"
                  @click="openDeleteDialog(item as ICache)"
                  icon="mdi-delete"
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
