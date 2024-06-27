<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IChip, IChips, ILevel, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { Chips } from "../../models/document/Chips";
import { DepartmentsManager } from "../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../models/document/CategoriesManager";
import { SubcategoriesManager } from "../../models/document/SubcategoriesManager";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["chips"]);

const props = defineProps<{
  table: ILevel | undefined;
  maxLevel: number;
  departmentsSubtitle?: string;
  programsSubtitle?: string;
  workstationsSubtitle?: string;
  bothSubtitles?: boolean;
  whereDocType?: TDocumentType;
}>();

const chips = ref<IChips>(new Chips());

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const departments = ref<Array<IChip> | null>(null);
const categories = ref<Array<IChip> | null>(null);
const subcategories = ref<Array<IChip> | null>(null);

(async () => {
  try {
    departments.value = await DepManager.get(undefined, props.whereDocType);
  } catch (error) {
    console.log(error);
  }
})();

const { t } = useI18n();

const chipGroups = computed(() => [
  {
    id: 0,
    subtitle: props.bothSubtitles
      ? `${t(`tools.chips.departments`)} / ${t(`tools.chips.${props.departmentsSubtitle}`)}`
      : t(`tools.chips.${props.departmentsSubtitle ?? "departments"}`),
    chipsIf: departments.value,
    chips: departments.value,
    get chipsModel() {
      return chips.value.departmentName;
    },
    set chipsModel(value) {
      chips.value.departmentName = value === undefined ? "" : value;
      chips.value.categoryName = "";
      chips.value.subcategoryName = "";
      emit("chips", chips.value);
    },
  },
  {
    id: 1,
    subtitle: props.bothSubtitles
      ? `${t(`tools.chips.programs`)} / ${t(`tools.chips.${props.programsSubtitle}`)}`
      : t(`tools.chips.${props.programsSubtitle ?? "programs"}`),
    chipsIf: chips.value.departmentName,
    chips: categories.value,
    get chipsModel() {
      return chips.value.categoryName;
    },
    set chipsModel(value) {
      chips.value.categoryName = value === undefined ? "" : value;
      chips.value.subcategoryName = "";
      emit("chips", chips.value);
    },
  },
  {
    id: 2,
    subtitle: props.bothSubtitles
      ? `${t(`tools.chips.workstations`)} / ${t(`tools.chips.${props.workstationsSubtitle}`)}`
      : t(`tools.chips.${props.workstationsSubtitle ?? "workstations"}`),
    chipsIf: chips.value.categoryName,
    chips: subcategories.value,
    get chipsModel() {
      return chips.value.subcategoryName;
    },
    set chipsModel(value) {
      chips.value.subcategoryName = value === undefined ? "" : value;
      emit("chips", chips.value);
    },
  },
]);

watch(
  chips.value,
  async (chips) => {
    if (chips.categoryName) subcategories.value = await SubManager.get(chips, props.whereDocType);
    if (chips.departmentName) categories.value = await CatManager.get(chips, props.whereDocType);
  },
  { deep: true }
);

watch(
  () => props.table,
  async (tableLvl) => {
    if (tableLvl === undefined) return;

    switch (tableLvl as ILevel) {
      case ILevel.Dep:
        departments.value = await DepManager.get(undefined, props.whereDocType);
        break;
      case ILevel.Cat:
        categories.value = await CatManager.get(chips.value, props.whereDocType);
        break;
      case ILevel.Sub:
        subcategories.value = await SubManager.get(chips.value, props.whereDocType);
        break;
    }
  }
);
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <template v-for="(group, index) in chipGroups" :key="group.id">
      <v-card-text
        v-if="props.maxLevel >= group.id && !!group.chipsIf"
        :class="index !== 0 ? 'pt-0' : ''"
      >
        <v-card-subtitle class="text-subtitle-1">
          <v-icon size="20">mdi-tag</v-icon> {{ group.subtitle }}
        </v-card-subtitle>
        <v-chip-group v-model="group.chipsModel" column color="secondary">
          <v-chip v-for="c in group.chips" :key="c.id" :value="c.name" variant="outlined" filter>
            {{ c.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </template>
  </v-card>
</template>
