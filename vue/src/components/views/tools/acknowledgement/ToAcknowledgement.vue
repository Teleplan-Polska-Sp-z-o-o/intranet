<!-- <script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { useCrudStore } from "../../../../stores/crud/useCrudStore";
import { AcknowledgementTypes } from "../../../../interfaces/acknowledgement/AcknowledgementTypes";

const props = defineProps<{
  tab: string;
  instanceId: string;
}>();

const manager: ToAcknowledgementManager = new ToAcknowledgementManager();

const crudStore = useCrudStore();
crudStore.setManager(props.instanceId, manager);

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = computed(() => {
  return `tools.acknowledgement.tabs.${tab.value}.table`;
});

const headers: any = [
  { title: t(`${tPath}.header.documents`), key: "custom", minWidth: 200, sortable: false },
  { title: t(`${tPath}.header.description`), key: "description", minWidth: 200, sortable: false },
  { title: t(`${tPath}.header.quiz`), key: "custom2", sortable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = computed(() => {
  return t(`${tPath.value}.toolbar`);
});
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (formData: FormData) => {
  try {
    if (!formData) return;
    reqData.value = formData;
  } catch (error) {
    console.error(`handleSaveData at ToAcknowledgement, ${error}`);
  }
};
</script>

<template>
  <crud-table
    :headers="headers"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    @save-data="handleSaveData"
    :req-data="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="ToAcknowledgementForm"
    :tableDialogComponentProps="{}"
    :instanceId="props.instanceId"
    :tab="props.tab"
  >
    <template v-slot:table-key-slot="{ item }: { item: AcknowledgementTypes.IToAcknowledge }">
      <div class="text-body-2" v-if="item.documents.length">
        {{ item.documents.at(0)!.name }}
      </div>
    </template>
  </crud-table>
</template> -->
