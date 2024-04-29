<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PCRVerifyTables from "./PCRVerifyTable.vue";
import { IProcessChangeRequestBase } from "../../../../../interfaces/change/IProcessChangeRequestBase";
import { IUser } from "../../../../../interfaces/user/IUser";
import { useUserStore } from "../../../../../stores/userStore";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
import { IChips } from "../../../../../interfaces/document/IChips";
import { Chips } from "../../../../../models/document/Chips";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { UserManager } from "../../../../../models/user/UserManager";
import CkEditor from "../../../../common/CkEditor.vue";
import { useEditorStore } from "../../../../../stores/editorStore";

const emit = defineEmits(["save-data", "verified"]);

const props = defineProps<{
  componentProps: any;
}>();

const smallScreen = ref<boolean>(window.innerWidth < 960);

const activeStep = ref<number>(1);
emit("verified", true);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 5) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 5);

const requestId = props.componentProps.editedItem.id;
const requestUpdatable = props.componentProps.editedItem.updatable;

const editorStore = useEditorStore();

const changeReason = props.componentProps.editedItem.changeReason;
const changeDescription = props.componentProps.editedItem.changeDescription;
editorStore.save(
  changeReason ? changeReason : '<p><span style="color:hsl(0, 0%, 60%);">Change Reason</span></p>',
  "change-reason"
);
editorStore.save(
  changeDescription
    ? changeDescription
    : '<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>',
  "change-description"
);

const request = ref<IProcessChangeRequestBase>({
  internalOrExternal: props.componentProps.editedItem.internalOrExternal,
  customerContactPerson: props.componentProps.editedItem.customerContactPerson,
  customerContactEmail: props.componentProps.editedItem.customerContactEmail,
  reconextContactPerson: props.componentProps.editedItem.reconextContactPerson,
  reconextOwner: props.componentProps.editedItem.reconextOwner,
  dateNeeded: props.componentProps.editedItem.dateNeeded,
  costOfImplementation: props.componentProps.editedItem.costOfImplementation,
  program: props.componentProps.editedItem.program,
  modelOrProcessImpacted: props.componentProps.editedItem.modelOrProcessImpacted,
  changeReason: editorStore.get("change-reason"),
  changeDescription: editorStore.get("change-description"),
  impacts: props.componentProps.editedItem.impacts,
  dedicatedDepartment: props.componentProps.editedItem.dedicatedDepartment,
  riskAnalysis: props.componentProps.editedItem.riskAnalysis,
  updateDescription: undefined,
});

const departments = ref<Array<string>>([]);
const programs = ref<Array<string>>([]);

const departmentsManager = new DepartmentsManager();
const programsManager = new CategoriesManager();

const fillDepartments = async () => {
  const got = await departmentsManager.get();
  const selectOptions = got.map((dep) => dep.name);
  departments.value = selectOptions;
};

fillDepartments();

const fillPrograms = async () => {
  const reqData: IChips = new Chips(request.value.dedicatedDepartment);
  programs.value = (await programsManager.get(reqData)).map((prog) => prog.name);
};

if (request.value.dedicatedDepartment) fillPrograms();

watch(
  () => request.value.dedicatedDepartment,
  async (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      request.value.program = "";
      fillPrograms();
    }
  }
);

(async () => {
  const date = request.value.dateNeeded || undefined;
  if (date) {
    const [day, month, year] = date.toString().split("/").map(Number);
    request.value.dateNeeded = new Date(year, month - 1, day);
  }
})();

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

const userStore = useUserStore();

const newRequestData = computed<
  IProcessChangeRequestBase & { requestedBy: IUser } & { requestId: number }
>((): IProcessChangeRequestBase & { requestedBy: IUser } & { requestId: number } => {
  const req: IProcessChangeRequestBase = request.value;
  const user: IUser | false = userStore.info();

  if (!user) throw new Error("User evaluates to false, user's local store is empty");

  const object: IProcessChangeRequestBase = {
    internalOrExternal: req.internalOrExternal,
    reconextOwner: req.reconextOwner,
    dedicatedDepartment: req.dedicatedDepartment,
    program: req.program,

    customerContactPerson: req.customerContactPerson.trim(),
    customerContactEmail: req.customerContactEmail.trim(),
    reconextContactPerson: req.reconextContactPerson,

    dateNeeded: req.dateNeeded,

    changeReason: req.changeReason,
    changeDescription: req.changeDescription,

    modelOrProcessImpacted: req.modelOrProcessImpacted.trim(),
    costOfImplementation: req.costOfImplementation.trim(),
    impacts: req.impacts.trim(),
    riskAnalysis: req.riskAnalysis?.trim(),
    updateDescription: req.updateDescription?.trim(),
  };

  return {
    ...object,
    changeReason: editorStore.get("change-reason"),
    changeDescription: editorStore.get("change-description"),
    requestedBy: user,
    requestId,
  };
});

const customerContactPersonRule = [
  (v: string) =>
    /^[a-zA-Z]+ [a-zA-Z]+$/.test(v) ||
    "Please enter both a name and a surname separated by a space.",
];

const customerContactEmailRule = [(v: string) => /.+@.+\..+/.test(v) || "Email must be valid."];

// const reconextContactPersonRule = [
//   (v: string) => !!v || "Reconext Contact Person field is required",
// ];
// const reconextOwnerRule = [(v: string) => !!v || "Reconext Owner field is required"];
// const modelOrProcessImpactedRule = [
//   (v: string) => !!v || "Model or Process Impacted field is required.",
// ];
// const costOfImplementationRule = [
//   (v: string) => !!v || "Cost of Implementation field is required.",
// ];
// const changeReasonRule = [(v: string) => !!v || "Change Reason field is required."];
// const changeDescriptionRule = [(v: string) => !!v || "Change Description field is required."];
// const impactsRule = [(v: string) => !!v || "Impacts field is required."];

