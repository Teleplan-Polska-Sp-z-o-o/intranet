<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { IChip, ILevel, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { Chips } from "../../models/document/Chips";
import { DepartmentsManager } from "../../models/document/DepartmentsManager";
import { Endpoints } from "../../config/axios/Endpoints";
import { EDocumentType } from "../../interfaces/document/DocumentTypes";
import { useCrudFolderChipsStore } from "../../stores/crud/useCrudFolderChipsStore";
import { useCrudTypeChipsStore } from "../../stores/crud/useCrudTypeChipsStore";

// const emit = defineEmits(["chips", "type"]);

const props = defineProps<{
  /**
   * import { v4 as uuidv4 } from "uuid";
   * Result of uuidv4()
   *
   * Connect filters with crud table
   */
  instanceId: string;
  table?: ILevel;
  maxLevel: number;
  /**
   * True value limit search of departments to these
   * where quick access documents are related with the user
   */
  quickAccess?: boolean;
  /**
   * Boolean value enables or disables filter for doc type:
   *
   * True at first set all possible document types and enables type filters, will add document relation to connect documents with type
   * False omit document type filters and will not add document relation to query which will result in returning all records
   *
   * TDocumentType will limit received documents only to this type also disable type filters
   *
   */
  whereDocType: TDocumentType[] | boolean;
}>();

const typesStore = useCrudTypeChipsStore();
const docTypeOptions = typesStore.TYPES;
const whereDocType = Array.isArray(props.whereDocType)
  ? props.whereDocType
  : props.whereDocType === true
  ? docTypeOptions
  : false;

const depManager = new DepartmentsManager(
  Endpoints.DocumentDepartment,
  props.quickAccess,
  whereDocType
);
const catManager = new DepartmentsManager(
  Endpoints.DocumentCategory,
  props.quickAccess,
  whereDocType
);
const subManager = new DepartmentsManager(
  Endpoints.DocumentSubcategory,
  props.quickAccess,
  whereDocType
);

const chips = ref<Chips>(new Chips());
const departments = ref<Array<IChip> | null>(null);
const categories = ref<Array<IChip> | null>(null);
const subcategories = ref<Array<IChip> | null>(null);

const docTypes: Ref<TDocumentType[]> = ref<TDocumentType[]>(docTypeOptions);

const emitTypes = (value: TDocumentType[]) => {
  typesStore.emitChange(props.instanceId, value);
};
const folderStore = useCrudFolderChipsStore();
const emitFolders = (value: Chips) => {
  folderStore.emitChange(props.instanceId, value);
};

const chipGroups = computed(() => [
  {
    id: 0,
    chipsIf: !!departments.value,
    chips: departments.value,
    get chipsModel() {
      return chips.value.departmentName;
    },
    set chipsModel(value) {
      chips.value.departmentName = value;
      chips.value.categoryName = undefined;
      chips.value.subcategoryName = undefined;
      //
      categories.value = null;
      subcategories.value = null;
      catManager
        .get(chips.value, false, props.whereDocType === false ? false : docTypes.value)
        .then((cats) => {
          categories.value = cats;
          // emit("chips", chips.value);
          emitFolders(chips.value);
        });
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
      chips.value.categoryName = value;
      chips.value.subcategoryName = undefined;
      //
      subcategories.value = null;
      subManager
        .get(chips.value, false, props.whereDocType === false ? false : docTypes.value)
        .then((subs) => {
          subcategories.value = subs;
          // emit("chips", chips.value);
          emitFolders(chips.value);
        });
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
      chips.value.subcategoryName = value;
      // emit("chips", chips.value);
      emitFolders(chips.value);
    },
  },
]);

watch(
  docTypes,
  async (selected) => {
    emitTypes(selected);
    chips.value = new Chips();
    emitFolders(chips.value);
    categories.value = null;
    subcategories.value = null;
    //

    departments.value = await depManager.get(chips.value, props.quickAccess, selected);
  },
  { immediate: true }
);

const normalizedType = (type: TDocumentType) => {
  switch (type) {
    case EDocumentType.MSD:
      return "Management System";
    case EDocumentType.Visual:
      return "Visual Aid";

    default:
      return type;
  }
};
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-timeline density="compact" align="start" side="end" truncate-line="both" class="ms-2 mt-2">
      <v-timeline-item
        v-if="props.whereDocType === true"
        dot-color="tertiary"
        icon="mdi-file-question-outline"
        fill-dot
      >
        <div class="d-flex flex-column">
          <div class="text-body-1" style="margin-bottom: 6.99px">
            {{ $t(`tools.chips.filterByType`) }}
          </div>
          <div>
            <v-chip-group v-model="docTypes" multiple column color="secondary" class="pa-0">
              <v-chip
                v-for="type in docTypeOptions"
                :value="type"
                :variant="docTypes.includes(type) ? undefined : 'outlined'"
                filter
                label
                class="mt-0 mb-2"
                density="comfortable"
              >
                {{ normalizedType(type) }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-timeline-item>

      <v-timeline-item
        dot-color="tertiary"
        icon="mdi-file-tree"
        fill-dot
        style="--v-timeline-line-inset: "
      >
        <div class="d-flex flex-column justify-center align-center" style="height: 37.99px">
          <div class="text-body-1">
            {{ $t(`tools.chips.filterByFolder`) }}
          </div>
        </div>
      </v-timeline-item>
      <template v-for="group in chipGroups" :key="group.id">
        <v-expand-transition>
          <v-timeline-item
            v-if="props.maxLevel >= group.id && group.chipsIf"
            dot-color="tertiary"
            size="small"
            :icon="`mdi-roman-numeral-${group.id + 1}`"
          >
            <div class="d-flex">
              <div>
                <v-chip-group v-model="group.chipsModel" column color="secondary" class="pa-0">
                  <v-fade-transition group hide-on-leave>
                    <v-chip
                      v-if="group.chips && group.chips.length > 0"
                      v-for="c in group.chips"
                      :key="c.id"
                      :value="c.name"
                      :variant="group.chipsModel === c.name ? undefined : 'outlined'"
                      filter
                      label
                      density="comfortable"
                      class="mt-0 mb-2"
                    >
                      {{ c.name }}
                    </v-chip>
                  </v-fade-transition>

                  <v-chip
                    v-if="group.chips === null"
                    variant="text"
                    density="comfortable"
                    label
                    class="mt-0 mb-2"
                  >
                  </v-chip>

                  <v-fade-transition>
                    <v-chip
                      v-if="group.chips && group.chips.length === 0"
                      variant="text"
                      :disabled="true"
                      class="mt-0 mb-2"
                      density="comfortable"
                    >
                      {{ $t(`tools.chips.empty`) }}
                    </v-chip>
                  </v-fade-transition>
                </v-chip-group>
              </div>
            </div>
          </v-timeline-item>
        </v-expand-transition>
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

.v-timeline--vertical.v-timeline {
  row-gap: 0;
}
</style>
