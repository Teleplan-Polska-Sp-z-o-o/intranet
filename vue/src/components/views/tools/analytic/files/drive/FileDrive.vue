<script setup lang="ts">
import FileCard from "../fileCard/FileCard.vue";
import Activator from "../dialog/Activator.vue";
import Upsert from "./Upsert.vue";
import { ref, toRefs, unref, watch } from "vue";
import { AnalyticFileTypes } from "../Types";
import { AnalyticFileManager } from "../../../../../../models/analytic/AnalyticFileManager";
import { useRoute } from "vue-router";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
import { AnalyticFileHelper } from "./AnalyticFileHelper";

const compProps = defineProps<{
  /**
   * Used to describe which file drive is this
   *
   * adds ' - ${subtitle}' to the title 'File Drive'
   */
  subtitle?: string;

  identification: string;
}>();

const { subtitle, identification } = toRefs(compProps);

const manager: AnalyticFileManager = new AnalyticFileManager();
const fileEntities = ref<AnalyticFileTypes.IAnalyticFileEntity[]>([]);
const route = useRoute();

const load = async () => {
  // Route params setup
  const progName = route.params.program as string;
  const catName = route.params.cat as string;
  const subName = route.params.sub as string;

  const request = await manager.getByProgAndCatAndSub(progName, catName, subName);
  fileEntities.value = AnalyticFileHelper.addConsideredProperty(request);
};

// const driveUuid = uuidv4();
const store = useAnalyticStore();

watch(
  () => store.getLoad(unref(identification)).value,
  async (loadItems: boolean) => {
    if (loadItems === true) {
      await load();
    }
  },
  { deep: true }
);

watch(
  () => route.params.sub,
  (sub) => {
    if (sub) store.loadItems(unref(identification));
  },
  { immediate: true }
);

const componentTitle = "File Drive";
</script>

<template>
  <v-sheet class="rounded-xl bg-surface-2 elevation-2 pa-4 pt-2 ma-1">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="bg-surface-2 d-flex align-center">
            <span class="text-h5">{{ componentTitle }} {{ subtitle ? ` - ${subtitle}` : `` }}</span>
            <v-spacer></v-spacer>
            <activator :drive-uuid="identification" v-slot="{ driveUuid }">
              <upsert :drive-uuid="driveUuid"></upsert>
            </activator>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- files -->
      <v-row>
        <file-card
          v-for="fileEntity in fileEntities"
          :key="fileEntity.id"
          :drive-uuid="identification"
          :file-entity="fileEntity"
        ></file-card>
      </v-row>
    </v-container>
  </v-sheet>
</template>
