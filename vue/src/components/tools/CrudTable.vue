<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from "vue";
import TableDialog from "./TableDialog.vue";
import TableFlow from "./TableFlow.vue";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import CopyToClipboard from "./CopyToClipboard.vue";
import TableFilters from "./TableFilters.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const props = defineProps<{
  headers: any;
  sortBy: Array<{ key: string; order?: boolean | "asc" | "desc" }> | undefined;

  searchBy: Array<string>; // header keys
  toolbarTitle: string;
  searchTitle?: string;

  manager: any;
  reqData?: any;

  chips?: any;
  emitTableChange?: true;
  disableAdd?: boolean;

  tableAdd?: true;
  tableDelete?: true;
  tableEdit?: true;

  tableDialogComponent?: any;
  tableDialogComponentProps?: any;

  copy?: true;
  flow?: string; // pdf name

  loadItems?: true;

  filters?: boolean;
  filtersCallback?: Function;
}>();

const emit = defineEmits(["save-data", "emit-table-change", "responseStatus"]);

const headers = ref<any>(props.headers);

const items = ref<Array<any>>([]);
const manager = ref<any>(props.manager);
const chips = ref<any>(props.chips);

const load = async (log?: boolean) => {
  items.value = await manager.value.get(chips.value);
  if (log) console.log(items.value);
};

// onMounted(() => load(true));
if (items.value.length === 0) {
  load();
}

const filtersCallback = ref<{ callback: Function } | null>(null);

const toolbarTitle = ref<string>(props.toolbarTitle);
const search = ref<string>("");
const searchTitle = ref<string>(props.searchTitle ? props.searchTitle : "Search");
const filtered = computed(() => {
  const itemsFiltered = filtersCallback.value?.hasOwnProperty("callback")
    ? (filtersCallback.value?.callback(items.value) as Array<any>)
    : items.value;

  if (search.value) {
    return itemsFiltered.filter((item: any) => {
      for (const key of props.searchBy) {
        const value = item[key]?.toLowerCase();
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
    editedItem: editedItem.value,
  };
});
const editedIndex = ref<number>(-1);

const loadItems = computed(() => !!props.loadItems);

watch(loadItems, (newLoad) => {
  if (newLoad === true) {
    load();
  }
});

const reqData = ref<any>(props.reqData);

const disableAdd = ref<boolean>(props.disableAdd === undefined ? false : props.disableAdd);

const responseStatus = ref<IResponseStatus | null>(null);

watchEffect(() => {
  emit("responseStatus", responseStatus.value);
});

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
  [() => props.manager, () => props.chips],
  async ([newManager, newChips]) => {
    manager.value = newManager;
    chips.value = newChips;
    load();
  },
  { deep: true }
);

const deleteItem = async (item: any) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};
const editItem = (item: any) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  dialogLoading.value = false;

  nextTick(() => {
    editedItem.value = { ...item.value };
    editedIndex.value = -1;
  });
};

const closeDelete = async () => {
  dialogDelete.value = false;

  nextTick(() => {
    editedItem.value = { ...item.value };
    editedIndex.value = -1;
  });
};

const deleteItemConfirm = async () => {
  try {
    dialogDeleteLoading.value = true;
    responseStatus.value = await manager.value.delete(editedItem.value.id, true);
    if (props.emitTableChange) emit("emit-table-change");
    load();
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  } finally {
    dialogDeleteLoading.value = false;
    closeDelete();
  }
};

const save = async () => {
  try {
    const data: any = reqData.value;

    dialogLoading.value = true;
    if (editedIndex.value > -1) responseStatus.value = await manager.value.put(data, true);
    else responseStatus.value = await manager.value.post(data, true);
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  } finally {
    load();
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
            delete-t-msg="deleteDocumentConfirmation"
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
