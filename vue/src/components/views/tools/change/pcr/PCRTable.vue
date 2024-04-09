<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { ProcessChangeRequestManager } from "../../../../../models/change/pcr/ProcessChangeRequestManager";
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
  { title: t(`${tPath}.header.numberOfRequest`), align: "start", key: "numberOfRequest" },
  { title: t(`${tPath}.header.requestDate`), key: "requestDate" },
  { title: t(`${tPath}.header.internalOrExternal`), key: "internalOrExternal" },
  { title: t(`${tPath}.header.reconextOwner`), key: "reconextOwner" },
  { title: t(`${tPath}.header.dedicatedDepartment`), key: "dedicatedDepartment" },
  { title: t(`${tPath}.header.program`), key: "program" },
  { title: t(`${tPath}.header.projectOfProgram`), key: "projectOfProgram" },
  { title: t(`${tPath}.header.dateNeeded`), key: "dateNeeded" },
  { title: t(`${tPath}.header.assessment`), key: "assessment" },
  { title: t(`${tPath}.header.approvedOrRejectedBy`), key: "approvedOrRejectedBy" },
  { title: t(`${tPath}.header.closureDate`), key: "closureDate" },
  { title: t(`${tPath}.header.viewPcr`), key: "viewPcr", sortable: false, filterable: false },
  {
    title: t(`${tPath}.header.numberOfNotice`),
    key: "numberOfNotice",
    sortable: false,
    filterable: false,
  },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  console.log(data);
};

const manager = new ProcessChangeRequestManager();

const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'numberOfRequest', order: 'asc' }]"
    :searchBy="[
      'numberOfRequest',
      'reconextOwner',
      'dedicatedDepartment',
      'program',
      'projectOfProgram',
      'assessment',
      'approvedOrRejectedBy',
    ]"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :reqData="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="'Something'"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
  >
    <template v-slot:table-key-slot="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <span v-show="false">{{ item }}</span>
    </template>
  </crud-table>
</template>
