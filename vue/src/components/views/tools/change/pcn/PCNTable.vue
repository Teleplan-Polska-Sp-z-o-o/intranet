<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import PCNStepper from "./PCNStepper.vue";
import PCNView from "./PCNView.vue";
import PCNTableFilters from "./PCNTableFilters.vue";
import { ProcessChangeNoticeManager } from "../../../../../models/change/pcn/ProcessChangeNoticeManager";
import { IProcessChangeNoticeFields } from "../../../../../interfaces/change/IProcessChangeNoticeFields";
import { IUser } from "../../../../../interfaces/user/IUser";
import { useRoute } from "vue-router";
import { usePCNStore } from "../../../../../stores/change/pcnStore";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
}>();
// no: string | undefined;

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
    title: t(`${tPath}.header.personDesignatedForImplementation`),
    key: "processChangeNotice.personDesignatedForImplementation",
  },
  {
    title: t(`${tPath}.header.noticeDate`),
    key: "closureDate",
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
    title: t(`${tPath}.header.engineeringDepartmentApproval`),
    key: "processChangeNotice.engineeringDepartmentApproval",
  },
  {
    title: t(`${tPath}.header.qualityDepartmentApproval`),
    key: "processChangeNotice.qualityDepartmentApproval",
  },
  {
    title: t(`${tPath}.header.dedicatedDepartmentApproval`),
    key: "processChangeNotice.dedicatedDepartmentApproval",
  },
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

const handleSaveData = (
  data: { fields: IProcessChangeNoticeFields } & { assesser: IUser } & { noticeId: number }
) => {
  console.log(data);
  if (!data) return;

  const { assesser, fields, noticeId } = data;
  const formData: FormData = new FormData();

  formData.append("assesser", JSON.stringify(assesser));
  formData.append("fields", JSON.stringify(fields));
  formData.append("noticeId", JSON.stringify(noticeId));

  reqData.value = formData;
};

const manager = new ProcessChangeNoticeManager();

const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);

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
    if (newRoute === "pcn") handleLoadItems();
  }
);

const pcnStore = usePCNStore();
</script>

<!-- :sortBy="[{ key: 'id', order: 'asc' }]" -->
<template>
  <crud-table
    :headers="headers"
    :sortBy="undefined"
    :searchBy="[
      'processChangeNotice.numberOfNotice',
      'numberOfNotice',
      'reconextOwner',
      'closureDate',
      'modelOrProcessImpacted',
      'processChangeNotice.personDesignatedForImplementation',
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
    :filtersCallback="pcnStore.callback"
  >
    <template v-slot:table-filters>
      <p-c-n-table-filters></p-c-n-table-filters>
    </template>
    <template v-slot:table-key-slot="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <p-c-n-view
        :item="item"
        @loadItems="handleLoadItems"
        @responseStatus="handleResponseStatus"
      ></p-c-n-view>
    </template>
  </crud-table>
</template>
