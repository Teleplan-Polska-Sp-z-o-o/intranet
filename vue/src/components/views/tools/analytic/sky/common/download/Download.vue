<script setup lang="ts">
import { Ref, ref, unref, watchEffect } from "vue";
import { DataTableHeader } from "./DataTableHeader";
import { DownloadHelper } from "./DownloadHelper";

const props = defineProps<{
  headers: DataTableHeader[];
  items: object[];
  baseSaveAs?: string;
}>();

const helper = ref<DownloadHelper<any> | undefined>(undefined);
const updateHelper = () => {
  helper.value = new DownloadHelper(props.headers, props.items);
  return !!helper.value;
};

// Deep watch to track any changes inside the items array
watchEffect(() => {
  updateHelper();
  //   console.log("headers", props.headers);
  //   console.log("items", props.items.slice(0, 5));
});

const isOpen = ref<boolean>(false);
const open = () => {
  if (!unref(isOpen)) isOpen.value = true;
};

const downloadAs = ref<string>(props.baseSaveAs ?? "");
const save = (isActive: Ref<boolean>) => {
  const h = unref(helper);
  if (h) h.exportToExcel(unref(downloadAs));

  isActive.value = false;
};
</script>

<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props: tooltipProps }">
      <v-dialog v-model="isOpen">
        <template v-slot:activator>
          <v-btn
            v-bind="{ ...tooltipProps }"
            icon="mdi-tray-arrow-down"
            variant="text"
            :disabled="!props.items.length"
            @click="open"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card class="mx-auto" width="300" title="Download">
            <template v-slot:text>
              <v-text-field v-model="downloadAs" messages="Save As"></v-text-field>
            </template>
            <template v-slot:actions>
              <v-spacer></v-spacer>
              <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
              <v-btn text="Ok" @click="save(isActive)"></v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
    </template>
    <span>Download the Results of the Analysis.</span>
  </v-tooltip>
</template>
