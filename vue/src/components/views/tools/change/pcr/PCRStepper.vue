<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
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

const emit = defineEmits(["save-data", "verified"]);

const props = defineProps<{
  componentProps: any;
}>();

const smallScreen = ref<boolean>(window.innerWidth < 960);

const activeStep = ref<number>(1);
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
  changeReason: props.componentProps.editedItem.changeReason,
  changeDescription: props.componentProps.editedItem.changeDescription,
  impacts: props.componentProps.editedItem.impacts,
  dedicatedDepartment: props.componentProps.editedItem.dedicatedDepartment,
  riskAnalysis: props.componentProps.editedItem.riskAnalysis,
});

watchEffect(() => {
  request.value = props.componentProps.editedItem;
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
  const date = request.value.dateNeeded;
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

    modelOrProcessImpacted: req.modelOrProcessImpacted.trim(),
    costOfImplementation: req.costOfImplementation.trim(),
    changeReason: req.changeReason.trim(),
    changeDescription: req.changeDescription.trim(),
    impacts: req.impacts.trim(),
    riskAnalysis: req.riskAnalysis?.trim(),
  };

  return {
    ...object,
    requestedBy: user,
    requestId,
  };
});

const customerContactPersonRule = [
  (v: string) => !!v || "Customer Contact Person field is required.",
  (v: string) =>
    /^[a-zA-Z]+ [a-zA-Z]+$/.test(v) ||
    "Please enter both a name and a surname separated by a space.",
];
const reconextContactPersonRule = [
  (v: string) => !!v || "Reconext Contact Person field is required",
];
const reconextOwnerRule = [(v: string) => !!v || "Reconext Owner field is required"];
const modelOrProcessImpactedRule = [
  (v: string) => !!v || "Model or Process Impacted field is required.",
];
const costOfImplementationRule = [
  (v: string) => !!v || "Cost of Implementation field is required.",
];
const changeReasonRule = [(v: string) => !!v || "Change Reason field is required."];
const changeDescriptionRule = [(v: string) => !!v || "Change Description field is required."];
const impactsRule = [(v: string) => !!v || "Impacts field is required."];

const customerContactEmailRule = [
  (v: string) => !!v || "Customer Contact Email field is required.",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid.",
];

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

watchEffect(() => {
  if (
    completed.value.step1 &&
    completed.value.step2 &&
    completed.value.step3 &&
    completed.value.step4 &&
    activeStep.value === 5
  ) {
    emit("verified", false);
    emit("save-data", newRequestData.value);
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
        :error="activeStep > 1 && !completed.step1"
        :complete="activeStep > 1 && completed.step1"
        :value="1"
        title="Base Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :error="activeStep > 2 && !completed.step2"
        :complete="activeStep > 2 && completed.step2"
        :value="2"
        title="Contact Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :error="activeStep > 3 && !completed.step3"
        :complete="activeStep > 3 && completed.step3"
        :value="3"
        title="Need Date"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :error="activeStep > 4 && !completed.step4"
        :complete="activeStep > 4 && completed.step4"
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
            v-model="request.dedicatedDepartment"
            variant="underlined"
            label="Dedicated Department"
            :items="departments"
          ></v-autocomplete>
          <v-autocomplete
            v-model="request.program"
            variant="underlined"
            label="Program"
            :items="programs"
          ></v-autocomplete>
          <v-autocomplete
            v-model="request.reconextOwner"
            variant="underlined"
            label="Reconext Owner"
            :items="reconextUsers"
            :rules="reconextOwnerRule"
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
            v-model="request.reconextContactPerson"
            variant="underlined"
            label="Reconext Contact Person"
            :items="reconextUsers"
            :rules="reconextContactPersonRule"
          ></v-autocomplete>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat class="d-flex justify-center align-center">
          <v-date-picker
            color="primary"
            width="100%"
            title="Implementation Need Date"
            v-model="request.dateNeeded"
            show-adjacent-months
          ></v-date-picker>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <v-text-field
            v-model="request.modelOrProcessImpacted"
            variant="underlined"
            label="Model or Process Impacted"
            :rules="modelOrProcessImpactedRule"
          ></v-text-field>
          <v-text-field
            v-model="request.costOfImplementation"
            variant="underlined"
            label="Cost of Implementation"
            :rules="costOfImplementationRule"
          ></v-text-field>
          <v-textarea
            v-model="request.changeReason"
            variant="underlined"
            label="Change Reason"
            :rules="changeReasonRule"
          ></v-textarea>
          <v-textarea
            v-model="request.changeDescription"
            variant="underlined"
            label="Change Description"
            :rules="changeDescriptionRule"
          ></v-textarea>
          <v-text-field
            v-model="request.impacts"
            variant="underlined"
            label="Impacts"
            :rules="impactsRule"
          ></v-text-field>
          <v-textarea
            v-model="request.riskAnalysis"
            variant="underlined"
            label="Optional: Risk Analysis"
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
