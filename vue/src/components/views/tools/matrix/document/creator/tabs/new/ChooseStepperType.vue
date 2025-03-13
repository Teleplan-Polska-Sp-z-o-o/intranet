<script setup lang="ts">
import { computed } from "vue";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { DocumentCreatorStepper } from "./StepperTypes";

const store = useStepperStore();

const selectStepperType = (type: DocumentCreatorStepper.EStepperType) => {
  store.setStepper({
    type,
  });
};

const getImagePath = computed(() => {
  return (type: string) => `/documents/${type}-doc-type.png`;
});
</script>

<template>
  <v-item-group
    selected-class="bg-primary"
    :key="store.stepper ? 'with-stepper' : 'without-stepper'"
  >
    <v-container>
      <v-row>
        <v-col
          v-for="type in Object.values(DocumentCreatorStepper.EStepperType)"
          :key="type"
          cols="12"
          md="4"
        >
          <v-item v-slot="{ selectedClass }">
            <v-card
              :class="['d-flex align-center rounded-xl bg-surface-2 elevation-2', selectedClass]"
              @click="() => selectStepperType(type)"
              :image="getImagePath(type)"
              height="300"
            >
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>
