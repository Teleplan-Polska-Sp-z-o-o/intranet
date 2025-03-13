<script setup lang="ts">
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import SaveDialog from "./SaveDialog.vue";
import InstructionStepperWindow from "./instruction/InstructionStepperWindow.vue";
import ChooseStepperType from "./ChooseStepperType.vue";
// import { DocumentCreatorStepper } from "./StepperTypes";
// import { computed } from "vue";

const store = useStepperStore();

// const selectStepperType = (type: DocumentCreatorStepper.EStepperType) => {
//   store.setStepper({
//     type,
//   });
// };

// const getImagePath = computed(() => {
//   return (type: string) => `/documents/${type}-doc-type.png`;
// });
</script>

<template>
  <template v-if="store.stepper === null">
    <v-fade-transition hide-on-leave>
      <choose-stepper-type></choose-stepper-type>
      <!-- <v-item-group
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
                  :class="[
                    'd-flex align-center rounded-xl bg-surface-2 elevation-2',
                    selectedClass,
                  ]"
                  @click="() => selectStepperType(type)"
                  :image="getImagePath(type)"
                  height="300"
                >
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group> -->
    </v-fade-transition>
  </template>
  <template v-else>
    <v-fade-transition hide-on-leave>
      <v-stepper
        style="overflow-y: auto"
        :mobile="false"
        v-model="store.stepper!.currentStep"
        class="rounded-xl bg-surface-2 ma-1"
      >
        <v-stepper-header class="rounded-xl">
          <template
            v-for="([key, step], index) in Object.entries(store.stepper!.steps || {})"
            :key="key"
          >
            <v-stepper-item
              :value="Number(key)"
              :title="step.name"
              :editable="step.editable"
              :complete="step.complete"
              :color="step.color"
            ></v-stepper-item>
            <v-divider
              v-if="index < Object.keys(store.stepper!.steps || {}).length - 1"
            ></v-divider>
          </template>
        </v-stepper-header>

        <instruction-stepper-window />

        <template v-slot:actions>
          <v-card-actions class="mx-6 mb-6 rounded-xl">
            <v-btn
              @click="store.stepper!.prevStep()"
              color="secondary"
              variant="text"
              class="rounded-xl"
              :disabled="!store.stepper!.prevable"
              >{{
                $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.previous`)
              }}</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              v-if="store.stepper!.nextable"
              @click="store.stepper!.nextStep()"
              color="secondary"
              variant="text"
              class="rounded-xl"
              >{{ $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.next`) }}</v-btn
            >
            <save-dialog v-else></save-dialog>
          </v-card-actions>
        </template>
      </v-stepper>
    </v-fade-transition>
  </template>
</template>
