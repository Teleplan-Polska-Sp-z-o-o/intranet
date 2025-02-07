<script setup lang="ts">
import { nextTick, ref, unref, watchEffect } from "vue";
import { components } from "../../../../../../../../../../plugins/vuetify/components";
import SegmentPanel from "./SegmentPanel.vue";
import SubSegmentPanel from "./SubSegmentPanel.vue";
import { useStepperStore } from "../../../../../../../../../../stores/documents/creator/useStepperStore";

const formContent = ref<components.VForm | null>(null);
const THIS_STEP = 3;
const store = useStepperStore();

watchEffect(() => {
  const form = unref(formContent);
  const stepper = store.stepper;

  if (!stepper) return;
  const step = stepper.currentStep;

  nextTick(async () => {
    if (!form || step !== THIS_STEP) return;
    // console.log("form and step are both valid");

    const window = stepper.getWindow(step);
    if (!window.form) {
      // console.log("assign of form");
      window.form = form;
    }
  });
});
</script>

<template>
  <v-form ref="formContent" class="bg-surface-2">
    <v-expansion-panels>
      <template
        v-for="segment in store.stepper!.getWindow(THIS_STEP).model.segments"
        :key="segment.uuid"
      >
        <segment-panel :segment="segment"></segment-panel>
        <template v-for="subSegment in segment.subSegments" :key="subSegment.uuid">
          <sub-segment-panel :sub-segment="subSegment"></sub-segment-panel>
          <template v-for="subSubSegment in subSegment.subSegments" :key="subSubSegment.uuid">
            <sub-segment-panel :sub-segment="subSubSegment" disable-add></sub-segment-panel>
          </template>
        </template>
      </template>
    </v-expansion-panels>
  </v-form>
</template>
