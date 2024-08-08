<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { IChip, IChips, ILevel, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { Chips } from "../../models/document/Chips";
import { DepartmentsManager } from "../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../models/document/CategoriesManager";
import { SubcategoriesManager } from "../../models/document/SubcategoriesManager";

const emit = defineEmits(["chips"]);

const props = defineProps<{
  table: ILevel | undefined;
  maxLevel: number;
  whereDocType?: TDocumentType;
}>();

const chips = ref<IChips>(new Chips());

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const departments = ref<Array<IChip> | null>(null);
const categories = ref<Array<IChip> | null>(null);
const subcategories = ref<Array<IChip> | null>(null);

onMounted(async () => (departments.value = await DepManager.get(undefined, props.whereDocType)));

const chipGroups = computed(() => [
  {
    id: 0,
    chipsIf: !!departments.value,
    chips: departments.value,
    get chipsModel() {
      return chips.value.departmentName;
    },
    set chipsModel(value) {
      chips.value.departmentName = value === undefined ? "" : value;
      chips.value.categoryName = "";
      chips.value.subcategoryName = "";
      //
      categories.value = null;
      if (chips.value.departmentName)
        CatManager.get(chips.value, props.whereDocType).then((cats) => {
          categories.value = cats;
          emit("chips", chips.value);
        });
      else emit("chips", chips.value);
    },
  },
  {
    id: 1,
    chipsIf: !!chips.value.departmentName,
    chips: categories.value,
    get chipsModel() {
      return chips.value.categoryName;
    },
    set chipsModel(value) {
      chips.value.categoryName = value === undefined ? "" : value;
      chips.value.subcategoryName = "";
      //
      subcategories.value = null;
      if (chips.value.categoryName)
        SubManager.get(chips.value, props.whereDocType).then((subs) => {
          subcategories.value = subs;
          emit("chips", chips.value);
        });
      else emit("chips", chips.value);
    },
  },
  {
    id: 2,
    chipsIf: !!chips.value.categoryName,
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

// when crud table add new folder to folder structure
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
    <v-timeline density="compact" align="start" side="end" truncate-line="start" class="ms-2 mt-2">
      <v-timeline-item dot-color="tertiary" icon="mdi-file-tree" size="large" fill-dot>
        <div class="d-flex flex-column justify-center align-center" style="height: 45.99px">
          <div class="text-body-1">{{ $t(`tools.chips.filterBy`) }}</div>
        </div>
      </v-timeline-item>

      <template v-for="group in chipGroups" :key="group.id">
        <v-timeline-item
          v-if="props.maxLevel >= group.id && group.chipsIf"
          dot-color="tertiary"
          size="small"
          :icon="`mdi-roman-numeral-${group.id + 1}`"
        >
          <div class="d-flex">
            <div>
              <v-fade-transition>
                <v-chip-group v-model="group.chipsModel" column color="secondary" class="pa-0">
                  <v-chip
                    v-if="group.chips && group.chips.length > 0"
                    v-for="c in group.chips"
                    :key="c.id"
                    :value="c.name"
                    variant="outlined"
                    filter
                    class="mt-0"
                  >
                    {{ c.name }}
                  </v-chip>
                  <v-chip v-else-if="group.chips && group.chips.length === 0" variant="text">
                    {{ $t(`tools.chips.empty`) }}
                  </v-chip>
                </v-chip-group>
              </v-fade-transition>
            </div>
          </div>
        </v-timeline-item>
      </template>
    </v-timeline>
  </v-card>
</template>

<style scoped lang="scss">
.v-timeline--dense .v-timeline-item__opposite {
  display: inline-block;
}

.v-timeline-item__opposite {
  flex: none;
}

/* line */
.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
  left: 143px;
}

.opposite-width-force {
  display: inline-block;
  width: 95px;
  text-align: right;
}
</style>
