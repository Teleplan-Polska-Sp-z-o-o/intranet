<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
// import { nodeConfig } from "../../../../../config/env";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import DCRStepper from "./DCRStepper.vue";
import { useUserStore } from "../../../../../stores/userStore";
import { IUser } from "../../../../../interfaces/user/UserTypes";
import { SimpleUser } from "../../../../../models/user/SimpleUser";
import DCRReview from "./DCRReview.vue";

const props = defineProps<{
  tab: string;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.dcr.table`;

const headers: any = [
  {
    title: t(`${tPath}.header.no`),
    align: "start",
    key: "no",
  },
  { title: t(`${tPath}.header.status`), key: "status" },
  { title: t(`${tPath}.header.priority`), key: "priority" },
  {
    title: t(`${tPath}.header.docxNumber`),
    key: "docxNumber",
  },
  {
    title: t(`${tPath}.header.docxRevision`),
    key: "docxRevision",
  },
  {
    title: t(`${tPath}.header.originator`),
    key: "originator",
  },
  {
    title: t(`${tPath}.header.checker`),
    key: "checker",
  },
  {
    title: t(`${tPath}.header.approver`),
    key: "approver",
  },
  { title: t(`${tPath}.header.review`), key: "custom", sortable: false, filterable: false },
  // { title: t(`${tPath}.header.dialog`), key: "custom2", sortable: false, filterable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const searchBy = ["no", "docxNumber", "docxRevision", "originator", "checker", "approver"];

const reqData = ref<FormData | null>(null);

const handleSaveData = (data: DocumentChangeTypes.Processing.ISaveData) => {
  if (!data) return;

  const user: IUser | false = useUserStore().info();
  if (!user) throw new Error("User evaluates to false, user's local store is empty");
  const normalizedUsername = new SimpleUser().build(user).getNormalizedUsername();

  const formData: FormData = new FormData();
  formData.append("issuer", JSON.stringify(normalizedUsername));
  formData.append("obj", JSON.stringify(data.dc));

  const filesLangs: Array<{
    langs: Array<string>;
  }> = [];
  for (const [index, file] of Object.entries(data.files)) {
    if (!file.file || !file.langs) continue;
    file.file.forEach((file) => {
      formData.append(`file_${index}`, file);
    });
    filesLangs.push({ langs: file.langs });
  }
  formData.append("files_langs", JSON.stringify(filesLangs));

  reqData.value = formData;
};

const manager = new DocumentChangeManager();

const loadItems = ref<true | undefined>(undefined);
const handleLoadItems = () => {
  loadItems.value = true;
  setTimeout(() => {
    loadItems.value = undefined;
  }, 0);
};

const route = useRoute();
watch(
  () => route.params.tab,
  (newRoute) => {
    if (newRoute === "dcr") handleLoadItems();
  }
);
</script>

<!-- :filters="true"
    :filtersCallback="pcnStore.callback" -->
<template>
  <crud-table
    :headers="headers"
    :sortBy="undefined"
    :searchBy="searchBy"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :reqData="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="DCRStepper"
    :tableDialogComponentProps="{}"
    flow=""
    :loadItems="loadItems"
    :copy="true"
  >
    <template v-slot:table-filters>
      <p-c-n-table-filters></p-c-n-table-filters>
    </template>
    <template v-slot:table-key-slot="{ item }">
      <d-c-r-review
        :item="item"
        :tab="props.tab"
        :manager="manager"
        @loadItems="handleLoadItems"
      ></d-c-r-review>
    </template>
  </crud-table>
</template>
