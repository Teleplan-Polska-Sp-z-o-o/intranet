<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PCNVerifyTables from "./PCNVerifyTable.vue";
import { IUser } from "../../../../../interfaces/user/UserTypes";
import { useUserStore } from "../../../../../stores/userStore";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import CkEditor from "../../../../common/CkEditor.vue";
import { useEditorStore } from "../../../../../stores/editorStore";
import { useI18n } from "vue-i18n";
import { IProcessChangeNoticeFields } from "../../../../../interfaces/change/IProcessChangeNoticeFields";
import { UserManager } from "../../../../../models/user/UserManager";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { IProcessChangeNotice } from "../../../../../interfaces/change/IProcessChangeNotice";

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
const noticeUpdatable: boolean = props.componentProps.editedItem.processChangeNotice.updatable;
const editorStore = useEditorStore();

const changeDescription = props.componentProps.editedItem.processChangeNotice.changeDescription;

const changeDescriptionKey = "notice-change-description";

editorStore.save(
  changeDescription
    ? changeDescription
    : `<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>`,
  changeDescriptionKey
);

const baseChangeDescription: string = editorStore.getDefault("change-description");

const notice = ref<IProcessChangeNoticeFields>({
  changeDescription: editorStore.get(changeDescriptionKey),
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
  personDesignatedForImplementation:
    props.componentProps.editedItem.processChangeNotice.personDesignatedForImplementation,
  updateDescription: null,
});

const handleEditorDataChange = (key: string) => {
  notice.value.changeDescription = editorStore.get(key);
};

const departments = ref<Array<string>>([]);

const departmentsManager = new DepartmentsManager();

const fillDepartments = async () => {
  const got = await departmentsManager.get();
  const selectOptions = got.map((dep) => dep.name);
  departments.value = selectOptions;
};

fillDepartments();

const userStore = useUserStore();

const reconextUsers = ref<Array<string>>([]);

(async () => {
  const userManager: UserManager = new UserManager();
  const users: Array<IUserEntity> = await userManager.get("moderator");
  const usernames: Array<string> = users.map((user) => user.username);
  const selectOptions: Array<string> = usernames.map((username) => {
    const parts: Array<string> = username.split(".");
    return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  });
  reconextUsers.value = selectOptions;
})();

const newNoticeData = computed<
  { fields: IProcessChangeNoticeFields } & { assesser: IUser } & { noticeId: number }
>((): { fields: IProcessChangeNoticeFields } & { assesser: IUser } & { noticeId: number } => {
  const user: IUser | false = userStore.info();

  if (!user) throw new Error("User evaluates to false, user's local store is empty");

  const object: IProcessChangeNoticeFields = {
    changeDescription: notice.value.changeDescription,
    areDocumentationChangesRequired: notice.value.areDocumentationChangesRequired,
    listOfDocumentationToChange: notice.value.listOfDocumentationToChange,
    isNewDocumentationRequired: notice.value.isNewDocumentationRequired,
    listOfDocumentationToCreate: notice.value.listOfDocumentationToCreate,
    isCustomerApprovalRequired: notice.value.isCustomerApprovalRequired,
    // departmentsRequiredForApproval: notice.value.departmentsRequiredForApproval,
    engineeringDepartmentName: notice.value.engineeringDepartmentName,
    qualityDepartmentName: notice.value.qualityDepartmentName,
    personDesignatedForImplementation: notice.value.personDesignatedForImplementation,
    updateDescription: notice.value.updateDescription,
  };
  // fields: { ...object, changeDescription: editorStore.get("notice-change-description") },
  return {
    fields: object,
    assesser: user,
    noticeId,
  };
});

type Completed = { step1: boolean; step2: boolean; step3: boolean };
const completed = computed<Completed>(() => {
  const step1 =
    !!notice.value.changeDescription && notice.value.changeDescription !== baseChangeDescription;
  const step2 =
    notice.value.areDocumentationChangesRequired !== null &&
    (!!notice.value.areDocumentationChangesRequired
      ? !!notice.value.listOfDocumentationToChange &&
        notice.value.listOfDocumentationToChange?.length > 0
      : true) &&
    notice.value.isNewDocumentationRequired !== null &&
    (!!notice.value.isNewDocumentationRequired
      ? !!notice.value.listOfDocumentationToCreate &&
        notice.value.listOfDocumentationToCreate?.length > 0
      : true);
  const step3 =
    notice.value.personDesignatedForImplementation !== null &&
    notice.value.isCustomerApprovalRequired !== null &&
    notice.value.engineeringDepartmentName !== undefined &&
    notice.value.qualityDepartmentName !== undefined &&
    (noticeUpdatable ? !!notice.value.updateDescription : true);

  return {
    step1,
    step2,
    step3,
  };
});

