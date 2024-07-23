<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from "vue";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { useEditorStore } from "../../../../../stores/editorStore";
import CkEditor from "../../../../common/CkEditor.vue";
import { UserManager } from "../../../../../models/user/UserManager";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { ICompetence, IFileItem } from "../../../../../interfaces/document/DocumentTypes";
import { CompetenceManager } from "../../../../../models/document/CompetenceManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
// import { nodeConfig } from "../../../../../config/env";
// import { Endpoints } from "../../../../../config/Endpoints";
// import axios from "axios";
// import FilesForm from "./FilesForm.vue";
import FilesForm from "../../common/FilesForm.vue";
import { FileItem } from "../../../../../models/document/FileItem";
import DCRVerifyTable from "./DCRVerifyTable.vue";
import { FileHelper } from "../../../../../models/common/Files/FileHelper";
import { Chips } from "../../../../../models/document/Chips";

const emit = defineEmits(["save-data", "verified"]);
const smallScreen = ref<boolean>(window.innerWidth < 960);

const props = defineProps<{
  componentProps: {
    editedItem: DocumentChangeTypes.TDocumentChange;
    items: DocumentChangeTypes.TDocumentChange[];
  };
}>();

emit("verified", true);
const activeStep = ref<number>(1);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 6) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 6);

// affected
const editorStore = useEditorStore();
const affectedKey = "affected";
const affectedDefault = editorStore.getDefault(affectedKey, true);
const affected = props.componentProps.editedItem.affected;
editorStore.save(affected ? affected : affectedDefault, affectedKey);

const documentChangeFields = ref<DocumentChangeTypes.IDocumentChangeFields>({
  priority: props.componentProps.editedItem.priority,
  affected: editorStore.get(affectedKey),
  docxNumber: props.componentProps.editedItem.docxNumber,
  docxRevision: props.componentProps.editedItem.docxRevision,
  docxReference: props.componentProps.editedItem.docxReference,
  checker: props.componentProps.editedItem.checker,
  approver: props.componentProps.editedItem.approver,
  registerer: props.componentProps.editedItem.registerer,
  affectedCompetences: props.componentProps.editedItem.affectedCompetences,
  requireAcknowledgmentOrTraining: props.componentProps.editedItem.requireAcknowledgmentOrTraining,
  trainingDetails: props.componentProps.editedItem.trainingDetails,
  fileNames: props.componentProps.editedItem.fileNames,
});

const handleEditorDataChange = (key: string) => {
  documentChangeFields.value.affected = editorStore.get(key);
};

// number
// const docxNumberRequired = (value: string) => {
//   const exist: boolean = props.componentProps.items.some((item) => {
//     return item.docxNumber === value;
//   });
//   return value || `Request of such number already exists.`;
// };

// documents
const documentUpdate = ref<boolean>(props.componentProps.editedItem.docxNumber ? true : false);
// const numberAlreadyExist = computed(() =>
//   props.componentProps.items.some((item) => {
//     return (
//       item.docxNumber === documentChangeFields.value.docxNumber &&
//       item.id !== props.componentProps.editedItem.id
//     );
//   })
// );
const documents = ref<Array<{ name: string; ref: string }>>([]);
(async () => {
  const documentManager: DocumentManager = new DocumentManager();
  const options: Array<IDocumentEntity> = await documentManager.get(new Chips());
  documents.value = options
    .filter((doc) =>
      props.componentProps.items.length
        ? props.componentProps.items.some((item) => item.docxReference !== doc.ref)
        : true
    )
    .map((doc) => {
      return { name: doc.name, ref: doc.ref };
    });
})();
const parsedDocxNumber = computed(() => {
  const docxNumber = documentChangeFields.value.docxNumber;
  const docxReference = documentChangeFields.value.docxReference;
  if (docxNumber && docxReference) {
    return docxNumber;
  }
  return "";
});

