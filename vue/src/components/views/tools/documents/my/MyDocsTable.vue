<script setup lang="ts">
import { ref, watch } from "vue";
// import { ResponseStatus } from "../../../../models/common/ResponseStatus";
import { IChips, IChip, ILevel } from "../../../../../interfaces/document/DocumentTypes";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: IChips | undefined;
}>();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const documents = ref<Array<IChip>>([]);

const level = ref<ILevel>(ILevel.Dep);
const manager = ref<DepartmentsManager | CategoriesManager | SubcategoriesManager>(DepManager);

const department = ref<string | undefined>(undefined);
const category = ref<string | undefined>(undefined);
const subcategory = ref<string | undefined>(undefined);

const tableItem = ref<string>("Department");

watch(
  () => [props.chips?.departmentName, props.chips?.categoryName, props.chips?.subcategoryName],
  ([dep, cat, sub]) => {
    const reqData: any = {
      categoryName: cat,
      departmentName: dep,
    };

    if (sub) {
      (async () => {
        try {
          tableItem.value = "Document";
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (cat) {
      (async () => {
        try {
          documents.value = await SubManager.get(reqData);
          level.value = ILevel.Sub;
          manager.value = SubManager;
          tableItem.value = "Workstation";
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (dep) {
      (async () => {
        try {
          documents.value = await CatManager.get(reqData);
          level.value = ILevel.Cat;
          manager.value = CatManager;
          tableItem.value = "Program";
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      (async () => {
        try {
          documents.value = await DepManager.get();
          level.value = ILevel.Dep;
          manager.value = DepManager;
          tableItem.value = "Department";
        } catch (error) {
          console.log(error);
        }
      })();
    }

    department.value = dep;
    category.value = cat;
    subcategory.value = sub;
  }
);

// const responseStatus = ref<ResponseStatus | null>(null);

const headers: any = [
  {
    title: "Name",
    align: "start",
    key: "name",
  },
  { title: "Description", key: "description" },
  { title: "Competence", key: "competence" },
  { title: "Favorite", key: "favorite", sortable: false },
];

const search = ref<string>("");

const addToFavorites = (item: any) => {
  console.log(item);
  // add logic
};
</script>

<template>
  <v-card class="rounded-xl elevation-0">
    <v-data-table
      :headers="headers"
      :items="documents"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      :search="search"
      class="bg-surface-2"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="pa-n4">
          <v-toolbar-title class="ml-0">{{ $t(`tools.documents.name`) }}</v-toolbar-title>
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="tonal"
          color="tertiary"
          size="small"
          @click="addToFavorites(item)"
          icon="mdi-pencil"
          class="ma-2"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
I