type Completed = { step1: boolean; step2: boolean; step3: boolean; step4: boolean };
const completed = computed<Completed>(() => {
  const req = request.value;

  const step1 = !!req.reconextOwner && !!req.dedicatedDepartment && !!req.program;
  const step2 =
    /^[a-zA-Z]+ [a-zA-Z]+$/.test(req.customerContactPerson) &&
    /.+@.+\..+/.test(req.customerContactEmail) &&
    !!req.reconextContactPerson;
  const step3 = !!req.dateNeeded;
  const step4 =
    !!req.modelOrProcessImpacted &&
    !!req.costOfImplementation &&
    !!req.changeReason &&
    !!req.changeDescription &&
    !!req.impacts;

  return {
    step1,
    step2,
    step3,
    step4,
  };
});

const tests = computed<boolean>(() => {
  const req = request.value;
  const testCustomerContactPerson: boolean = req.customerContactPerson
    ? /^[a-zA-Z]+ [a-zA-Z]+$/.test(req.customerContactPerson)
    : true;
  const testCustomerContactEmail: boolean = req.customerContactEmail
    ? /.+@.+\..+/.test(req.customerContactEmail)
    : true;

  return testCustomerContactPerson && testCustomerContactEmail;
});

watch(activeStep, (newActiveStep) => {
  if (newActiveStep === 5) {
    request.value = {
      ...request.value,
      changeReason: editorStore.get("change-reason"),
      changeDescription: editorStore.get("change-description"),
    };

    if (requestUpdatable === true && request.value.updateDescription) {
      emit("verified", false);
      emit("save-data", newRequestData.value);
    } else if (!requestUpdatable) {
      emit("verified", false);
      emit("save-data", newRequestData.value);
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
        color="secondary"
        :editable="!completed.step1"
        :complete="completed.step1"
        :value="1"
        title="Base Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :editable="!completed.step2"
        :error="!tests"
        :complete="completed.step2"
        :value="2"
        title="Contact Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :editable="!completed.step3"
        :complete="completed.step3"
        :value="3"
        title="Need Date"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :editable="!completed.step4"
        :complete="completed.step4"
        :value="4"
        title="Descriptive Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item color="secondary" :value="5" title="Verify"></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-select
            v-model="request.internalOrExternal"
            variant="underlined"
            label="Internal or External"
            :items="['Internal', 'External']"
          ></v-select>
          <v-autocomplete
            variant="underlined"
            label="Dedicated Department"
            :items="departments"
            :modelValue="request.dedicatedDepartment"
            @update:modelValue="(value: string | null) => (request.dedicatedDepartment = value || '')"
            clearable
          ></v-autocomplete>
          <v-autocomplete
            variant="underlined"
            label="Program"
            :items="programs"
            clearable
            :modelValue="request.program"
            @update:modelValue="(value: string | null) => (request.program = value || '')"
          ></v-autocomplete>
          <v-autocomplete
            variant="underlined"
            label="Reconext Owner"
            :items="reconextUsers"
            clearable
            :modelValue="request.reconextOwner"
            @update:modelValue="(value: string | null) => (request.reconextOwner = value || '')"
          ></v-autocomplete>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <v-text-field
            v-model="request.customerContactPerson"
            variant="underlined"
            label="Customer Contact Person"
            :rules="customerContactPersonRule"
          ></v-text-field>

          <v-text-field
            v-model="request.customerContactEmail"
            variant="underlined"
            label="Customer Contact Email"
            :rules="customerContactEmailRule"
          ></v-text-field>
          <v-autocomplete
            variant="underlined"
            label="Reconext Contact Person"
            :items="reconextUsers"
            clearable
            :modelValue="request.reconextContactPerson"
            @update:modelValue="(value: string | null) => (request.reconextContactPerson = value || '')"
          ></v-autocomplete>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3" id="vdp">
        <v-card flat class="d-flex justify-center align-center" min-width="362.69px">
          <v-card-text>
            <v-date-picker
              color="primary"
              width="100%"
              @update:modelValue="(value : Date) => (request.dateNeeded = value)"
              :modelValue="request.dateNeeded || undefined"
              show-adjacent-months
            >
              <template v-slot:title>
                <v-btn variant="tonal" class="rounded-xl" @click="request.dateNeeded = undefined"
                  >Clear Implementation Need Date</v-btn
                >
              </template>
            </v-date-picker>
          </v-card-text>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <v-textarea
            v-model="request.modelOrProcessImpacted"
            variant="underlined"
            label="Model or Process Impacted"
          ></v-textarea>

          <v-textarea
            v-model="request.costOfImplementation"
            variant="underlined"
            label="Cost of Implementation"
          ></v-textarea>
          <ck-editor editorKey="change-reason"></ck-editor>
          <ck-editor editorKey="change-description"></ck-editor>
          <v-textarea v-model="request.impacts" variant="underlined" label="Impacts"></v-textarea>
          <v-textarea
            v-model="request.riskAnalysis"
            variant="underlined"
            label="Risk Analysis"
          ></v-textarea>
          <v-textarea
            v-if="requestUpdatable"
            v-model="request.updateDescription"
            variant="underlined"
            label="Update Description"
          ></v-textarea>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="5">
        <v-card flat>
          <p-c-r-verify-tables :eRequest="request"></p-c-r-verify-tables>
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
          >Previous</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >Next</v-btn
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
