<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Review } from "../../../../../models/change/dc/Review";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";

const emit = defineEmits(["close"]);
const props = defineProps<{
  user: string;
  variant: "approve" | "check" | "register" | "unregister" | "reject";
  manager: DocumentChangeManager | DocumentChangeNoticeManager;
  dc: DocumentChangeTypes.TDocumentChange;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);

const { t } = useI18n();
const cancel = computed<string>(() => t(`tools.change.tabs.dcr.review.reviewControls.cancel`));
const confirm = computed<string>(() => t(`tools.change.tabs.dcr.review.reviewControls.confirm`));
const variant = computed<string>(() =>
  t(`tools.change.tabs.dcr.review.reviewControls.variant.${props.variant}`)
);

const question = computed<string>(() =>
  t(`tools.change.tabs.dcr.review.reviewControls.variant.question`, {
    variant: variant.value,
  })
);
const commentLabel = computed<string>(() =>
  t(`tools.change.tabs.dcr.review.reviewControls.commentOptional`)
);

const dialog = ref<boolean>(false);
const comment = ref<string | undefined>(undefined);
const commentParse = computed(() => comment.value ?? "");
const commentUpdate = (value: string) => {
  comment.value = value ? value : undefined;
};

const sendReview = async (decision: boolean) => {
  try {
    if (props.user === props.dc.checker || props.user === props.dc.approver) {
      const review = new Review(props.dc.id, props.user, decision, comment.value);

      const formData: any = new FormData();
      const property = props.variant.includes("register") ? "registration" : "assessment";
      formData.append(property, JSON.stringify(review));
      if (property === "registration") await props.manager.registration(formData, true);
      if (property === "assessment") await props.manager.assess(formData, true);
    }

    dialog.value = false;
    emit("close");
    comment.value = undefined;
  } catch (error) {
    console.error(`review at DCRReviewControls error: ${error}`);
  }
};

const review = computed<{ showActivator: boolean; alert: string | null }>(() => {
  const { user, dc } = props;
  const { status, checker, approver, registerer } = dc;

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

  if ((status === "Complete" && user === checker) || (status === "Checked" && user === approver)) {
    return { showActivator: true, alert: null };
  }

  if ((status === "Approved" || status === "Registered") && user === registerer) {
    return { showActivator: true, alert: null };
  }

  return { showActivator: false, alert: null };
});
</script>

<template>
  <template v-if="review.alert && (props.variant === 'approve' || props.variant === 'check')">
    <v-alert variant="outlined" :text="review.alert" type="info"></v-alert>
  </template>
  <v-dialog :max-width="smallScreen ? '80%' : '40%'" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="review.showActivator"
        class="rounded-xl"
        :color="props.variant === 'reject' ? 'error' : 'success'"
        :variant="props.variant === 'reject' ? 'outlined' : 'tonal'"
        :text="$t(`tools.change.tabs.dcr.review.reviewControls.${props.variant}`)"
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
            @click="
              sendReview(
                props.variant === 'reject' || props.variant === 'unregister' ? false : true
              )
            "
            :text="confirm"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
