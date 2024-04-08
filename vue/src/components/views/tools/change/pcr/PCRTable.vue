<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { PCRManager } from "../../../../../models/change/pcr/PCRManager";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.${tab.value}.table`;

const headers: any = [
  { title: t(`${tPath}.header.title`), align: "start", key: "title" },
  { title: t(`${tPath}.header.subtitle`), key: "subtitle" },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  console.log(data);
};

const manager = new PCRManager();

const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'title', order: 'asc' }]"
    :searchBy="['title', 'subtitle']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :reqData="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="'NewsStepper'"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
  >
  </crud-table>
</template>
