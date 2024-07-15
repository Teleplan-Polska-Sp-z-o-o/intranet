<script setup>
import { ref, computed } from "vue";
import FooterSnackbar from "./FooterSnackbar.vue";
const smallScreen = window.innerWidth < 960;

const slides = [
  {
    id: 1,
    text: "ISO® 9001",
  },
  {
    id: 1,
    text: "ISO® 14001",
  },
  {
    id: 1,
    text: "ISO® 45001",
  },
  {
    id: 1,
    text: "ISO® 27001",
  },
  {
    id: 1,
    text: "ISO® 22301",
  },
];
</script>

<template>
  <footer-snackbar></footer-snackbar>
  <v-footer class="layout-footer d-flex w-100 bg-primary-container text-on-primary-container">
    <div class="d-flex w-100">
      <v-carousel
        v-if="smallScreen"
        height="32"
        cycle
        :hide-delimiters="true"
        :hide-delimiter-background="true"
        :show-arrows="false"
      >
        <v-carousel-item v-for="slide in slides" :key="slide.id">
          <v-sheet class="bg-primary-container text-on-primary-container" height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <div>{{ slide.text }}</div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <div v-else class="d-flex w-100 justify-center align-center ga-4">
        <span>ISO® 9001</span>
        <span>ISO® 14001</span>
        <span>ISO® 45001</span>
        <span>ISO® 27001</span>
        <span>ISO® 22301</span>
      </div>
    </div>
  </v-footer>
</template>
