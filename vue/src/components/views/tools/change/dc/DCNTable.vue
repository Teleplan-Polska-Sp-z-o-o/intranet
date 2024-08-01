<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
// import { nodeConfig } from "../../../../../config/env";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";
import DCRReview from "./DCRReview.vue";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";

const props = defineProps<{
  tab: string;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.change.tabs.dcn.table`;
const headers: any = [
  {
    title: t(`${tPath}.header.no`),
    align: "start",
    key: "no",
  },
  { title: t(`${tPath}.header.status`), key: "custom2" },
  { title: t(`${tPath}.header.tags`), key: "custom3" },

  {
    title: t(`${tPath}.header.docxNumber`),
    key: "docxNumber",
  },
  {
    title: t(`${tPath}.header.docxRevision`),
    key: "docxRevision",
  },
  {
    title: t(`${tPath}.header.docxReference`),
    key: "docxReference",
  },
  {
    title: t(`${tPath}.header.registerer`),
    key: "registerer",
  },
  { title: t(`${tPath}.header.info`), key: "custom", sortable: false, filterable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const searchBy = [
  "no",
  "status",
  "tags",
  "docxNumber",
  "docxRevision",
  "docxReference",
  "registerer",
];

const manager = new DocumentChangeNoticeManager();

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
    if (newRoute === "dcn") handleLoadItems();
  }
);

const getColor = (status: DocumentChangeTypes.TStatus): string => {
  return DocumentChangeTypes.Processing.ETimelineElementColor[status];
};
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
    flow=""
    :loadItems="loadItems"
    :copy="true"
  >
    <template v-slot:table-filters>
      <p-c-n-table-filters></p-c-n-table-filters>
    </template>
    <template v-slot:table-key-slot-2="{ item }">
      <v-chip class="ms-0 me-2" :color="getColor(item.status)" size="small" label>{{
        item.status
      }}</v-chip>
    </template>
    <template v-slot:table-key-slot-3="{ item }">
      <v-chip class="ms-0 me-2" color="#F08080" size="small" label>{{
        item.tags ? JSON.parse(item.tags).join(", ") : "No tags"
      }}</v-chip>
    </template>
    <template v-slot:table-key-slot-4="{ item }">
      <span class="text-body-2">{{ item.docxNumber ? item.docxNumber : "N/A" }}</span>
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
