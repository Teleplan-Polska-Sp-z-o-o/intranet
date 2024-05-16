<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PCNVerifyTables from "./PCNVerifyTable.vue";
import { IUser } from "../../../../../interfaces/user/IUser";
import { useUserStore } from "../../../../../stores/userStore";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import CkEditor from "../../../../common/CkEditor.vue";
import { useEditorStore } from "../../../../../stores/editorStore";
import { useI18n } from "vue-i18n";
import { IProcessChangeNoticeFields } from "../../../../../interfaces/change/IProcessChangeNoticeFields";

const emit = defineEmits(["save-data", "verified"]);

const props = defineProps<{
  componentProps: any;
}>();

const smallScreen = ref<boolean>(window.innerWidth < 960);

const { t } = useI18n();

const activeStep = ref<number>(1);
emit("verified", true);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 4) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 4);

const noticeId = props.componentProps.editedItem.processChangeNotice.id;

const editorStore = useEditorStore();

const changeDescription = props.componentProps.editedItem.processChangeNotice.changeDescription;

editorStore.save(
  changeDescription
    ? changeDescription
    : `<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>`,
  "notice-change-description"
);

const baseChangeDescription: string = editorStore.getDefault("change-description");

const notice = ref<IProcessChangeNoticeFields>({
  changeDescription: props.componentProps.editedItem.processChangeNotice.changeDescription,
  areDocumentationChangesRequired:
    props.componentProps.editedItem.processChangeNotice.areDocumentationChangesRequired,
  listOfDocumentationToChange:
    props.componentProps.editedItem.processChangeNotice.listOfDocumentationToChange,
  isNewDocumentationRequired:
    props.componentProps.editedItem.processChangeNotice.isNewDocumentationRequired,
  listOfDocumentationToCreate:
    props.componentProps.editedItem.processChangeNotice.listOfDocumentationToCreate,
  isCustomerApprovalRequired:
    props.componentProps.editedItem.processChangeNotice.isCustomerApprovalRequired,
  // departmentsRequiredForApproval:
  //   props.componentProps.editedItem.processChangeNotice.departmentsRequiredForApproval,
  engineeringDepartmentName:
    props.componentProps.editedItem.processChangeNotice.engineeringDepartmentName,
  qualityDepartmentName: props.componentProps.editedItem.processChangeNotice.qualityDepartmentName,
});

const departments = ref<Array<string>>([]);

const departmentsManager = new DepartmentsManager();

const fillDepartments = async () => {
  const got = await departmentsManager.get();
  const selectOptions = got.map((dep) => dep.name);
  departments.value = selectOptions;
};

fillDepartments();

const userStore = useUserStore();

const newNoticeData = computed<
  { fields: IProcessChangeNoticeFields } & { assesser: IUser } & { noticeId: number }
>((): { fields: IProcessChangeNoticeFields } & { assesser: IUser } & { noticeId: number } => {
  const req: IProcessChangeNoticeFields = notice.value;
  const user: IUser | false = userStore.info();

  if (!user) throw new Error("User evaluates to false, user's local store is empty");

  const object: IProcessChangeNoticeFields = {
    changeDescription: req.changeDescription,
    areDocumentationChangesRequired: req.areDocumentationChangesRequired,
    listOfDocumentationToChange: req.listOfDocumentationToChange,
    isNewDocumentationRequired: req.isNewDocumentationRequired,
    listOfDocumentationToCreate: req.listOfDocumentationToCreate,
    isCustomerApprovalRequired: req.isCustomerApprovalRequired,
    // departmentsRequiredForApproval: req.departmentsRequiredForApproval,
    engineeringDepartmentName: req.engineeringDepartmentName,
    qualityDepartmentName: req.qualityDepartmentName,
  };

  return {
    fields: { ...object, changeDescription: editorStore.get("notice-change-description") },
    assesser: user,
    noticeId,
  };
});

type Completed = { step1: boolean; step2: boolean; step3: boolean };
const completed = computed<Completed>(() => {
  const noti = notice.value;

  const step1 = !!noti.changeDescription && noti.changeDescription !== baseChangeDescription;
  const step2 =
    noti.areDocumentationChangesRequired !== null &&
    (!!noti.areDocumentationChangesRequired
      ? !!noti.listOfDocumentationToChange && noti.listOfDocumentationToChange?.length > 0
      : true) &&
    noti.isNewDocumentationRequired !== null &&
    (!!noti.isNewDocumentationRequired
      ? !!noti.listOfDocumentationToCreate && noti.listOfDocumentationToCreate?.length > 0
      : true);
  const step3 =
    noti.isCustomerApprovalRequired !== null &&
    noti.engineeringDepartmentName !== undefined &&
    noti.qualityDepartmentName !== undefined;

  return {
    step1,
    step2,
    step3,
  };
});

const departmentsTest = computed<boolean>(() => {
  if (
    notice.value.engineeringDepartmentName !== undefined &&
    notice.value.qualityDepartmentName !== undefined
  ) {
    return notice.value.engineeringDepartmentName !== notice.value.qualityDepartmentName;
  } else return true;
});
const engineeringDepartmentRule = (value: string) => {
  if (value && value !== notice.value.qualityDepartmentName) {
    return true;
  }
  return t("tools.change.tabs.pcn.stepper.qualityDepartmentRule");
};
const qualityDepartmentRule = (value: string) => {
  if (value && value !== notice.value.engineeringDepartmentName) {
    return true;
  }
  return t("tools.change.tabs.pcn.stepper.qualityDepartmentRule");
};

