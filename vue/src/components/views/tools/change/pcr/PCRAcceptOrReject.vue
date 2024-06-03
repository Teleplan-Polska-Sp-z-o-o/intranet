<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { ProcessChangeRequestManager } from "../../../../../models/change/pcr/ProcessChangeRequestManager";
import { useUserStore } from "../../../../../stores/userStore";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { IProcessChangeRequest } from "../../../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeRequestBase } from "../../../../../models/change/pcr/ProcessChangeRequestBase";

const emit = defineEmits(["resetActions", "close"]);

const props = defineProps<{
  checkActions: true | null;
  variant: "accept" | "reject";
  pcrId: number;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);
const { t } = useI18n();

const cancel = computed<string>(() => t("tools.common.cancel"));
const confirm = computed<string>(() => t("tools.common.ok"));

const messageVariant = props.variant === "accept" ? "approve" : "reject";
const message = `Are you sure you want to ${messageVariant} this process change request?`;

const dialog = ref<boolean>(false);

const manager = new ProcessChangeRequestManager();

const userStore = useUserStore();
const user = userStore.info();
if (!user) throw new Error("User at AcceptOrReject.vue resolve to false.");

const acceptOrReject = async () => {
  const formData: any = new FormData();

  formData.append("requestId", JSON.stringify(props.pcrId));
  formData.append("approvedOrRejectedBy", JSON.stringify(user));

  const assessment: "Implementation" | "Rejection" =
    props.variant === "accept" ? "Implementation" : "Rejection";

  const close: { response: ResponseStatus; closed: IProcessChangeRequest } = await manager.close(
    formData,
    assessment
  );
  dialog.value = false;

  emit("close", close);
};

type CheckActionsInfo = { isFilled: boolean; isClosed: boolean };

const enableActions = async (): Promise<CheckActionsInfo> => {
  const request: IProcessChangeRequest = await manager.getRequest(props.pcrId);
  const base: ProcessChangeRequestBase = new ProcessChangeRequestBase().buildFromRequest(request);

  const isFilled = Object.entries(base)
    .filter(([key]) => key !== "riskAnalysis" && key !== "updateDescription")
    .every(([_, value]) => !!value);
  const isClosed = request.status === "Closed";
  const isOwner = user.username === base.reconextOwner.toLocaleLowerCase().replace(" ", ".");

  showActions.value = isFilled && !isClosed && isOwner;
  return { isFilled, isClosed };
};

const showActions = ref<boolean>(false);

const checkActionsInfo = ref<CheckActionsInfo>({
  isFilled: false,
  isClosed: false,
});

const checkActionsInfoAlert = computed(() => {
  return {
    "1": !checkActionsInfo.value.isFilled && !checkActionsInfo.value.isClosed,
    "2": checkActionsInfo.value.isClosed,
  };
});

const checkActions = ref<true | null>(props.checkActions);

watchEffect(async () => {
  if (checkActions.value === true) {
    enableActions();
    emit("resetActions");
  } else {
    const { isFilled, isClosed } = await enableActions();
    checkActionsInfo.value.isFilled = isFilled;
    checkActionsInfo.value.isClosed = isClosed;
  }
});

const click = () => {
  dialog.value = true;
};
</script>

<template>
  <template v-if="props.variant === 'accept'">
    <v-alert
      v-if="checkActionsInfoAlert['1']"
      variant="outlined"
      text="Approval controls will appear once PCR is complete."
      type="info"
    ></v-alert>
    <v-alert
      v-if="checkActionsInfoAlert['2']"
      variant="outlined"
      text="Approval for this PCR has been granted."
      type="info"
    ></v-alert>
  </template>
  <v-dialog :max-width="smallScreen ? '80%' : '40%'" v-model="dialog">
    <template v-slot:activator>
      <v-btn
        v-if="showActions"
        @click="click"
        class="rounded-xl"
        :color="variant === 'accept' ? 'success' : 'error'"
        :variant="variant === 'accept' ? 'tonal' : 'outlined'"
        :text="variant === 'accept' ? 'APPROVE' : 'REJECT'"
      />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="rounded-xl">
        <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
          <v-alert class="mx-4 mb-8" :text="message" border="start" type="warning"> </v-alert>
        </v-card-text>

        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <v-spacer></v-spacer>
          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            @click="isActive.value = false"
            :text="cancel"
          />
          <v-btn
            class="bg-primary text-on-primary mr-4 rounded-xl"
            @click="acceptOrReject()"
            :text="confirm"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
