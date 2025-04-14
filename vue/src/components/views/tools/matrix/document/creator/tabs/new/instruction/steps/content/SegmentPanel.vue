<script setup lang="ts">
import { toRefs } from "vue";
import { DraftTypes } from "../../../DraftTypes";
// import { useCreatorTipTapStore } from "../../../../../../../../../../stores/documents/creator/useCreatorTipTapStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.createNew.stepper.content";

const props = defineProps<{
  segment: DraftTypes.Segment;
}>();

const { segment } = toRefs(props);
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <template v-slot:default="{}">
        <!-- expanded -->
        <v-container fluid>
          <v-row no-gutters class="flex-nowrap">
            <!-- Column for status chip -->
            <v-col cols="auto">
              <!-- <v-chip v-if="segment.content.isSaved" class="ma-2" label color="success">
                Saved
              </v-chip>
              <v-chip v-else class="ma-2" label color="warning"> Changes </v-chip> -->
            </v-col>

            <!-- Column for title -->
            <v-col style="max-width: 75%">
              <div class="ma-2 pa-0 flex-shrink-1 text-no-wrap text-truncate segment-title">
                {{ `${segment.segmentIndex}. ` }}{{ segment.content.title }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-sheet class="rounded elevation-2 overflow-hidden mx-auto a4 tiptap-container">
              <v-label>{{ t(`${tBase}.segmentBody`) }}</v-label>
              <VuetifyTiptap spellcheck="false" v-model="segment.content.tmpBody" />
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn-toggle borderless>
              <!-- <v-btn @click="segment.saveContent()">
                <span class="hidden-sm-and-down">Save</span>

                <v-icon end> mdi-check </v-icon>
              </v-btn> -->

              <v-btn @click="segment.addSubSegment()">
                <span class="hidden-sm-and-down">{{ t(`${tBase}.addButton`) }}</span>

                <v-icon end> mdi-plus </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style lang="scss" scoped>
.a4 {
  width: 21cm !important;
}
.tiptap-container {
  padding: 24px 16px 4px !important;

  label {
    font-size: 12px !important;
  }
}

.vuetify-pro-tiptap .tiptap {
  padding: 8 0 !important;
}

.segment-title {
  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1.6 !important;
  letter-spacing: 0.0071428571em !important;
  font-family: "Arial Nova Cond", sans-serif !important;
  text-decoration: underline !important;
}
</style>
