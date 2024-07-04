<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { ProcessChangeRequestManager } from "../../../../../models/change/pcr/ProcessChangeRequestManager";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import PCRStepper from "./PCRStepper.vue";
import { IProcessChangeRequestBase } from "../../../../../interfaces/change/IProcessChangeRequestBase";
import { IUser } from "../../../../../interfaces/user/UserTypes";
import PCRView from "./PCRView.vue";
import PCRTableFilters from "./PCRTableFilters.vue";
import { useRoute } from "vue-router";
import { usePCRStore } from "../../../../../stores/change/pcrStore";
import { nodeConfig } from "../../../../../config/env";
import { IProcessChangeNotice } from "../../../../../interfaces/change/IProcessChangeNotice";

const emit = defineEmits(["responseStatus"]);

const props = defineProps<{
  tab: string;
}>();
// no: string | undefined;

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.pcr.table`;

const headers: any = [
  { title: t(`${tPath}.header.numberOfRequest`), align: "start", key: "numberOfRequest" },
  { title: t(`${tPath}.header.requestDate`), key: "requestDate" },
  { title: t(`${tPath}.header.program`), key: "program" },
  { title: t(`${tPath}.header.internalOrExternal`), key: "internalOrExternal" },
  { title: t(`${tPath}.header.requestedBy`), key: "requestedBy" },
  { title: t(`${tPath}.header.customerContactPerson`), key: "customerContactPerson" },
  { title: t(`${tPath}.header.customerContactEmail`), key: "customerContactEmail" },
  { title: t(`${tPath}.header.reconextContactPerson`), key: "reconextContactPerson" },
  { title: t(`${tPath}.header.reconextOwner`), key: "reconextOwner" },
  { title: t(`${tPath}.header.costOfImplementation`), key: "costOfImplementation", minWidth: 200 },
  { title: t(`${tPath}.header.dateNeeded`), key: "dateNeeded" },
  {
    title: t(`${tPath}.header.modelOrProcessImpacted`),
    key: "modelOrProcessImpacted",
    minWidth: 200,
  },
  { title: t(`${tPath}.header.impacts`), key: "impacts", minWidth: 200 },
  { title: t(`${tPath}.header.assessment`), key: "assessment" },
  { title: t(`${tPath}.header.approvedOrRejectedBy`), key: "approvedOrRejectedBy" },
  { title: t(`${tPath}.header.dedicatedDepartment`), key: "dedicatedDepartment" },
  { title: t(`${tPath}.header.riskAnalysis`), key: "riskAnalysis", minWidth: 200 },
  {
    title: t(`${tPath}.header.numberOfNotice`),
    key: "processChangeNotice.numberOfNotice",
  },
  { title: t(`${tPath}.header.closureDate`), key: "closureDate" },
  { title: t(`${tPath}.header.status`), key: "status" },
  { title: t(`${tPath}.header.viewPcr`), key: "custom2", sortable: false, filterable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<FormData | null>(null);

const handleSaveData = (
  data: IProcessChangeRequestBase & { requestedBy: IUser } & { requestId: number }
) => {
  if (!data) return;
  const { requestId, requestedBy, ...rest } = data;
  const base: IProcessChangeRequestBase = rest;
  const baseForJson = { ...base, dateNeeded: base.dateNeeded?.toString() };
  const formData: FormData = new FormData();

  formData.append("base", JSON.stringify(baseForJson));
  formData.append("requestedBy", JSON.stringify(requestedBy));
  formData.append("requestId", JSON.stringify(requestId));

  reqData.value = formData;
};

const manager = new ProcessChangeRequestManager();

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
    if (newRoute === "pcr") handleLoadItems();
  }
);

const searchBy = [
  "numberOfRequest",
  "requestDate",
  "program",
  "internalOrExternal",
  "requestedBy",
  "customerContactPerson",
  "customerContactEmail",
  "reconextContactPerson",
  "reconextOwner",
  "costOfImplementation",
  "dateNeeded",
  "modelOrProcessImpacted",
  "impacts",
  "assessment",
  "approvedOrRejectedBy",
  "dedicatedDepartment",
  "riskAnalysis",
  "processChangeNotice",
  "closureDate",
  "status",
];

const pcrStore = usePCRStore();
const copyHeadersOrder = [
  "numberOfRequest",
  "requestDate",
  "program=>programOrProject",
  "internalOrExternal",
  "requestedBy",
  "customerContactPerson",
  "customerContactEmail",
  "reconextContactPerson",
  "id=>pcrLink", // link
  "reconextOwner",
  "costOfImplementation",
  "dateNeeded",
  "modelOrProcessImpacted",
  "changeReason", // trim
  "changeDescription", // trim
  "impacts",
  "assessment",
  "approvedOrRejectedBy",
  "dedicatedDepartment",
  "riskAnalysis",
  "processChangeNotice",
  "closureDate",
  "status",
];

const copyHeadersCustoms = (headerKey: string, rowValue: string | object) => {
  switch (headerKey) {
    case "id":
      return `${nodeConfig.origin}/tool/change/browse/pcr/${rowValue as string}`;
    case "changeReason":
      return (rowValue as string).replace(/<[^>]+>/g, "").trim();
    case "changeDescription":
      return (rowValue as string).replace(/<[^>]+>/g, "").trim();
    case "processChangeNotice":
      return (rowValue as IProcessChangeNotice).numberOfNotice;
    default:
      return "no-case";
  }
};
</script>

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
    :tableDialogComponent="PCRStepper"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
    :copy="true"
    :copyHeadersOrder="copyHeadersOrder"
    :copyHeadersCustoms="copyHeadersCustoms"
    flow="pcr-flow"
    :loadItems="loadItems"
    :filters="true"
    :filtersCallback="pcrStore.callback"
  >
    <template v-slot:table-filters>
      <p-c-r-table-filters></p-c-r-table-filters>
    </template>
    <template v-slot:table-key-slot="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <p-c-r-view
        :tab="props.tab"
        :item="item"
        @loadItems="handleLoadItems"
        @responseStatus="handleResponseStatus"
      ></p-c-r-view>
    </template>
  </crud-table>
</template>
