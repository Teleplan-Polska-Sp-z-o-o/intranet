<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../../../../stores/userStore";
import { IProcessChangeRequest } from "../../../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNoticeManager } from "../../../../../models/change/pcn/ProcessChangeNoticeManager";
import { IProcessChangeNotice } from "../../../../../interfaces/change/IProcessChangeNotice";
import { ProcessChangeNoticeFields } from "../../../../../models/change/pcn/ProcessChangeNoticeFields";
import { UserManager } from "../../../../../models/user/UserManager";

const emit = defineEmits(["resetActions", "close"]);

const props = defineProps<{
  checkActions: true | null;
  variant: "accept" | "reject";
  pcrId: number;
  pcnId: number;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);
const { t } = useI18n();

const cancel = computed<string>(() => t("tools.common.cancel"));
const confirm = computed<string>(() => t("tools.common.ok"));

const messageVariant = props.variant === "accept" ? "approve" : "reject";
const message = `Are you sure you want to ${messageVariant} this process change notice?`;

const dialog = ref<boolean>(false);

const manager = new ProcessChangeNoticeManager();

const userStore = useUserStore();
const user = userStore.info();
if (!user) throw new Error("User at AcceptOrReject.vue resolve to false.");

const acceptOrReject = async () => {
  try {
    const formData: any = new FormData();

    formData.append("noticeId", JSON.stringify(props.pcnId));
    formData.append("assesser", JSON.stringify(user));

    const assessment: "approve" | "rejection" =
      props.variant === "accept" ? "approve" : "rejection";

    const close: { assessed: IProcessChangeRequest } = await manager.assess(formData, assessment);
    dialog.value = false;

    emit("close", close);
  } catch (error) {
    console.log(`acceptOrReject error: ${error}`);
  }
};

type CheckActionsInfo = {
  isFilled: boolean;
  isNextApprover: boolean;
  isAlreadyApproved: boolean;
};

const enableActions = async (): Promise<CheckActionsInfo> => {
  try {
    const request: IProcessChangeRequest = await manager.getNotice(props.pcrId);
    if (request.processChangeNotice === null)
      throw new Error("processChangeNotice at AcceptOrReject.vue resolve to null.");
    const notice: IProcessChangeNotice = request.processChangeNotice;
    const fields: ProcessChangeNoticeFields = new ProcessChangeNoticeFields().buildFromNotice(
      notice
    );
    // const isNotNullOrUndefined = (value: any): boolean => {
    //   return value !== undefined && value !== null;
    // };
    // const filled = Object.entries(fields)
    //   .filter(([key]) => key !== "updateDescription")
    //   .every(([_, value]) => isNotNullOrUndefined(!!value));
    const isNotNullOrUndefined = (value: any): boolean => {
      return value !== undefined && value !== null;
    };
    const isFilled: boolean = Object.entries(fields)
      .filter(([key]) => key !== "updateDescription")
      .every(([key, value]) => {
        switch (key) {
          case "listOfDocumentationToChange":
            return fields.areDocumentationChangesRequired ? isNotNullOrUndefined(value) : true;
          case "listOfDocumentationToCreate":
            return fields.isNewDocumentationRequired ? isNotNullOrUndefined(value) : true;

          default:
            return isNotNullOrUndefined(value);
        }
      });

    // const isClosed = notice.status === "Closed";
    // const isClosed = notice.dedicatedDepartmentApproval === true;

    // user.username === base.reconextOwner.toLocaleLowerCase().replace(" ", ".");
    let isNextApprover: boolean = false;

    const engDepartment = notice.engineeringDepartmentName;
    const quaDepartment = notice.qualityDepartmentName;
    const dedDepartment = request.dedicatedDepartment;

    const engApproval = notice.engineeringDepartmentApproval;
    const quaApproval = notice.qualityDepartmentApproval;
    const dedApproval = notice.dedicatedDepartmentApproval;

    const userManager = new UserManager();
    const userInfo = await userManager.getOne(user.username);
    const userDepartment = userInfo.info.department;
    const decisionMaker = userInfo.info.decisionMaker;

    let isAlreadyApproved: boolean = false;

    switch (userDepartment) {
      case engDepartment:
        if (!engApproval && decisionMaker) isNextApprover = true;
        if (engApproval) isAlreadyApproved = true;
        break;
      case quaDepartment:
        if (engApproval && !quaApproval && decisionMaker) isNextApprover = true;
        if (quaApproval) isAlreadyApproved = true;
        break;
      case dedDepartment:
        if (quaApproval && !dedApproval && decisionMaker) isNextApprover = true;
        if (dedApproval) isAlreadyApproved = true;
        break;

      default:
        break;
    }

    showActions.value = isFilled && isNextApprover;
    return { isFilled, isNextApprover, isAlreadyApproved };
  } catch (error) {
    throw new Error(`enableActions error: ${error}`);
  }
};

const showActions = ref<boolean>(false);

// const noticeId = toRef(() => props.pcnId);
// watchEffect(() => {
//   if (noticeId.value) {
//     enableActions(noticeId.value);
//   }
// });

const checkActionsInfo = ref<CheckActionsInfo>({
  isFilled: false,
  isNextApprover: false,
  isAlreadyApproved: false,
});

const checkActionsInfoAlert = computed(() => {
  return {
    "1":
      !checkActionsInfo.value.isFilled &&
      !checkActionsInfo.value.isNextApprover &&
      !checkActionsInfo.value.isAlreadyApproved,
    "2":
      checkActionsInfo.value.isFilled &&
      !checkActionsInfo.value.isNextApprover &&
      !checkActionsInfo.value.isAlreadyApproved,
    "3": !checkActionsInfo.value.isFilled && checkActionsInfo.value.isNextApprover,
    "4": checkActionsInfo.value.isFilled && checkActionsInfo.value.isAlreadyApproved,
  };
});

watchEffect(async () => {
  if (props.checkActions === true) {
    emit("resetActions");
  } else {
    const { isFilled, isNextApprover, isAlreadyApproved } = await enableActions();
    checkActionsInfo.value.isFilled = isFilled;
    checkActionsInfo.value.isNextApprover = isNextApprover;
    checkActionsInfo.value.isAlreadyApproved = isAlreadyApproved;
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
      text="Approval controls will appear once PCN is complete and you are next to approve."
      type="info"
    ></v-alert>
    <v-alert
      v-if="checkActionsInfoAlert['2']"
      variant="outlined"
      text="PCN is complete. Approval controls will appear once you are next to approve."
      type="info"
    ></v-alert>
    <v-alert
      v-if="checkActionsInfoAlert['3']"
      variant="outlined"
      text="Approval controls will appear once PCN is complete."
      type="info"
    ></v-alert>
    <v-alert
      v-if="checkActionsInfoAlert['4']"
      variant="outlined"
      text="Approval for this PCN has been granted by your department."
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
