<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DocumentCreatorManager } from "../../../../../../../../models/document/creator/CreatorManager";
import { IDraftEntity } from "../../../../../../../../models/document/creator/IDraftEntity";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const router = useRouter();
const route = useRoute();
const manager = new DocumentCreatorManager();
const store = useStepperStore();
const search = ref<string>("");

function deepSafeParse<T>(item: unknown): T {
  try {
    if (typeof item === "string") {
      return deepSafeParse(JSON.parse(item)); // Parse the string and recursively process it
    } else if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // Recursively process each item in the array
        return item.map((element) => deepSafeParse(element)) as unknown as T;
      } else {
        // Recursively process each key-value pair in the object
        return Object.entries(item).reduce((acc, [key, value]) => {
          (acc as Record<string, unknown>)[key] = deepSafeParse(value);
          return acc;
        }, {} as Record<string, unknown>) as T;
      }
    }
    return item as T; // Return as-is if not a string or object
  } catch {
    return item as T; // Return as-is if parsing fails
  }
}

const headers = computed<object[]>(() => {
  return [
    { title: "Id", align: "start", key: "id", value: "id" },
    { title: "Name", align: "start", key: "name", value: "name" },
    {
      title: "Title",
      align: "start",
      key: "title",
      value: (item: IDraftEntity) => {
        try {
          return deepSafeParse<IDraftEntity>(item).stepper.body.windows[2].model.title;
        } catch (error) {
          console.error(`Error at getting value of stepper title: ${error}. Returning "n/a"`);
          return "n/a";
        }
      },
    },
    { title: "Actions", align: "start", key: "actions", value: "actions", sortable: false },
  ];
});
const drafts = ref<IDraftEntity[]>([]);

const editDraft = (item: IDraftEntity) => {
  const stepper = deepSafeParse<IDraftEntity>(item).stepper;
  store.setStepper({
    stepper,
    navigation: {
      router,
      path: `/tool/matrix/browse/documents/creator/new/${item.id}`,
    },
  });
};

const openedItem = ref<IDraftEntity | null>(null);

const dialogDelete = ref<boolean>(false);
const openDeleteDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogDelete.value = true;
};
const closeDeleteDialog = () => {
  openedItem.value = null;
  dialogDelete.value = false;
};
const deleteDraftConfirm = async () => {
  if (openedItem.value) {
    await manager.delete(openedItem.value.id, true); // delete
    openedItem.value = null;

    drafts.value = await manager.get();
    dialogDelete.value = false;
  }
};

const language = ref<string>("");
const languageOptions = ref<
  {
    nameISO3166: string; // ISO 3166 name
    codeISO3166_1_A2: string; // ISO 3166-1 A-2
  }[]
>([
  {
    nameISO3166: "Poland",
    codeISO3166_1_A2: "PL",
  },
  {
    nameISO3166: "Czech",
    codeISO3166_1_A2: "CZ",
  },
  {
    nameISO3166: "Ukrainian",
    codeISO3166_1_A2: "UA",
  },
  {
    nameISO3166: "English",
    codeISO3166_1_A2: "GB",
  },
]);
const dialogLanguage = ref<boolean>(false);
const openLanguageDialog = (item: IDraftEntity) => {
  openedItem.value = item;
  dialogLanguage.value = true;
};
const closeLanguageDialog = () => {
  openedItem.value = null;
  dialogLanguage.value = false;
};
const generateDraftConfirm = async () => {
  if (openedItem.value) {
    await manager.generate(openedItem.value.id, language.value, true);
    openedItem.value = null;
    dialogLanguage.value = false;
  }
};

watch(
  () => route.params.functionality,
  async (functionality: string | string[]) => {
    if (functionality === "drafts") {
      drafts.value = await manager.get();
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card class="rounded-xl elevation-2">
      <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeDeleteDialog">Cancel</v-btn>
        <v-btn color="primary" variant="tonal" @click="deleteDraftConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogLanguage" max-width="500px">
    <v-card class="rounded-xl elevation-2">
      <v-card-title class="text-h5">Select Document Language</v-card-title>

      <v-card-text>
        <v-select
          v-model="language"
          :items="languageOptions"
          item-title="nameISO3166"
          item-value="codeISO3166_1_A2"
          label="Document Language"
          prepend-icon="mdi-format-list-text"
          hint="Select a language to generate the document accordingly."
          persistent-hint
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #title>
                <div class="d-flex align-center ga-3">
                  <span
                    class="fi"
                    :class="`fi-${item.raw.codeISO3166_1_A2.toLocaleLowerCase()}`"
                  ></span>
                  <span>{{ item.raw.nameISO3166 }}</span>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeLanguageDialog">Cancel</v-btn>
        <v-btn color="primary" variant="tonal" @click="generateDraftConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card class="rounded-xl bg-surface-2 elevation-2 ma-1">
    <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-data-table v-model:search="search" :headers="headers" :items="drafts" class="bg-surface-2">
      <template v-slot:item.actions="{ item }">
        <v-tooltip text="Edit this record.">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="info"
              size="small"
              v-bind="tooltip"
              @click="editDraft(item)"
              icon="mdi-pencil"
              class="ma-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Remove this record.">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="error"
              size="small"
              v-bind="tooltip"
              @click="openDeleteDialog(item)"
              icon="mdi-delete"
              class="ma-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Generate Document based on this record.">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              v-bind="tooltip"
              @click="openLanguageDialog(item)"
              icon="mdi-file-download-outline"
              class="ma-2"
            />
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>