watch(activeStep, (newActiveStep) => {
  notice.value = {
    ...notice.value,
    changeDescription: editorStore.get("notice-change-description"),
  };
  if (newActiveStep === 4 && departmentsTest.value) {
    emit("verified", false);
    emit("save-data", newNoticeData.value);
  } else {
    emit("verified", true);
  }
});
</script>

<template>
  <v-stepper
    max-height="60vh"
    style="overflow-y: auto"
    :mobile="smallScreen ? true : false"
    v-model="activeStep"
    class="rounded-xl"
  >
    <v-stepper-header class="rounded-xl">
      <v-stepper-item
        :color="!completed.step1 ? 'warning' : 'secondary'"
        :editable="!completed.step1"
        :complete="completed.step1"
        :value="1"
        :title="$t(`tools.change.tabs.pcn.stepper.vStepperItem['1']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step2 ? 'warning' : 'secondary'"
        :editable="!completed.step2"
        :complete="completed.step2"
        :value="2"
        :title="$t(`tools.change.tabs.pcn.stepper.vStepperItem['2']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step3 ? 'warning' : 'secondary'"
        :editable="!completed.step3"
        :complete="completed.step3"
        :error="!departmentsTest"
        :value="3"
        :title="$t(`tools.change.tabs.pcn.stepper.vStepperItem['3']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :value="4"
        :title="$t(`tools.change.tabs.pcn.stepper.vStepperItem['4']`)"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <ck-editor editorKey="notice-change-description"></ck-editor>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <v-select
            v-model="notice.areDocumentationChangesRequired"
            variant="underlined"
            clearable
            :label="
              $t(
                `tools.change.tabs.pcn.stepper.vStepperWindowItem['2'].areDocumentationChangesRequired`
              )
            "
            item-title="title"
            item-value="bool"
            :items="[
              { title: 'Yes', bool: true },
              { title: 'No', bool: false },
            ]"
          ></v-select>
          <v-combobox
            :disabled="!notice.areDocumentationChangesRequired"
            :modelValue="
              notice.listOfDocumentationToChange
                ? JSON.parse(notice.listOfDocumentationToChange)
                : null
            "
            @update:modelValue="(value: Array<string>) => (notice.listOfDocumentationToChange = JSON.stringify(value))"
            clearable
            chips
            multiple
            :label="
              $t(
                `tools.change.tabs.pcn.stepper.vStepperWindowItem['2'].listOfDocumentationToChange`
              )
            "
            :items="[]"
          ></v-combobox>

          <v-select
            v-model="notice.isNewDocumentationRequired"
            variant="underlined"
            clearable
            :label="
              $t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['2'].isNewDocumentationRequired`)
            "
            item-title="title"
            item-value="bool"
            :items="[
              { title: 'Yes', bool: true },
              { title: 'No', bool: false },
            ]"
          ></v-select>
          <v-combobox
            :disabled="!notice.isNewDocumentationRequired"
            :modelValue="
              notice.listOfDocumentationToCreate
                ? JSON.parse(notice.listOfDocumentationToCreate)
                : null
            "
            @update:modelValue="(value: Array<string>) => (notice.listOfDocumentationToCreate = JSON.stringify(value))"
            clearable
            chips
            multiple
            :label="
              $t(
                `tools.change.tabs.pcn.stepper.vStepperWindowItem['2'].listOfDocumentationToCreate`
              )
            "
            :items="[]"
          ></v-combobox>
        </v-card>
      </v-stepper-window-item>
      <v-stepper-window-item :value="3">
        <v-card flat>
          <v-select
            v-model="notice.isCustomerApprovalRequired"
            variant="underlined"
            clearable
            :label="
              $t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].isCustomerApprovalRequired`)
            "
            item-title="title"
            item-value="bool"
            :items="[
              { title: 'Yes', bool: true },
              { title: 'No', bool: false },
            ]"
          ></v-select>

          <v-alert
            icon="$info"
            color="info"
            border="start"
            :title="$t(`tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.title`)"
            variant="tonal"
            class="mb-2"
          >
            <v-list lines="three" bg-color="transparent">
              <v-list-item>
                <v-list-item-title>{{
                  $t(
                    `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.initial.title`
                  )
                }}</v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    $t(
                      `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.initial.text`
                    )
                  }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>{{
                  $t(
                    `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.required-review.title`
                  )
                }}</v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    $t(
                      `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.required-review.text`
                    )
                  }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{
                  $t(
                    `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.optional-review.title`
                  )
                }}</v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    $t(
                      `tools.change.tabs.pcn.stepper.alerts.departmentsRequiredForApproval.optional-review.text`
                    )
                  }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-alert>
          <v-autocomplete
            :modelValue="notice.engineeringDepartmentName"
            @update:modelValue="(value: string) => (notice.engineeringDepartmentName = value)"
            variant="underlined"
            clearable
            :label="
              $t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].engineeringDepartmentName`)
            "
            :items="departments"
            :rules="[engineeringDepartmentRule]"
          ></v-autocomplete>
          <v-autocomplete
            :modelValue="notice.qualityDepartmentName"
            @update:modelValue="(value: string) => (notice.qualityDepartmentName = value)"
            variant="underlined"
            clearable
            :label="
              $t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].qualityDepartmentName`)
            "
            :items="departments"
            :rules="[qualityDepartmentRule]"
          ></v-autocomplete>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <p-c-n-verify-tables :eNotice="notice"></p-c-n-verify-tables>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="prevStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!prevable"
          >{{ $t("tools.change.tabs.pcn.stepper.actions.prev") }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >{{ $t("tools.change.tabs.pcn.stepper.actions.next") }}</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<style scoped>
#vdp {
  overflow-x: auto;
}
</style>
