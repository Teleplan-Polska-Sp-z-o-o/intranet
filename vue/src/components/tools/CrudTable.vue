<script setup lang="ts">
import { computed, ComputedRef, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import TableDialog from "./TableDialog.vue";
import TableFlow from "./TableFlow.vue";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import { ResponseStatus } from "../../models/common/ResponseStatus";
import CopyToClipboard from "./CopyToClipboard.vue";
import TableFilters from "./TableFilters.vue";
import { useCrudStore } from "../../stores/crud/useCrudStore";
import { useCrudFolderChipsStore } from "../../stores/crud/useCrudFolderChipsStore";
import { Chips } from "../../models/document/Chips";
import { useRoute } from "vue-router";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const props = defineProps<{
  /**
   * Table headers.
   *
   * Format required by Vuetify data tables
   */
  headers: any;
  sortBy: Array<{ key: string; order?: boolean | "asc" | "desc" }> | undefined;

  /**
   * Search by headers keys
   */
  searchBy: Array<string>;

  /**
   * Key for useI18n.
   *
   * Sets toolbar title
   */
  toolbarTitle: string;

  /**
   * Key for useI18n.
   *
   * Replaces default search placeholder
   */
  searchTitle?: string;

  /**
   * Manager class
   *
   * Defines functions for required crud operations.
   *
   * Required function is 'get'.
   * Optional: 'post', 'put', 'delete':
   * - get method optionally takes chips from ChipFilters.vue
   * - post and put methods accept FormData
   * - delete method takes id from chosen item
   */
  manager?: any;

  reqData?: any;

  emitTableChange?: true;
  disableAdd?: boolean;

  /**
   * Enable post action button
   *
   * !Requires Manager with post method
   */
  tableAdd?: true;
  /**
   * Enable delete action button
   *
   * !Requires Manager with delete method
   */
  tableDelete?: true;

  /**
   * Enable edit action button
   *
   * !Requires Manager with edit method
   */
  tableEdit?: true;
  /**
   * Key for useI18n.
   *
   * Replaces default delete message
   */
  deleteTMsg?: string;

  tableDialogComponent?: any;
  tableDialogComponentProps?: any;

  copy?: true;
  copyHeadersOrder?: Array<string>;
  copyHeadersCustoms?: Function;

  flow?: string; // pdf name

  /**
   * Deprecated solution to update table
   *
   * **Instead** make use of load() at useCrudStore
   */
  loadItems?: true;

  filters?: boolean;
  filtersCallback?: Function;

  // helpers
  log?: boolean;
  /**
   * import { v4 as uuidv4 } from "uuid";
   * Result of uuidv4()
   *
   * Connect filters with crud table
   *
   * This enables watchers on useCrudStore().getLoad() and useCrudFolderChipsStore().getChips()
   */
  instanceId?: string;
  /**
   * Specifying enables watch for route entry
   *
   * Automatically retrieves new records
   */
  tab?: string;
}>();

const emit = defineEmits(["save-data", "emit-table-change"]);

const headers = ref<any>(props.headers);

/**
 * Stores retrieved records
 */
const items = ref<Array<any>>([]);

const crudStore = useCrudStore();
/**
 * Manager class for crud operations
 *
 * Manager defines get function
 * Optionally: post, put, delete
 */
const manager = ref<any>(
  props.instanceId ? crudStore.getManager(props.instanceId)?.value ?? props.manager : props.manager
);

const folderChipsStore = useCrudFolderChipsStore();

const loadingState = ref<string | false>(false);
/**
 * General load function
 *
 * Loading of items happen when:
 * - prop loadItems is set to true
 * - load() at useCrudStore is called.
 * - chips at useCrudFolderChipsStore change.
 *
 * More at useCrudStore
 */
const load = async (chips?: ComputedRef<Chips>) => {
  try {
    loadingState.value = "primary";
    const mg = crudStore.getManager(props.instanceId) ?? props.manager;
    manager.value = mg.value;
    items.value = await mg?.value.get(
      chips?.value ?? folderChipsStore.getChips(props.instanceId).value
    );
    if (props.log) console.log(items.value);
  } catch (error) {
    console.error(`Crud Table at load, ${error}`);
  } finally {
    loadingState.value = false;
  }
};

/**
 * Loading items based on prop loadItems
 */
watch(
  () => props.loadItems,
  async (loadItems: true | undefined) => {
    if (loadItems === true) {
      await load();
    }
  }
);

watch(
  () => folderChipsStore.getChips(props.instanceId),
  (newChips, oldChips) => {
    if (typeof props.instanceId === "string") {
      if (newChips !== oldChips) {
        load(newChips);
      }
    }
  },
  { deep: true }
);

/**
 * Loading items based on useCrudStore load
 */
watch(
  () => crudStore.getLoad(props.instanceId).value,
  async (loadItems: boolean) => {
    if (loadItems === true) {
      await load();
    }
  }
);

const route = useRoute();
/**
 * Watch tab to load
 */
watch(
  () => route.params.tab,
  async (tab: string | string[]) => {
    if (props.tab && tab.includes(props.tab)) {
      await load();
    }
  },
  { immediate: true }
);

// /**
//  * Initial load
//  */
onMounted(async () => {
  if (!props.tab && items.value.length === 0) {
    await load();
  }
});

const filtersCallback = ref<{ callback: Function } | null>(null);

const toolbarTitle = ref<string>(props.toolbarTitle);
const search = ref<string>("");
const searchTitle = ref<string>(props.searchTitle ? props.searchTitle : "Search");
const filtered = computed(() => {
  try {
    const itemsFiltered = filtersCallback.value?.hasOwnProperty("callback")
      ? (filtersCallback.value?.callback(items.value) as Array<any>)
      : items.value;

    if (search.value) {
      return itemsFiltered.filter((item: any) => {
        for (const key of props.searchBy) {
          const keys: string[] = key.split(".");
          let value: any = item[keys[0]];
          for (let i = 1; i < keys.length; i++) {
            value = value?.[keys[i]];
          }
          value = JSON.stringify(value)?.toLowerCase();
          const searchTerm = search.value.toLowerCase();
          if (value && value.includes(searchTerm)) {
            return true;
          }
        }
        return false;
      });
    } else {
      return itemsFiltered;
    }
  } catch (error) {
    console.error(`Crud Table at filtered, ${error}`);
    return items.value;
  }
});
const dialog = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const dialogDeleteLoading = ref<boolean>(false);

const item = ref<any>({ ...manager.value.new() });
const editedItem = ref<any>({ ...item.value });
const ComponentProps = computed(() => {
  return {
    ...props.tableDialogComponentProps,
    gotItems: items.value,
    editedItem: editedItem.value,
  };
});
const editedIndex = ref<number>(-1);

const reqData = ref<any>(props.reqData);

const disableAdd = ref<boolean>(props.disableAdd === undefined ? false : props.disableAdd);

// const responseStatus = ref<IResponseStatus | null>(null);

// watchEffect(() => {
//   emit("responseStatus", responseStatus.value);
// });

const verified = ref<boolean>(false);

watchEffect(() => {
  headers.value = props.headers;
});

watchEffect(() => {
  toolbarTitle.value = props.toolbarTitle;
});

watchEffect(() => {
  reqData.value = props.reqData;
});

watchEffect(() => {
  disableAdd.value = props.disableAdd;
});

// watchEffect(async () => {
//   manager.value = props.manager;
//   chips.value = props.chips;
//   items.value = await manager.value.get(chips.value);
// });

watch(
  () => props.manager,
  async (newManager) => {
    manager.value = newManager;
    await load();
  },
  { deep: true }
);

const deleteItem = async (item: any) => {
  try {
    editedIndex.value = items.value.indexOf(item);
    editedItem.value = { ...item };
    dialogDelete.value = true;
  } catch (error) {
    console.error(`Crud Table at deleteItem, ${error}`);
  }
};
const editItem = (item: any) => {
  try {
    editedIndex.value = items.value.indexOf(item);
    editedItem.value = { ...item };
    dialog.value = true;
  } catch (error) {
    console.error(`Crud Table at editItem, ${error}`);
  }
};

const close = () => {
  try {
    dialog.value = false;
    dialogLoading.value = false;

    nextTick(() => {
      editedItem.value = { ...item.value };
      editedIndex.value = -1;
    });
  } catch (error) {
    console.error(`Crud Table at close, ${error}`);
  }
};

const closeDelete = async () => {
  try {
    dialogDelete.value = false;

    nextTick(() => {
      editedItem.value = { ...item.value };
      editedIndex.value = -1;
    });
  } catch (error) {
    console.error(`Crud Table at closeDelete, ${error}`);
  }
};

const deleteItemConfirm = async () => {
  try {
    dialogDeleteLoading.value = true;
    // responseStatus.value =
    await manager.value.delete(editedItem.value.id, true);
    if (props.emitTableChange) emit("emit-table-change");
    await load();
  } catch (error: any) {
    console.error(`Crud Table at deleteItemConfirm, ${error}`);
    // responseStatus.value =
    // new ResponseStatus({
    //   code: error.response.status,
    //   message: error.response.data.statusMessage,
    // });
  } finally {
    dialogDeleteLoading.value = false;
    closeDelete();
  }
};

const save = async () => {
  try {
    const data: any = reqData.value;

    dialogLoading.value = true;
    if (editedIndex.value > -1)
      // responseStatus.value =
      await manager.value.put(data, true);
    // responseStatus.value =
    else await manager.value.post(data, true);
  } catch (error: any) {
    console.error(`Crud Table at save, ${error}`);
    // responseStatus.value = new ResponseStatus({
    //   code: error.response.status,
    //   message: error.response.data.statusMessage,
    // });
  } finally {
    await load();
    if (props.emitTableChange) emit("emit-table-change");
    close();
  }
};

const handleVerified = (v: boolean) => (verified.value = v);

const handleSaveData = (data: any) => emit("save-data", data);

const handleFilters = (filters: { callback: Function }) => {
  filtersCallback.value = filters;
};
</script>
<template>
  <v-card class="rounded-xl elevation-2">
    <v-data-table
      :mobile-breakpoint="960"
      :loading="loadingState"
      :headers="headers"
      :items="filtered"
      :sort-by="props.sortBy"
      class="bg-surface-2"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 15, title: '15' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="bg-surface-2 pa-n4">
          <v-toolbar-title class="bg-surface-2 ml-0">
            {{ smallScreen ? "" : toolbarTitle }}
          </v-toolbar-title>

          <table-flow v-if="props.flow" :name="props.flow"></table-flow>

          <v-text-field
            v-model="search"
            :label="searchTitle"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
          ></v-text-field>

          <copy-to-clipboard
            v-if="props.copy && !smallScreen"
            :filtered="filtered"
            :copyHeadersOrder="copyHeadersOrder"
            :copyHeadersCustoms="copyHeadersCustoms"
          ></copy-to-clipboard>

          <v-divider v-if="props.tableAdd" class="mx-4" inset vertical></v-divider>

          <table-dialog
            persistent
            no-click-animation
            :retain-focus="false"
            v-model="dialog"
            variant="Save"
            :disable="disableAdd"
            :confirm-disable="verified"
            :index="editedIndex"
            :loading="dialogLoading"
            @close="close"
            @confirm="save"
            :showBtn="props.tableAdd"
          >
            <component
              :is="props.tableDialogComponent"
              @verified="handleVerified"
              @save-data="handleSaveData"
              :componentProps="ComponentProps"
            ></component>
          </table-dialog>

          <slot name="table-dialog-add-edit"></slot>

          <table-dialog
            v-model="dialogDelete"
            variant="Delete"
            :deleteTMsg="props.deleteTMsg"
            :index="editedIndex"
            :loading="dialogDeleteLoading"
            @close="closeDelete"
            @confirm="deleteItemConfirm"
            :showBtn="false"
          >
          </table-dialog>
        </v-toolbar>

        <table-filters
          v-if="props.filters"
          :callback="props.filtersCallback"
          @filters="handleFilters"
        >
          <slot name="table-filters"></slot>
        </table-filters>
      </template>

      <template v-slot:item.custom="{ item }">
        <slot name="table-key-slot" :item="item"></slot>
      </template>

      <template v-slot:item.custom2="{ item }">
        <slot name="table-key-slot-2" :item="item"></slot>
      </template>

      <template v-slot:item.custom3="{ item }">
        <slot name="table-key-slot-3" :item="item"></slot>
      </template>

      <template v-slot:item.custom4="{ item }">
        <slot name="table-key-slot-4" :item="item"></slot>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip text="Edit this record.">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              v-if="props.tableEdit"
              variant="tonal"
              color="primary"
              size="small"
              v-bind="tooltip"
              @click="editItem(item)"
              icon="mdi-pencil"
              class="ma-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Remove this record.">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              v-if="props.tableDelete"
              variant="tonal"
              color="primary"
              size="small"
              v-bind="tooltip"
              @click="deleteItem(item)"
              icon="mdi-delete"
              class="ma-2"
            />
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>
