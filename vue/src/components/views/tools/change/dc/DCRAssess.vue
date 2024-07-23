<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Assessment } from "../../../../../models/change/dc/Assessment";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";

const emit = defineEmits(["close"]);
const props = defineProps<{
  user: string;
  variant: "approve" | "check" | "reject";
  manager: DocumentChangeManager | DocumentChangeNoticeManager;
  dc: DocumentChangeTypes.TDocumentChange;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);

const { t } = useI18n();
const cancel = computed<string>(() => t(`tools.change.tabs.dcr.review.cancel`));
const confirm = computed<string>(() => t(`tools.change.tabs.dcr.review.confirm`));
const variant = computed<string>(() => t(`tools.change.tabs.dcr.review.variant.${props.variant}`));
const question = t(`tools.change.tabs.dcr.review.variant.question`, { variant: variant.value });
const commentLabel = computed<string>(() => t(`tools.change.tabs.dcr.review.commentOptional`));

const dialog = ref<boolean>(false);
const comment = ref<string | undefined>(undefined);
const commentParse = computed(() => comment.value ?? "");
const commentUpdate = (value: string) => {
  comment.value = value ? value : undefined;
};

const assess = async (decision: boolean) => {
  try {
    if (props.user === props.dc.checker || props.user === props.dc.approver) {
      const assessment = new Assessment(props.dc.id, props.user, decision, comment.value);

      const formData: any = new FormData();
      formData.append("assessment", JSON.stringify(assessment));
      await props.manager.assess(formData, true);
    }

    dialog.value = false;
    emit("close");
  } catch (error) {
    console.error(`assess at DCRAssess error: ${error}`);
  }
};

// const assessment = computed<{ showActivator: boolean; alert: string | null }>(() => {
//   if (props.dc.status === "Draft" && props.user === props.dc.checker) {
//     return {
//       showActivator: false,
//       alert: t(`tools.change.tabs.dcr.review.alert.reviewControlsAppearOnComplete`),
//     };
//   } else if (
//     !props.dc.checked &&
//     props.dc.status === "Complete" &&
//     props.user === props.dc.approver &&
//     props.user !== props.dc.checker
//   ) {
//     return {
//       showActivator: false,
//       alert: t(`tools.change.tabs.dcr.review.alert.reviewControlsAppearOnChecked`),
//     };
//   } else if (
//     (!props.dc.checker && props.dc.status === "Complete") ||
//     (!props.dc.approver && props.dc.status === "Checked") ||
//     props.dc.status === "Registered" ||
//     props.dc.status === "Approved"
//   ) {
//     return { showActivator: false, alert: null };
//   } else if (
//     props.user === props.dc.checker ||
//     props.user === props.dc.approver ||
//     props.user === props.dc.registerer
//   ) {
//     return { showActivator: true, alert: null };
//   } else return { showActivator: false, alert: null };
// });

const assessment = computed<{ showActivator: boolean; alert: string | null }>(() => {
  const { status, checker, approver, registerer } = props.dc;
  const { user } = props;

  const alerts = {
    reviewControlsAppearOnComplete: t(
      `tools.change.tabs.dcr.review.alert.reviewControlsAppearOnComplete`
    ),
    reviewControlsAppearOnChecked: t(
      `tools.change.tabs.dcr.review.alert.reviewControlsAppearOnChecked`
    ),
  };

  if (
    (status === "Draft" && user === checker) ||
    (status === "Complete" && !props.dc.checked && user === approver && user !== checker)
  ) {
    return {
      showActivator: false,
      alert:
        status === "Draft"
          ? alerts.reviewControlsAppearOnComplete
          : alerts.reviewControlsAppearOnChecked,
    };
  }

  if (
    (status === "Complete" && (!checker || !approver)) ||
    (status === "Checked" && !approver) ||
    ["Registered", "Approved"].includes(status)
  ) {
    return { showActivator: false, alert: null };
  }

  if ([checker, approver, registerer].includes(user)) {
    return { showActivator: true, alert: null };
  }

  return { showActivator: false, alert: null };
});
</script>

<template>
  <template v-if="assessment.alert && (props.variant === 'approve' || props.variant === 'check')">
    <v-alert variant="outlined" :text="assessment.alert" type="info"></v-alert>
  </template>
  <v-dialog :max-width="smallScreen ? '80%' : '40%'" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="assessment.showActivator"
        class="rounded-xl"
        :color="props.variant === 'reject' ? 'error' : 'success'"
        :variant="props.variant === 'reject' ? 'outlined' : 'tonal'"
        :text="variant"
        v-bind="activatorProps"
      />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="rounded-xl">
        <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
          <div class="mb-4">{{ question }}</div>
          <v-textarea
            :modelValue="commentParse"
            @update:modelValue="commentUpdate"
            :label="commentLabel"
          ></v-textarea>
        </v-card-text>

        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <v-spacer></v-spacer>
          <v-btn
            class="rounded-xl mr-4"
            color="primary"
            variant="text"
            @click="isActive.value = false"
            :text="cancel"
          />
          <v-btn
            class="rounded-xl"
            color="primary"
            variant="tonal"
            @click="assess(props.variant === 'reject' ? false : true)"
            :text="confirm"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