const updateDocxNumber = (ref: string | null) => {
  if (ref) {
    const selectedDoc = documents.value.find((doc) => doc.ref === ref);
    if (selectedDoc) {
      documentChangeFields.value.docxNumber = selectedDoc.name;
      documentChangeFields.value.docxReference = selectedDoc.ref;
    }
  } else {
    documentChangeFields.value.docxNumber = null;
    documentChangeFields.value.docxReference = "";
  }
};

// const docxNumberErrorMessages: ComputedRef<string[]> = computed(() => {
//   if (numberAlreadyExist.value) return [`Request of such number already exists.`];
//   else return [];
// });

// revision
const highestRevisionByDocumentNumber = ref<number>(0);
watch(
  () => documentChangeFields.value.docxNumber,
  async (newDocxNumber) => {
    if (newDocxNumber) {
      const manager: DocumentManager = new DocumentManager();
      const documents: IDocumentEntity[] = await manager.getByNumber(newDocxNumber);
      if (documents.length === 0) highestRevisionByDocumentNumber.value = 0;
      else {
        const highestRevision = documents.reduce((max, doc) =>
          doc.revision > max.revision ? doc : max
        );
        highestRevisionByDocumentNumber.value = highestRevision.revision;
      }
    }
  }
);
// const docxRevisionRule = (value: number) => {
//   return (
//     value > highestRevisionByDocumentNumber.value ||
//     `Found an uploaded document of such number having revision ${highestRevisionByDocumentNumber.value}. Please enter a higher revision.`
//   );
// };

// const revisionNotOneIfDocxNumberIsNull = computed(() => {
//   return (
//     documentChangeFields.value.docxNumber === null && documentChangeFields.value.docxRevision !== 1
//   );
// });

const revisionToLow = computed(
  () => documentChangeFields.value.docxRevision <= highestRevisionByDocumentNumber.value
);
const revisionErrorMessages: ComputedRef<string[]> = computed(() => {
  if (revisionToLow.value)
    return [
      `Found an uploaded document of such number having revision ${highestRevisionByDocumentNumber.value}. Please enter a higher revision.`,
    ];
  else return [];
});

// users for checker, approver and registerer
// const checkerFilled = computed(() => !!documentChangeFields.value.checker);
// const approverFilled = computed(() => !!documentChangeFields.value.approver);
// const registererFilled = computed(() => !!documentChangeFields.value.registerer);

// const checkerErrorMessages: ComputedRef<string[]> = computed(() => {
//   if (activeStep.value === 6 && !checkerFilled.value) return [`This field is required.`];
//   else return [];
// });
// const approverErrorMessages: ComputedRef<string[]> = computed(() => {
//   if (activeStep.value === 6 && !approverFilled.value) return [`This field is required.`];
//   else return [];
// });
// const registererErrorMessages: ComputedRef<string[]> = computed(() => {
//   if (activeStep.value === 6 && !registererFilled.value) return [`This field is required.`];
//   else return [];
// });

const eligibleReconextUsers = ref<Array<IUserEntity>>([]);
const eligibleApprovers: ComputedRef<string[]> = computed(() => {
  return eligibleReconextUsers.value
    .filter((user) => {
      return user.info.decisionMaker;
    })
    .map((user) => {
      const parts: Array<string> = user.username.split(".");
      return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
    });
});
const eligibleCheckersAndRegisterers: ComputedRef<string[]> = computed(() =>
  eligibleReconextUsers.value.map((user) => {
    const parts: Array<string> = user.username.split(".");
    return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  })
);

(async () => {
  const userManager: UserManager = new UserManager();
  const users: Array<IUserEntity> = await userManager.getByGroupAndSubgroup("change");
  eligibleReconextUsers.value = users;
})();

// competences
const competences = ref<Array<ICompetence>>([]);
(async () => {
  const competenceManager: CompetenceManager = new CompetenceManager();
  const options: Array<ICompetence> = await competenceManager.get();
  competences.value = options;
})();
const parsedCompetences = computed(() => {
  return documentChangeFields.value.affectedCompetences
    ? JSON.parse(documentChangeFields.value.affectedCompetences)
    : [];
});
const updateCompetences = (value: any) => {
  documentChangeFields.value.affectedCompetences = value.length
    ? JSON.stringify(competences.value.filter((c) => value.includes(c.id)))
    : null;
};

