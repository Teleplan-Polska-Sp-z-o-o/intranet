<script setup lang="ts">
import { ref } from "vue";
import { IChips, IFileItem } from "../../../../../interfaces/document/DocumentTypes";
// import { useI18n } from "vue-i18n";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "../../../../../models/document/DocumentEntity";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import Stepper from "./Stepper.vue";
import { useI18n } from "vue-i18n";
import { watchEffect } from "vue";
// import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";

// dictionary
// const { t } = useI18n();

// const tableAdd = computed(() => t("tools.matrix.documents.add_button"));
// const tableItem = computed<string>(() => t("tools.documents.name"));

const props = defineProps<{
  chips: IChips;
  tab: string;
}>();

// const chips = ref<IChips>(props.chips);

// watch(
//   () => props.chips,
//   async (newChips) => {
//     chips.value = newChips;
//   },
//   { deep: true }
// );

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.matrix.tabs.${tab.value}.table`;

const headers: any = [
  { title: t(`${tPath}.header.name`), align: "start", key: "name", minWidth: 200 },
  { title: t(`${tPath}.header.type`), align: "start", key: "type" },
  { title: t(`${tPath}.header.confidentiality`), key: "confidentiality" },
  { title: t(`${tPath}.header.description`), key: "description", sortable: false },
  { title: t(`${tPath}.header.language`), key: "custom", minWidth: 150, sortable: false },
  { title: t(`${tPath}.header.revision`), key: "revision" },
  { title: t(`${tPath}.header.folderStructure`), key: "custom2", minWidth: 200, sortable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const handleSaveData = (data: any) => {
  const base = new DocumentEntity();
  base.ref = data.ref;
  base.type = data.type;
  base.name = data.name;
  base.description = data.description;
  base.revision = data.revision;
  base.confidentiality = data.confidentiality;
  base.competences = data.competences;

  base.folderStructure = Object.values(props.chips);
  handleReqData(base, data.files);
};

const manager = new DocumentManager();

const reqData = ref<any>(null);

const handleReqData = (base: Partial<IDocumentEntity>, files: Array<IFileItem>): void => {
  const formData: any = new FormData();

  formData.append("base", JSON.stringify(base));
  formData.append("files", JSON.stringify(files));

  interface Langs {
    langs: Array<string>;
  }

  const filesLangs: Array<Langs> = [];

  files.forEach((file: IFileItem) => {
    formData.append(`file_${file.id}`, file.file?.at(0));

    filesLangs.push({
      langs: file.langs as Array<string>,
    });
  });

  formData.append(`files_langs`, JSON.stringify(filesLangs));

  reqData.value = formData;
};

const languages = (item: IDocumentEntity) => {
  return item?.languages.map((lang: string) => ({
    title: lang
      .split("_")
      .map((code: string) => code)
      .join(", "),
  }));
};
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name', 'type', 'description']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :disableAdd="undefined"
    :chips="props.chips"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="Stepper"
    :tableDialogComponentProps="{}"
  >
    <template v-slot:table-key-slot="{ item }: { item: IDocumentEntity }">
      <v-list-item
        class="pl-0"
        density="compact"
        v-for="(lang, index) in languages(item)"
        :key="index"
      >
        <v-list-item-title class="text-body-2">
          {{ `${index + 1}) ${lang.title}` }}</v-list-item-title
        >
      </v-list-item>
    </template>
    <template v-slot:table-key-slot-2="{ item }: { item: IDocumentEntity }">
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
