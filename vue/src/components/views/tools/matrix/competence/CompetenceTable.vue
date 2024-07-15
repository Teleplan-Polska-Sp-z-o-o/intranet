<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../../tools/DialogInput.vue";
import { useI18n } from "vue-i18n";
// import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import { CompetenceManager } from "../../../../../models/document/CompetenceManager";
import { useUserStore } from "../../../../../stores/userStore";

// const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
}>();

const manager = ref<CompetenceManager>(new CompetenceManager());

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = computed(() => {
  return `tools.matrix.tabs.${tab.value}.table`;
});

const headers = computed<any>(() => [
  { title: t(`${tPath.value}.header.name`), align: "start", key: "name" },
  { title: t(`${tPath.value}.header.actions`), key: "actions", sortable: false },
]);

const toolbarTitle = computed(() => {
  return t(`${tPath.value}.toolbar`);
});
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  try {
    if (!data) return;
    const formData: FormData = new FormData();

    formData.append("id", JSON.stringify(data.item.id));
    formData.append("name", JSON.stringify(data.model));
    const user = useUserStore().info();
    if (!user) throw new Error(`user evaluates to false.`);
    formData.append("issuer", JSON.stringify(user.username));

    reqData.value = formData;
  } catch (error) {
    console.error(`handleSaveData at CompetenceTable, ${error}`);
  }
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
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Name', property: 'name' }"
  >
  </crud-table>
</template>