const departmentsTest = computed<boolean>(() => {
  if (notice.value.engineeringDepartmentName && notice.value.qualityDepartmentName) {
    return notice.value.engineeringDepartmentName !== notice.value.qualityDepartmentName;
  } else return true;
});

const updateDescriptionError = ref<boolean>(false);
const updateDescriptionRule = [
  (v: string) => {
    if (!v) updateDescriptionError.value = true;
    else updateDescriptionError.value = false;
    return !!v || t("tools.change.tabs.pcn.stepper.updateDescriptionRule");
  },
];

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

const updatedFields = computed((): Array<string> => {
  try {
    const editedItem: IProcessChangeNotice | null =
      props.componentProps.editedItem?.processChangeNotice;
    if (editedItem) {
      const fields: Array<string> = [];

      for (const key in notice.value) {
        switch (key) {
          case "updateDescription":
            continue;

          default:
            if (notice.value[key] !== editedItem[key]) {
              fields.push(key);
            }
            continue;
        }
      }

      return fields;
    } else return [];
  } catch (error) {
    console.error(`PCN Stepper at updatedFields, ${error}`);
    return [];
  }
});

watch(
  () => editorStore.editors,
  (editors) => {
    let changeDescriptionValue: string = "";
    if (editors[changeDescriptionKey])
      changeDescriptionValue = editorStore.get(changeDescriptionKey);

    notice.value = {
      ...notice.value,
      changeDescription: changeDescriptionValue,
    };
  }
);

watch(activeStep, (newActiveStep) => {
  if (newActiveStep === 4 && departmentsTest.value) {
    if (noticeUpdatable && updatedFields.value.length > 0 && notice.value.updateDescription) {
      emit("verified", false);
      emit("save-data", newNoticeData.value);
    } else if (!noticeUpdatable || updatedFields.value.length === 0) {
      emit("verified", false);
      emit("save-data", newNoticeData.value);
    }
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
          <ck-editor
            editorKey="notice-change-description"
            @editorDataChange="handleEditorDataChange"
          ></ck-editor>
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
          <!-- personDesignatedForImplementation -->
          <v-autocomplete
            variant="underlined"
            :label="
              $t(
                `tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].personDesignatedForImplementation`
              )
            "
            :items="reconextUsers"
            clearable
            :modelValue="notice.personDesignatedForImplementation"
            @update:modelValue="(value: string | null) => (notice.personDesignatedForImplementation = value || null)"
          ></v-autocomplete>
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

          <template v-if="noticeUpdatable && updatedFields.length > 0">
            <v-alert
              type="warning"
              border="start"
              :title="$t(`tools.change.tabs.pcn.stepper.alerts.remainder.title`)"
              variant="tonal"
            >
              {{ $t(`tools.change.tabs.pcn.stepper.alerts.remainder.text`) }}
            </v-alert>
            <v-textarea
              class="mt-2"
              v-model="notice.updateDescription"
              variant="underlined"
              :label="$t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].updateDescription`)"
              :rules="updateDescriptionRule"
            ></v-textarea>
            <div class="mb-2">
              {{ $t(`tools.change.tabs.pcn.stepper.alerts.remainder.fields`) }}
            </div>
            <v-chip v-for="chip in updatedFields" class="mr-2"> {{ chip }} </v-chip>
          </template>
          <template v-if="noticeUpdatable && updatedFields.length === 0">
            <v-alert
              type="warning"
              border="start"
              :title="$t(`tools.change.tabs.pcn.stepper.alerts.emptyUpdate.title`)"
              variant="tonal"
            >
              {{ $t(`tools.change.tabs.pcn.stepper.alerts.emptyUpdate.text`) }}
            </v-alert>
            <!-- <v-textarea
              class="mt-2"
              v-model="notice.updateDescription"
              variant="underlined"
              :label="$t(`tools.change.tabs.pcn.stepper.vStepperWindowItem['3'].updateDescription`)"
              :rules="updateDescriptionRule"
            ></v-textarea> -->
          </template>
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
