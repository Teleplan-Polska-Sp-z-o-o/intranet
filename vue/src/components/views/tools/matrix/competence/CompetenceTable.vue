<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { CompetenceManager } from "../../../../../models/document/CompetenceManager";
import { useCrudStore } from "../../../../../stores/crud/useCrudStore";
import { DocumentTypes } from "../../../../../interfaces/document/DocumentTypes";
import { useCrudFolderChipsStore } from "../../../../../stores/crud/useCrudFolderChipsStore";
import CompetenceForm from "./CompetenceForm.vue";

const props = defineProps<{
  tab: string;
  instanceId: string;
}>();

const manager: CompetenceManager = new CompetenceManager();

const crudStore = useCrudStore();
crudStore.setManager(props.instanceId, manager);

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = computed(() => {
  return `tools.matrix.tabs.${tab.value}.table`;
});

const headers = computed<any>(() => [
  { title: t(`${tPath.value}.header.code`), align: "start", key: "code" },
  { title: t(`${tPath.value}.header.position`), align: "start", key: "position" },
  { title: t(`${tPath.value}.header.name`), align: "start", key: "name" },
  {
    title: t(`${tPath.value}.header.folderStructure`),
    key: "custom",
    minWidth: 200,
    sortable: false,
  },
  { title: t(`${tPath.value}.header.actions`), key: "actions", sortable: false },
]);

const toolbarTitle = computed(() => {
  return t(`${tPath.value}.toolbar`);
});
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (competence: DocumentTypes.ICompetenceEntity) => {
  try {
    if (!competence) return;
    const formData: FormData = new FormData();
    competence.folderStructure = Object.values(
      useCrudFolderChipsStore().getChips(props.instanceId).value
    );
    formData.append("base", JSON.stringify(competence));
    reqData.value = formData;
  } catch (error) {
    console.error(`handleSaveData at CompetenceTable, ${error}`);
  }
};
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    @save-data="handleSaveData"
    :req-data="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="CompetenceForm"
    :tableDialogComponentProps="{}"
    :instanceId="props.instanceId"
    :tab="props.tab"
  >
    <template v-slot:table-key-slot="{ item }: { item: DocumentTypes.ICompetenceEntity }">
      <v-list-item
        class="pl-0"
        density="compact"
        v-for="(folder, index) in item.folderStructure"
        :key="index"
      >
        <v-list-item-title class="text-body-2"> {{ `${index + 1}) ${folder}` }}</v-list-item-title>
      </v-list-item>
    </template>
  </crud-table>
</template>
