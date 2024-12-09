<script setup lang="ts">
import { ref, unref } from "vue";
import { Draft } from "./DocumentTypes";
import { Stepper } from "./StepperTypes";
import AddInfo from "./AddInfo.vue";

const stepper = ref<Stepper>(
  new Stepper({
    1: {
      name: "Info",
    },
    2: {
      name: "Content",
    },
    3: {
      name: "Verify",
    },
  })
);

const draft = ref<Draft>(new Draft());
console.log("draft", unref(draft));
</script>

<template>
  <v-stepper
    style="overflow-y: auto"
    :mobile="false"
    v-model="stepper.currentStep"
    class="rounded-xl ma-1"
  >
    <v-stepper-header class="rounded-xl">
      <template v-for="([key, step], index) in Object.entries(stepper.steps)" :key="key">
        <v-stepper-item :value="Number(key)" :title="step.name"></v-stepper-item>
        <v-divider v-if="index < Object.keys(stepper.steps).length - 1"></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <add-info></add-info>
        </v-card>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-card flat> </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat> </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="stepper.prevStep()"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!stepper.prevable"
          >{{ $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.previous`) }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="stepper.nextStep()"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!stepper.nextable"
          >{{ $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.next`) }}</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>
