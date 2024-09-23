<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";

const store = useAnalyticStore();
const compProps = defineProps<{
  driveUuid: string;
  fileUuid?: string;
}>();

const { driveUuid, fileUuid } = toRefs(compProps);

const smallScreen = ref<boolean>(window.innerWidth < 960);
const dialogSize = computed(() => {
  return {
    width: smallScreen ? "90vw" : "60vw",
    height: "80vh",
  };
});

const open = computed(() => store.isDialogOpen(fileUuid.value ?? driveUuid.value));
</script>

<template>
  <v-dialog v-model="open" :max-width="dialogSize.width" :max-height="dialogSize.height">
    <template v-if="!fileUuid" v-slot:activator>
      <v-btn
        class="bg-primary-container text-primary rounded-lg"
        height="56px"
        prepend-icon="mdi-plus"
        @click="store.openDialog(fileUuid ?? driveUuid)"
      >
        New File
      </v-btn>
    </template>

    <slot :drive-uuid="driveUuid" :file-uuid="fileUuid"></slot>
  </v-dialog>
</template>
