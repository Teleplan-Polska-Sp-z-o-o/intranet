<script setup lang="ts">
import { ref } from "vue";
import { usePCRStore } from "../../../../../stores/change/pcrStore";

const pcrStore = usePCRStore();

const selectedStatus = ref<"Open" | "Closed" | null>(pcrStore.getFilter("status"));
const saveStatus = () => {
  pcrStore.saveFilter(selectedStatus.value, "status");
};

const selectedOwner = ref<boolean>(pcrStore.getFilter("onlyOwned"));
const saveOwner = () => {
  pcrStore.saveFilter(selectedOwner.value, "onlyOwned");
};

const smallScreen = ref<boolean>(window.innerWidth < 960);
</script>

<template>
  <v-list
    lines="three"
    select-strategy="classic"
    bg-color="surface-2"
    :class="smallScreen ? 'px-n2' : 'mx-5'"
  >
    <v-list-item>
      <template v-slot:prepend>
        <v-list-item-action start>
          <v-switch
            v-model="selectedOwner"
            @update:modelValue="saveOwner"
            color="secondary"
          ></v-switch>
        </v-list-item-action>
      </template>

      <v-list-item-title>Owner</v-list-item-title>
      <v-list-item-subtitle> Show only requests that I own. </v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <template v-slot:prepend>
        <v-list-item-action start :style="smallScreen ? '' : 'min-width: 150px'">
          <v-select
            v-model="selectedStatus"
            label="Status"
            color="secondary"
            clearable
            :items="['Open', 'Closed']"
            variant="underlined"
            @update:modelValue="saveStatus"
          ></v-select>
        </v-list-item-action>
      </template>

      <v-list-item-title>Status</v-list-item-title>
      <v-list-item-subtitle> Filter requests by their status. </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>
