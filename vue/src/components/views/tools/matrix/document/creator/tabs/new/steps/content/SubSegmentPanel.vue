<script setup lang="ts">
import { toRefs } from "vue";
import { DraftTypes } from "../../DraftTypes";
// import { useCreatorTipTapStore } from "../../../../../../../../../../stores/documents/creator/useCreatorTipTapStore";

const props = defineProps<{
  subSegment: DraftTypes.Segment;
  disableAdd?: true;
}>();
const { subSegment, disableAdd } = toRefs(props);

// const store = useCreatorTipTapStore();

// const handleBodyUpdate = (newValue: string | object | undefined) => {
//   if (typeof newValue !== "string") return;

//   if (store.charactersCount > store.documentContentLimit) {
//     return;
//   }

//   subSegment.value.content.tmpBody = newValue;
// };
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <template v-slot:default="{}">
        <!-- expanded -->
        <v-container fluid class="ma-0 w-75">
          <v-row no-gutters class="flex-nowrap">
            <!-- Column for status chip -->
            <v-col cols="auto">
              <!-- <v-chip v-if="subSegment.content.isSaved" class="ma-2" label color="success">
                Saved
              </v-chip>
              <v-chip v-else class="ma-2" label color="warning"> Changes </v-chip> -->
            </v-col>

            <!-- Column for title -->
            <v-col>
              <div class="ma-2 pa-0 flex-shrink-1 text-no-wrap text-truncate segment-title">
                {{ `${subSegment.segmentIndex}. `
                }}{{ subSegment.content.title || "Untitled Segment" }}
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
            <v-sheet class="mx-auto a4">
              <v-textarea
                v-model="subSegment.content.tmpTitle"
                label="Segment Title"
                variant="solo-filled"
                hint="Edit the segment title."
                rows="3"
                counter="100"
                persistent-counter
                maxLength="100"
              >
              </v-textarea>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-sheet class="rounded elevation-2 overflow-hidden mx-auto a4 tiptap-container">
              <v-label>Segment Body</v-label>
              <!-- v-model="subSegment.content.tmpBody" -->
              <VuetifyTiptap spellcheck="false" v-model="subSegment.content.tmpBody" />
              <!-- <p v-if="errorMessages[subSegment.uuid]" class="text-error">
                {{ errorMessages[subSegment.uuid] }}
              </p> -->
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn-toggle borderless>
              <!-- <v-btn @click="subSegment.saveContent()">
                <span class="hidden-sm-and-down">Save</span>
                <v-icon end> mdi-check </v-icon>
              </v-btn> -->

              <v-btn v-if="!disableAdd" @click="subSegment.addSubSegment()">
                <span class="hidden-sm-and-down">Add</span>
                <v-icon end> mdi-plus </v-icon>
              </v-btn>

              <v-btn v-if="subSegment.parent" @click="subSegment.insertSegment('before')">
                <span class="hidden-sm-and-down">Insert Before</span>
                <v-icon end> mdi-arrow-up </v-icon>
              </v-btn>

              <v-btn v-if="subSegment.parent" @click="subSegment.insertSegment('after')">
                <span class="hidden-sm-and-down">Insert After</span>
                <v-icon end> mdi-arrow-down </v-icon>
              </v-btn>

              <v-btn v-if="subSegment.parent" @click="subSegment.removeSegment()">
                <span class="hidden-sm-and-down">Remove</span>
                <v-icon end> mdi-delete </v-icon>
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
  padding: 24px 16px 4px;

  label {
    font-size: 12px !important;
  }
}

.vuetify-pro-tiptap .ProseMirror {
  padding: 8 0 !important;
}

:deep(.v-textarea textarea)
// ::v-deep .v-textarea textarea
{
  font-size: 12px !important;
  font-weight: 500 !important;
  font-family: "Arial Nova Cond", sans-serif !important;
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
