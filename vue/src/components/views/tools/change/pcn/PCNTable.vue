<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import PCNStepper from "./PCNStepper.vue";
import { ProcessChangeNoticeManager } from "../../../../../models/change/pcn/ProcessChangeNoticeManager";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
  no: string | undefined;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.${tab.value}.table`;

const headers: any = [
  {
    title: t(`${tPath}.header.numberOfNotice`),
    align: "start",
    key: "processChangeNotice.numberOfNotice",
  },
  { title: t(`${tPath}.header.numberOfRequest`), key: "numberOfRequest" },
  { title: t(`${tPath}.header.reconextOwner`), key: "reconextOwner" },
  {
    title: t(`${tPath}.header.noticeDate`),
    key: "noticeDate",
  },
  {
    title: t(`${tPath}.header.modelOrProcessImpacted`),
    key: "modelOrProcessImpacted",
    minWidth: 200,
  },
  {
    title: t(`${tPath}.header.areDocumentationChangesRequired`),
    key: "processChangeNotice.areDocumentationChangesRequired",
  },
  {
    title: t(`${tPath}.header.isNewDocumentationRequired`),
    key: "processChangeNotice.isNewDocumentationRequired",
  },
  {
    title: t(`${tPath}.header.isCustomerApprovalRequired`),
    key: "processChangeNotice.isCustomerApprovalRequired",
  },
  { title: t(`${tPath}.header.status`), key: "processChangeNotice.status" },
  {
    title: t(`${tPath}.header.closureDate`),
    key: "processChangeNotice.closureDate",
  },
  { title: t(`${tPath}.header.viewPcn`), key: "custom2", sortable: false, filterable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<FormData | null>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  console.log(data);
  // const { requestId, requestedBy, ...rest } = data;
  // const base: IProcessChangeRequestBase = rest;
  // const baseForJson = { ...base, dateNeeded: base.dateNeeded?.toString() };
  // const formData: FormData = new FormData();

  // formData.append("base", JSON.stringify(baseForJson));
  // formData.append("requestedBy", JSON.stringify(requestedBy));
  // formData.append("requestId", JSON.stringify(requestId));

  // reqData.value = formData;
};

const manager = new ProcessChangeNoticeManager();

const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);

const loadItems = ref<true | false>(false);
const handleLoadItems = () => {
  loadItems.value = true;
  setTimeout(() => {
    loadItems.value = false;
  }, 0);
};
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'id', order: 'asc' }]"
    :searchBy="[
      'processChangeNotice.numberOfNotice',
      'numberOfNotice',
      'reconextOwner',
      'closureDate',
      'modelOrProcessImpacted',
    ]"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :reqData="reqData"
    :tableEdit="true"
    :tableDialogComponent="PCNStepper"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
    :copy="true"
    flow="pcn-flow"
    :loadItems="loadItems"
    :filters="true"
  >
    <template v-slot:table-filters>
      <p-c-r-table-filters></p-c-r-table-filters>
    </template>
    <template v-slot:table-key-slot="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <p-c-r-view
        :item="item"
        @loadItems="handleLoadItems"
        @responseStatus="handleResponseStatus"
      ></p-c-r-view>
    </template>
  </crud-table>
</template>
