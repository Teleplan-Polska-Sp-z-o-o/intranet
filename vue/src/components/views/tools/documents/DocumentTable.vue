<script setup lang="ts">
import { ref, watch } from "vue";
import { TDocumentType } from "../../../../interfaces/document/DocumentTypes";
import { DocumentManager } from "../../../../models/document/DocumentManager";
import CrudTable from "../../../tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
import { DocumentEntity } from "../../../../models/document/DocumentEntity";
import { IDocumentEntity } from "../../../../interfaces/document/IDocumentEntity";
import { useCrudTypeChipsStore } from "../../../../stores/crud/useCrudTypeChipsStore";
import { useCrudStore } from "../../../../stores/crud/useCrudStore";

const props = defineProps<{
  tab: string;
  documentType?: TDocumentType[];
  quickAccess?: boolean;
  instanceId: string;
}>();

const manager: DocumentManager = new DocumentManager(
  props.documentType ?? props.instanceId,
  true,
  props.quickAccess
);
const crudStore = useCrudStore();
crudStore.setManager(props.instanceId, manager);

const { t } = useI18n();
const tPath = `tools.documents`; // tabs.${props.tab}
const headers: any = [
  { title: t(`${tPath}.table.header.name`), align: "start", key: "name", minWidth: 200 },
  { title: t(`${tPath}.table.header.description`), key: "description", minWidth: 200 },
  {
    title: t(`${tPath}.table.header.view_document.name`),
    key: "custom",
    minWidth: 200,
    sortable: false,
    filterable: false,
  },
  {
    title: t(`${tPath}.table.header.quick.name`),
    key: "custom2",
    sortable: false,
    filterable: false,
  },
];

const toolbarTitle = t(`${tPath}.tabs.${props.tab}.table.toolbar`);
const searchTitle = t(`tools.common.search`);
const quickAddTooltip = t(`${tPath}.table.header.quick.tooltip_add`);
const quickRemoveTooltip = t(`${tPath}.table.header.quick.tooltip_remove`);
const languageTooltip = t(`${tPath}.table.header.view_document.tooltip`);

const getHref = (itemType: TDocumentType, file: Array<string>): string => {
  return `/tool/documents/${itemType}/${file.at(0)}/${file.at(1)}/${file.at(2)}`;
};

// const crudStore = useCrudStore();
watch(
  () => useCrudTypeChipsStore().getTypes(props.instanceId),
  () => {
    crudStore.loadItems(props.instanceId);
  },
  { deep: true }
);

const loading = ref<Map<number, boolean>>(new Map());
const isLoading = (itemId: number): boolean => {
  return !!loading.value.get(itemId);
};
const toggleQuickAccess = async (itemId: number): Promise<void> => {
  // const crudStore = useCrudStore();
  loading.value.set(itemId, true);
  const result = await manager.toggleQuickAccess(itemId, true);
  if (result) crudStore.loadItems(props.instanceId);
  loading.value.delete(itemId);
};
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name', 'description']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    :instanceId="props.instanceId"
    :tab="props.tab"
  >
    <template v-slot:table-key-slot="{ item }: { item: IDocumentEntity }">
      <div class="mt-2">
        <template v-for="language in DocumentEntity.translateLanguages(item)">
          <v-tooltip :text="languageTooltip">
            <template v-slot:activator="{ props }">
              <v-chip
                v-bind="props"
                class="me-2 mb-2"
                color="primary"
                prepend-icon="mdi-open-in-new"
                :href="getHref(item.type, language.value)"
                target="_blank"
                >{{ language.title }}</v-chip
              >
            </template>
          </v-tooltip>
        </template>
      </div>
    </template>
    <template v-slot:table-key-slot-2="{ item }: { item: IDocumentEntity }">
      <v-tooltip :text="item.isQuickAccess ? quickRemoveTooltip : quickAddTooltip">
        <template v-slot:activator="{ props }">
          <v-btn
            :variant="item.isQuickAccess ? 'tonal' : 'outlined'"
            width="84.03px"
            height="32px"
            size="small"
            color="warning"
            rounded="xl"
            class="my-2"
            v-bind="props"
            @click="() => toggleQuickAccess(item.id)"
            :loading="isLoading(item.id)"
          >
            <v-icon :icon="item.isQuickAccess ? 'mdi-star' : 'mdi-star-outline'" size="large" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </crud-table>
</template>
