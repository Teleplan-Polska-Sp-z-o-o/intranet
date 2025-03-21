<script setup lang="ts">
import { useStepperStore } from "../../../../../../../../../stores/documents/creator/useStepperStore";
import { tableStatus } from "../../helpers/tableStatus";
import { deepSafeParse } from "../../helpers/deepSaveParse";
import { IDraftEntity } from "../../../../../../../../../interfaces/document/creator/IDraftEntity";
import moment from "moment";
import "moment-timezone";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  item: IDraftEntity | null;
}>();

const stepperStore = useStepperStore();
const { t } = useI18n();
// const tBase = "tools.matrix.tabs.documents.creator.drafts";

function timelineDate(utcDate: string) {
  const tz = deepSafeParse<IDraftEntity>(props.item).stepper.tz;
  return moment(utcDate).tz(tz).format("DD-MMM-YYYY");
}

// function tableStatus(item: IDraftEntity | DocumentCreatorStepper.EStepperStatus): {
//   enum: undefined | DocumentCreatorStepper.EStepperStatus;
//   color: undefined | string;
//   text: string;
// } {
//   const status =
//     typeof item === "number" ? item : deepSafeParse<IDraftEntity>(item).stepper._status;
//   switch (status) {
//     case DocumentCreatorStepper.EStepperStatus.DRAFT:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.DRAFT,
//         color: "gray",
//         text: t(`${tBase}.draftStatus.chip.draftOption`),
//       };
//     case DocumentCreatorStepper.EStepperStatus.FOR_RELEASE:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.FOR_RELEASE,
//         color: "green",
//         text: t(`${tBase}.draftStatus.chip.forReleaseOption`),
//       };

//     case DocumentCreatorStepper.EStepperStatus.RELEASED:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.RELEASED,
//         color: "blue",
//         text: t(`${tBase}.draftStatus.chip.releasedOption`),
//       };

//     case DocumentCreatorStepper.EStepperStatus.ARCHIVED:
//       return {
//         enum: DocumentCreatorStepper.EStepperStatus.ARCHIVED,
//         color: "indigo",
//         text: t(`${tBase}.draftStatus.chip.archived`),
//       };

//     default:
//       return {
//         enum: undefined,
//         color: undefined,
//         text: t(`${tBase}.draftStatus.chip.unknown`),
//       };
//   }
// }

function getBadge(username: string) {
  if (stepperStore.DOCUMENT_CONTROLLERS.includes(username)) return "Controller";
  else return "Originator";
}
</script>

<template>
  <div class="overflow-y-auto" style="max-height: 300px">
    <v-timeline v-if="props.item?.stepper._statusHistory !== null" side="end" align="start">
      <v-timeline-item
        v-for="element in props.item?.stepper._statusHistory"
        :key="element.id"
        :dot-color="tableStatus(element.status, t).color"
        size="x-small"
      >
        <template v-slot:opposite>
          <v-chip
            class="ms-0 me-2"
            :color="tableStatus(element.status, t).color"
            size="small"
            label
          >
            {{ tableStatus(element.status, t).text }}
          </v-chip>
        </template>
        <div class="mb-4">
          <div class="text-body-1">
            <strong>{{ element.changedBy.username }}</strong> @{{ timelineDate(element.changedAt) }}
          </div>
          <v-chip
            v-if="getBadge(element.changedBy.username)"
            class="ms-0 me-2"
            size="small"
            variant="text"
            prepend-icon="mdi-badge-account-outline"
          >
            {{ getBadge(element.changedBy.username) }}
          </v-chip>

          <div v-if="element.comment" class="ms-2 mt-1 text-body-2">
            {{ `${$t(`tools.change.tabs.dcr.review.comment`)}: ${element.comment}` }}
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
