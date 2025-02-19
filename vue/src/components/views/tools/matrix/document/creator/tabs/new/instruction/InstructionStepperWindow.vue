<script setup lang="ts">
import InfoStep from "./steps/info/InfoStep.vue";
import BeforeStep from "./steps/before/BeforeStep.vue";
import ContentStep from "./steps/content/ContentStep.vue";
</script>

<template>
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
  </v-stepper-window>
</template>
