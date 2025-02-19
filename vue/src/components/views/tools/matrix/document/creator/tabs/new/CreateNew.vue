<script setup lang="ts">
// import InfoStep from "./instruction/steps/info/InfoStep.vue";
// import BeforeStep from "./instruction/steps/before/BeforeStep.vue";
// import ContentStep from "./instruction/steps/content/ContentStep.vue";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import SaveDialog from "./SaveDialog.vue";
// import { useRouter } from "vue-router";
import InstructionStepperWindow from "./instruction/InstructionStepperWindow.vue";
import ChooseStepperType from "./ChooseStepperType.vue";

// const router = useRouter();

const store = useStepperStore();

// onMounted(() => {
//   if (store.status.enum === EStatus.NULL)
//     store.setStepper({
//       type: DocumentCreatorStepper.EStepperType.INSTRUCTION,
//       navigation: {
//         router,
//       },
//     });
// });
</script>

<template>
  <choose-stepper-type v-if="!store.stepper"></choose-stepper-type>

  <v-stepper
    v-if="store.stepper"
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
        <v-divider v-if="index < Object.keys(store.stepper!.steps || {}).length - 1"></v-divider>
      </template>
    </v-stepper-header>
    <!-- 
    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <info-step></info-step>
        </v-card>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-card flat>
          <before-step></before-step>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat>
          <content-step></content-step>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window> -->

    <instruction-stepper-window />

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="store.stepper!.prevStep()"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!store.stepper!.prevable"
          >{{ $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.previous`) }}</v-btn
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
</template>
