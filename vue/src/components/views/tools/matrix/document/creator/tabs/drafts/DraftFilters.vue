<script setup lang="ts">
import { BaseFilter, FilterInputType, FilterKey } from "./DraftFiltersTypes";
import { useDraftsStore } from "../../../../../../../../stores/documents/drafts/useDraftsStore";
import { computed } from "vue";

const tBase = "tools.matrix.tabs.documents.creator.drafts";

const store = useDraftsStore();

// Function that returns a computed property based on the given filter
const useUniqueUsers = (filter: BaseFilter<FilterKey>) => {
  return computed(() => {
    return Array.from(
      new Map(
        store.computedDrafts.flatMap((draft) => {
          switch (filter.options.key) {
            case FilterKey.CREATOR:
              return [[draft.createdBy.user.id, draft.createdBy.user]];
            case FilterKey.EDITOR:
              return draft.updatedBy.map((uBy) => [uBy.user.id, uBy.user]);
            default:
              return [];
          }
        })
      ).values()
    );
  });
};

const uniqueTzs = computed(() => {
  return [...new Set(store.computedDrafts.flatMap((draft) => draft.stepper.tz))];
});
</script>

<template>
  <v-card-title class="d-flex align-center pe-2">
    <v-btn
      key="reset-drafts-filters"
      color="tertiary"
      prepend-icon="mdi-filter-remove-outline"
      :slim="true"
      :text="$t(`${tBase}.filters.reset`)"
      variant="plain"
      class="me-2 text-none"
      size="small"
      @click="store.resetDraftsSearch"
    ></v-btn>

    <v-spacer></v-spacer>

    <v-text-field
      v-model="store.draftsSearch.bar"
      class="me-2"
      density="compact"
      :label="$t(`${tBase}.search`)"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      flat
      hide-details
      single-line
    ></v-text-field>
  </v-card-title>

  <v-card-text>
    <!-- style="width: calc(100% - 2 * (4 /* <- number from mx-<number> */ * 4px))" mx-4 -->
    <v-sheet border="tertiary md" class="rounded-lg">
      <v-expansion-panels elevation="0" multiple>
        <v-expansion-panel class="bg-surface-2" elevation="0">
          <v-expansion-panel-title
            expand-icon="mdi-filter-menu-outline"
            collapse-icon="mdi-filter-check-outline"
          >
            {{ $t("tools.common.filters") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list bg-color="surface-2">
              <template v-for="filter in store.draftsSearch.filters" :key="filter.options.key">
                <!-- DATE -->
                <template v-if="filter.options.inputType === FilterInputType.DATE">
                  <div class="text-caption">{{ filter.messages.title }}</div>
                  <v-row no-gutters>
                    <v-col :cols="12">
                      <v-list-item density="compact" class="h-100">
                        <v-date-input
                          v-model="filter.mainInput.value"
                          multiple="range"
                          :label="$t(`${tBase}.filters.${filter.options.key}.label`)"
                          variant="solo-filled"
                          flat
                          hide-details
                          first-day-of-week="1"
                          @update:model-value="(input: any) => filter.set(input)"
                          clearable
                          @click:clear="() => filter.set(null)"
                        ></v-date-input>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </template>
                <!-- SELECT -->
                <template v-if="filter.options.inputType === FilterInputType.SELECT">
                  <div class="text-caption">{{ filter.messages.title }}</div>
                  <v-row no-gutters>
                    <v-col :cols="12">
                      <v-list-item density="compact" class="h-100">
                        <v-select
                          :model-value="(filter.mainInput.value as string | null)"
                          @update:model-value="(input: any) => filter.set(input)"
                          clearable
                          @click:clear="() => filter.set(null)"
                          :items="uniqueTzs"
                          density="compact"
                          :label="$t(`${tBase}.filters.${filter.options.key}.label`)"
                          variant="solo-filled"
                          flat
                          hide-details
                          single-line
                          :prepend-icon="
                            filter.options.key === FilterKey.LOCATOR
                              ? 'mdi-map-clock-outline'
                              : undefined
                          "
                        ></v-select>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </template>
                <!-- SWITCH -->
                <template v-else-if="filter.options.inputType === FilterInputType.SWITCH">
                  <div class="text-caption">{{ filter.messages.title }}</div>
                  <v-row no-gutters>
                    <!-- <v-col :cols="filter.options.hasSideInput === true ? 6 : 12">
                      <v-list-item
                        density="compact"
                        class="d-flex justify-center align-center h-100"
                      >
                        <template v-slot:prepend>
                          <v-list-item-action start>
                            <v-switch
                              :model-value="filter.mainInput.value"
                              :indeterminate="filter.mainInput.indeterminate"
                              @change="() => filter.toggle()"
                              color="secondary"
                              class="ms-1"
                              hide-details
                            >
                            </v-switch>
                          </v-list-item-action>
                        </template>

                        <v-list-item-subtitle>
                          {{ filter.messages.subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col> -->
                    <v-col v-if="filter.options.hasSideInput === true" cols="12">
                      <v-list-item density="compact" class="h-100">
                        <v-autocomplete
                          v-if="
                            filter.options.key === FilterKey.CREATOR ||
                            filter.options.key === FilterKey.EDITOR
                          "
                          :model-value="filter.sideInput.value || null"
                          @update:model-value="(input: any) => filter.input(input) "
                          :items="useUniqueUsers(filter).value"
                          item-title="username"
                          return-object
                          density="compact"
                          :label="$t(`${tBase}.filters.${filter.options.key}.sideLabel`)"
                          variant="solo-filled"
                          flat
                          hide-details
                          single-line
                          clearable
                          @click:clear="() => filter.input(null)"
                          prepend-icon="mdi-format-list-text"
                        >
                          <template #item="{ item, props }">
                            <v-list-item v-bind="props">
                              <template #title>
                                <div class="d-flex align-center ga-3">
                                  <v-avatar icon="mdi-account" rounded="0"></v-avatar>
                                  <span>{{ item.raw.username }}</span>
                                </div>
                              </template>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </template>
                <!-- ELSE -->
                <template v-else></template>
              </template>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-sheet>
  </v-card-text>
</template>