// files
// const retrievedFileItems = ref<Array<IFileItem>>([]);

const files = ref<IFileItem[]>([]);
(async () => {
  const fileNames: string[] = JSON.parse(props.componentProps.editedItem.fileNames);
  if (fileNames.length > 0) {
    for (const [index, name] of Object.entries(fileNames)) {
      try {
        const retrieved = await new FileHelper(name, "docx").retrieveFromServer();
        if (!retrieved.file) throw new Error("retrieved file at FileHelper is null");

        const langs = name.match(/qs_langs=([^&]*)/)![1];
        const fileItem: FileItem = new FileItem(parseInt(index, 10), [retrieved.file], [langs]);
        files.value.push(fileItem);
      } catch (error) {
        console.error(`Error fetching files at DCRReview`, error);
      }
    }
  }
})();
const hasFiles = computed<boolean>(() => files.value.length > 0);
const handleFiles = (filesData: Array<IFileItem>) => {
  files.value = filesData;
};

type Completed = { step1: boolean; step2: boolean; step3: boolean; step4: boolean; step5: boolean };
const completed = computed<Completed>(() => {
  const dcf = documentChangeFields.value;

  const step1 = !revisionToLow.value;
  const step2 = dcf.affected !== affectedDefault;
  const step3 = hasFiles.value;
  const step4 = !!dcf.checker && !!dcf.approver && !!dcf.registerer;
  const step5 =
    !!dcf.requireAcknowledgmentOrTraining &&
    dcf.requireAcknowledgmentOrTraining === "acknowledgment"
      ? true
      : !!dcf.trainingDetails;

  return {
    step1,
    step2,
    step3,
    step4,
    step5,
  };
});

