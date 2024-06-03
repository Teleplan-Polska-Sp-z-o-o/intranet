<script setup lang="ts">
import { ref } from "vue";
import { usePCNStore } from "../../../../../stores/change/pcnStore";

const pcnStore = usePCNStore();

const selectedStatus = ref<"Open" | "Closed" | null>(pcnStore.getFilter("status"));
const saveStatus = () => {
  pcnStore.saveFilter(selectedStatus.value, "status");
};

const selectedDesignated = ref<boolean>(pcnStore.getFilter("onlyDesignated"));
const saveDesignated = () => {
  pcnStore.saveFilter(selectedDesignated.value, "onlyDesignated");
};

const selectedApprovable = ref<"By Me" | "By My Department">(pcnStore.getFilter("approvable"));
const saveApprovable = () => {
  pcnStore.saveFilter(selectedApprovable.value, "approvable");
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
            v-model="selectedDesignated"
            @update:modelValue="saveDesignated"
            color="secondary"
          ></v-switch>
        </v-list-item-action>
      </template>

      <v-list-item-title>Person Designated</v-list-item-title>
      <v-list-item-subtitle
        >Show only notices designated for implementation by me.</v-list-item-subtitle
      >
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
      <v-list-item-subtitle> Filter notices by their status. </v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <template v-slot:prepend>
        <v-list-item-action start :style="smallScreen ? '' : 'min-width: 150px'">
          <v-select
            v-model="selectedApprovable"
            label="Approval"
            color="secondary"
            clearable
            :items="['By Me', 'By My Department']"
            variant="underlined"
            @update:modelValue="saveApprovable"
          ></v-select>
        </v-list-item-action>
      </template>

      <v-list-item-title>Approval</v-list-item-title>
      <v-list-item-subtitle>Show notices that I or my department can approve.</v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>
