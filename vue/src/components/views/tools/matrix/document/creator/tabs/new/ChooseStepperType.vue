<script setup lang="ts">
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { computed, ref, watch } from "vue";
// import { useRouter } from "vue-router";
import { DocumentCreatorStepper } from "./StepperTypes";

// const router = useRouter();
const store = useStepperStore();

// Reactive state for stepper type
const stepperType = ref<DocumentCreatorStepper.EStepperType | undefined>(undefined);

// Available stepper type options
const stepperTypeOptions = computed(() => Object.values(DocumentCreatorStepper.EStepperType));

// Function to update stepper type reactively
const selectStepperType = (type: DocumentCreatorStepper.EStepperType) => {
  stepperType.value = type;
};

// Watch for stepper type changes and update store reactively
watch(stepperType, (type) => {
  if (type) {
    store.setStepper({
      type,
      // navigation: { router },
    });

    stepperType.value = undefined;
  }
});

function formatOption(option: DocumentCreatorStepper.EStepperType) {
  return option
    .split("-") // 1) Separate by '-'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // 2) Uppercase first letter
    .join(" "); // 3) Join with space
}
</script>

<template>
  <v-item-group selected-class="bg-primary">
    <v-container>
      <v-row>
        <v-col v-for="option in stepperTypeOptions" :key="option" cols="12" md="4">
          <v-item v-slot="{ selectedClass }">
            <v-card
              :class="['d-flex align-center rounded-xl bg-surface-2 elevation-2', selectedClass]"
              height="200"
              @click="selectStepperType(option)"
            >
              <div class="text-h4 flex-grow-1 text-center">
                {{ formatOption(option) }}
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>
