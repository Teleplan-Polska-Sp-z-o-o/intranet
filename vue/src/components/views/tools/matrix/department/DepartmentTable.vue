<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../../tools/DialogInput.vue";
import { useI18n } from "vue-i18n";
import { Endpoints } from "../../../../../config/axios/Endpoints";
import { useCrudFolderChipsStore } from "../../../../../stores/crud/useCrudFolderChipsStore";
import { Chips } from "../../../../../models/document/Chips";
import { useCrudStore } from "../../../../../stores/crud/useCrudStore";

const props = defineProps<{
  tab: string;
  quickAccess: boolean;
  instanceId: string;
}>();

const depManager: DepartmentsManager = new DepartmentsManager(
  Endpoints.DocumentDepartment,
  props.quickAccess,
  false
);
const catManager: DepartmentsManager = new DepartmentsManager(
  Endpoints.DocumentCategory,
  props.quickAccess,
  false
);
const subManager: DepartmentsManager = new DepartmentsManager(
  Endpoints.DocumentSubcategory,
  props.quickAccess,
  false
);

const crudStore = useCrudStore();
crudStore.setManager(props.instanceId, depManager);

const categoryName = ref<string | undefined>(undefined);
const departmentName = ref<string | undefined>(undefined);
const tableItem = ref<string>("departments");
const chipsStore = useCrudFolderChipsStore();
watch(
  () => chipsStore.getChips(props.instanceId).value,
  (chips: Chips) => {
    if (chips.categoryName) {
      crudStore.setManager(props.instanceId, subManager);
      tableItem.value = "subcategories";
    } else if (chips.departmentName) {
      crudStore.setManager(props.instanceId, catManager);
      tableItem.value = "categories";
    } else {
      crudStore.setManager(props.instanceId, depManager);
      tableItem.value = "departments";
    }

    categoryName.value = chips.categoryName;
    departmentName.value = chips.departmentName;
  },
  { deep: true }
);

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.matrix.tabs.${tab.value}.table`;

const headers = ref<any>([
  { title: t(`${tPath}.header.name`), align: "start", key: "name" },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
]);

const toolbarTitle = computed(() => {
  return t(`${tPath}.toolbar.${tableItem.value}`);
});
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;
  const rd: any = {
    id: data.item.id,
    name: data.model,
    categoryName,
    departmentName,
  };

  reqData.value = rd;
};

// const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    @save-data="handleSaveData"
    :req-data="reqData"
    :emitTableChange="true"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Name', property: 'name' }"
    :instanceId="props.instanceId"
    :tab="props.tab"
  >
  </crud-table>
</template>
