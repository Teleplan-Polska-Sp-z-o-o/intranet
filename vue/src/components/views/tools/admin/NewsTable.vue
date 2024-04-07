<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";
import { NewsManager } from "../../../../models/editor/NewsManager";
import NewsStepper from "./NewsStepper.vue";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../interfaces/common/IResponseStatus";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.admin.tabs.${tab.value}.table`;

const headers: any = [
  { title: t(`${tPath}.header.title`), align: "start", key: "title" },
  { title: t(`${tPath}.header.subtitle`), key: "subtitle" },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`${tPath}.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  const base = {
    ref: data.ref,
    permission: data.permission,
    title: data.title,
    subtitle: data.subtitle,
    content: data.content,
  };
  const bgImage: File = data.bgImage.at(0);

  const formData: any = new FormData();
  formData.append("base", JSON.stringify(base));
  formData.append("bgImage", bgImage);

  reqData.value = formData;
};

const manager = new NewsManager();

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
    :tableDialogComponent="NewsStepper"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
  >
  </crud-table>
</template>
