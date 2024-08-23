<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
// import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import PCNStepper from "./PCNStepper.vue";
import PCNView from "./PCNView.vue";
import PCNTableFilters from "./PCNTableFilters.vue";
import { ProcessChangeNoticeManager } from "../../../../../models/change/pcn/ProcessChangeNoticeManager";
import { IProcessChangeNoticeFields } from "../../../../../interfaces/change/IProcessChangeNoticeFields";
import { IUser } from "../../../../../interfaces/user/UserTypes";
import { useRoute } from "vue-router";
import { usePCNStore } from "../../../../../stores/change/pcnStore";
import { nodeConfig } from "../../../../../config/env";
import { useCrudStore } from "../../../../../stores/crud/useCrudStore";

// const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  instanceId: string;
  tab: string;
}>();
// no: string | undefined;

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.pcn.table`;

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
  if (!data) return;

  const { assesser, fields, noticeId } = data;
  const formData: FormData = new FormData();

  formData.append("assesser", JSON.stringify(assesser));
  formData.append("fields", JSON.stringify(fields));
  formData.append("noticeId", JSON.stringify(noticeId));

  reqData.value = formData;
};

const manager = new ProcessChangeNoticeManager();

const crudStore = useCrudStore();
crudStore.setManager(props.instanceId, manager);

// const handleResponseStatus = (status: IResponseStatus) => {
//   try {
//     emit("responseStatus", status);
//   } catch (error) {
//     console.error(`PCNTable at handleResponseStatus, ${error}`);
//   }
// };

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

const copyHeadersOrder = [
  "processChangeNotice.numberOfNotice=>numberOfNotice",
  "processChangeNotice.numberOfRequest=>numberOfRequest",
  "closureDate=>noticeDate",
  "requestedBy=>requestApprovedBy",
  "id=>pcnLink",
  "processChangeNotice.personDesignatedForImplementation=>personDesignatedForImplementation",
  "changeReason=>requestChangeReason",
  "processChangeNotice.changeDescription=>noticeChangeDescription",
  "processChangeNotice.areDocumentationChangesRequired=>areDocumentationChangesRequired",
  "processChangeNotice.listOfDocumentationToChange=>listOfDocumentationToChange",
  "processChangeNotice.isNewDocumentationRequired=>isNewDocumentationRequired",
  "processChangeNotice.listOfDocumentationToCreate=>listOfDocumentationToCreate",
  "processChangeNotice.isCustomerApprovalRequired=>isCustomerApprovalRequired",
  "processChangeNotice.engineeringDepartmentApproval=>engineeringDepartmentApproval",
  "processChangeNotice.engineeringDepartmentApproverUsername=>engineeringDepartmentApproverUsername",
  "processChangeNotice.engineeringDepartmentApprovalDate=>engineeringDepartmentApprovalDate",
  "processChangeNotice.qualityDepartmentApproval=>qualityDepartmentApproval",
  "processChangeNotice.qualityDepartmentApproverUsername=>qualityDepartmentApproverUsername",
  "processChangeNotice.qualityDepartmentApprovalDate=>qualityDepartmentApprovalDate",
  "dedicatedDepartment=>requestDedicatedDepartment",
  "processChangeNotice.dedicatedDepartmentApproval=>dedicatedDepartmentApproval",
  "processChangeNotice.dedicatedDepartmentApproverUsername=>dedicatedDepartmentApproverUsername",
  "processChangeNotice.dedicatedDepartmentApprovalDate=>dedicatedDepartmentApprovalDate",
];

const copyHeadersCustoms = (headerKey: string, rowValue: string | boolean | object) => {
  switch (headerKey) {
    case "id":
      return `${nodeConfig.origin}/tool/change/browse/pcn/${rowValue as string}`;
    case "changeReason":
      return (rowValue as string).replace(/<[^>]+>/g, "").trim();
    case "processChangeNotice.changeDescription":
      return (rowValue as string).replace(/<[^>]+>/g, "").trim();
    case "processChangeNotice.areDocumentationChangesRequired":
      return (rowValue as boolean) ? "Yes" : "No";
    case "processChangeNotice.listOfDocumentationToChange":
      return (JSON.parse(rowValue as string) as Array<string>).join(", ");
    case "processChangeNotice.isNewDocumentationRequired":
      return (rowValue as boolean) ? "Yes" : "No";
    case "processChangeNotice.listOfDocumentationToCreate":
      return (JSON.parse(rowValue as string) as Array<string>).join(", ");
    case "processChangeNotice.engineeringDepartmentApproval":
      return (rowValue as boolean) ? "Yes" : "No";
    case "processChangeNotice.qualityDepartmentApproval":
      return (rowValue as boolean) ? "Yes" : "No";
    case "processChangeNotice.dedicatedDepartmentApproval":
      return (rowValue as boolean) ? "Yes" : "No";
    default:
      return "no-case";
  }
};
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
    :copy="true"
    :copyHeadersOrder="copyHeadersOrder"
    :copyHeadersCustoms="copyHeadersCustoms"
    flow="pcn-flow"
    :loadItems="loadItems"
    :filters="true"
    :filtersCallback="pcnStore.callback"
    :instanceId="props.instanceId"
  >
    <template v-slot:table-filters>
      <p-c-n-table-filters></p-c-n-table-filters>
    </template>
    <template v-slot:table-key-slot="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <p-c-n-view :tab="props.tab" :item="item" @loadItems="handleLoadItems"></p-c-n-view>
    </template>
  </crud-table>
</template>