const newRequestData = computed<DocumentChangeTypes.Processing.ISaveData>(() => {
  return {
    dc: { ...props.componentProps.editedItem, ...documentChangeFields.value },
    files: files.value,
  };
});
watch(activeStep, (newActiveStep) => {
  if (newActiveStep === 6) {
    if (!revisionToLow.value) {
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
        :color="!completed.step1 ? 'warning' : 'secondary'"
        :editable="!completed.step1"
        :complete="completed.step1"
        :error="revisionToLow"
        :value="1"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['1']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step2 ? 'warning' : 'secondary'"
        :editable="!completed.step2"
        :complete="completed.step2"
        :value="2"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['2']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step3 ? 'warning' : 'secondary'"
        :editable="!completed.step3"
        :complete="completed.step3"
        :value="3"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['3']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step4 ? 'warning' : 'secondary'"
        :editable="!completed.step4"
        :complete="completed.step4"
        :value="4"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['4']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :color="!completed.step5 ? 'warning' : 'secondary'"
        :editable="!completed.step5"
        :complete="completed.step5"
        :value="5"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['5']`)"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :value="6"
        :title="$t(`tools.change.tabs.dcr.stepper.vStepperItem['6']`)"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-select
            :items="[
              { name: 'No', value: false },
              {
                name: 'Yes',
                value: true,
              },
            ]"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].new.name`)"
            item-title="name"
            item-value="value"
            :modelValue="documentUpdate"
            @update:modelValue="(value: boolean) => {
              documentUpdate = value;
              if (!value) documentChangeFields.docxNumber = null;
              if (!value) documentChangeFields.docxRevision = 1
              }"
          ></v-select>

          <v-autocomplete
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.name`)"
            :items="documents"
            item-title="name"
            item-value="ref"
            clearable
            :modelValue="parsedDocxNumber"
            @update:modelValue="updateDocxNumber"
            :disabled="documentUpdate === false"
          ></v-autocomplete>

          <!-- <v-text-field
            clearable
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.name`)"
            persistent-hint
            :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.hint`)"
            :error-messages="docxNumberErrorMessages"
            :modelValue="documentChangeFields.docxNumber ?? ''"
            @update:modelValue="(value: string) => {
              documentChangeFields.docxNumber = value ? value : null
            if (revisionNotOneIfDocxNumberIsNull) documentChangeFields.docxRevision = 1
              }"
            :disabled="newDocument"
          ></v-text-field> -->
          <!-- :rules="[docxNumberRule]" -->
          <v-number-input
            v-model="documentChangeFields.docxRevision"
            :reverse="false"
            controlVariant="default"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxRevision`)"
            :hideInput="false"
            inset
            :min="1"
            :error-messages="revisionErrorMessages"
            :disabled="documentUpdate === false"
          ></v-number-input>
          <!-- :rules="[docxRevisionRule]" -->
          <v-select
            v-model="documentChangeFields.priority"
            :items="['low', 'medium', 'high']"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.name`)"
            persistent-hint
            :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.hint`)"
          ></v-select>
        </v-card>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-card flat>
          <ck-editor
            :editorKey="affectedKey"
            @editorDataChange="handleEditorDataChange"
          ></ck-editor>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat>
          <files-form @files="handleFiles" :retrieved="files" :accept="['.docx']"></files-form>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <v-alert
            class="mb-4"
            :title="$t(`tools.change.tabs.dcr.stepper.info.check_and_approve_title`)"
            :text="$t(`tools.change.tabs.dcr.stepper.info.check_and_approve_text`)"
            type="info"
          ></v-alert>
          <!-- persistent-hint -->
          <!-- :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['4'].checker.hint`)" -->
          <v-autocomplete
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['4'].checker.name`)"
            :items="eligibleCheckersAndRegisterers"
            clearable
            :modelValue="documentChangeFields.checker ?? ''"
            @update:modelValue="(value: string) => documentChangeFields.checker = value ? value : null"
          ></v-autocomplete>
          <!-- :error-messages="checkerErrorMessages" -->
          <!-- persistent-hint -->
          <!-- :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['4'].approver.hint`)" -->
          <v-autocomplete
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['4'].approver.name`)"
            :items="eligibleApprovers"
            clearable
            :modelValue="documentChangeFields.approver ?? ''"
            @update:modelValue="(value: string) => documentChangeFields.approver = value ? value : null"
          ></v-autocomplete>
          <!-- :error-messages="approverErrorMessages" -->
          <v-autocomplete
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['4'].registerer`)"
            :items="eligibleCheckersAndRegisterers"
            clearable
            :modelValue="documentChangeFields.registerer ?? ''"
            @update:modelValue="(value: string) => documentChangeFields.registerer = value ? value : null"
          ></v-autocomplete>
          <!-- :error-messages="registererErrorMessages" -->
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="5">
        <v-card flat>
          <v-autocomplete
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].affectedCompetences`)"
            :items="competences"
            item-title="name"
            item-value="id"
            clearable
            chips
            multiple
            :modelValue="parsedCompetences"
            @update:modelValue="updateCompetences"
          ></v-autocomplete>

          <v-select
            :items="['acknowledgment', 'training']"
            :label="
              $t(
                `tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].requireAcknowledgmentOrTraining`
              )
            "
            :modelValue="documentChangeFields.requireAcknowledgmentOrTraining"
            @update:modelValue="(value: 'acknowledgment' | 'training') => {
              if (value === 'acknowledgment') documentChangeFields.trainingDetails = null
              documentChangeFields.requireAcknowledgmentOrTraining = value
            }"
          ></v-select>
          <v-textarea
            :disabled="documentChangeFields.requireAcknowledgmentOrTraining === 'acknowledgment'"
            :modelValue="documentChangeFields.trainingDetails"
            @update:modelValue="(value: string) => documentChangeFields.trainingDetails = value ? value : null"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].trainingDetails`)"
          ></v-textarea>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="6">
        <v-card flat>
          <d-c-r-verify-table
            :documentChangeFields="documentChangeFields"
            :files="files"
          ></d-c-r-verify-table>
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
          >{{ $t(`tools.change.tabs.dcr.stepper.actions.prev`) }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >{{ $t(`tools.change.tabs.dcr.stepper.actions.next`) }}</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>
