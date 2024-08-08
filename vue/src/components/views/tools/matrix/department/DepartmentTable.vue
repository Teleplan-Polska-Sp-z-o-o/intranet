<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { IChips, ILevel } from "../../../../../interfaces/document/DocumentTypes";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
// import CrudChipTable from "../../../../../components/tools/CrudChipTable.vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../../tools/DialogInput.vue";
import { useI18n } from "vue-i18n";
// import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: IChips;
  tab: string;
}>();

const level = ref<ILevel>(ILevel.Dep);
const manager = ref<DepartmentsManager | CategoriesManager | SubcategoriesManager>(
  new DepartmentsManager()
);

const emitTableChange = () => {
  emit("table", level.value);
};

const chips = ref<IChips>(props.chips);

const tableItem = ref<string>("departments");

watch(
  () => [props.chips?.departmentName, props.chips?.categoryName, props.chips?.subcategoryName],
  ([dep, cat, _sub]) => {
    if (cat) {
      level.value = ILevel.Sub;
      manager.value = new SubcategoriesManager();
      tableItem.value = "subcategories"; // prev "workstations"
    } else if (dep) {
      level.value = ILevel.Cat;
      manager.value = new CategoriesManager();
      tableItem.value = "categories"; // prev "programs"
    } else {
      level.value = ILevel.Dep;
      manager.value = new DepartmentsManager();
      tableItem.value = "departments"; // prev "departments"
    }

    chips.value.departmentName = dep === undefined ? "" : dep;
    chips.value.categoryName = cat === undefined ? "" : cat;
    chips.value.subcategoryName = "";
  }
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
    categoryName: chips.value.categoryName,
    departmentName: chips.value.departmentName,
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
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :chips="chips"
    :emitTableChange="true"
    @emit-table-change="emitTableChange"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Name', property: 'name' }"
  >
  </crud-table>
</template>
