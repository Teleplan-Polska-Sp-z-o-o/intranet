<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from "vue";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { useEditorStore } from "../../../../../stores/editorStore";
import CkEditor from "../../../../common/CkEditor.vue";
import { UserManager } from "../../../../../models/user/UserManager";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { DocumentTypes, IFileItem } from "../../../../../interfaces/document/DocumentTypes";
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
import { FileHelper } from "../../../../../models/common/files/FileHelper";
import { Chips } from "../../../../../models/document/Chips";
import { CommonTypes } from "../../../../../interfaces/common/CommonTypes";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["save-data", "verified"]);
const smallScreen = ref<boolean>(window.innerWidth < 960);
const { t } = useI18n();

const props = defineProps<{
  componentProps: {
    editedItem: DocumentChangeTypes.TDocumentChange;
    gotItems: DocumentChangeTypes.TDocumentChange[];
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
const affectedDefaultWithBase = editorStore.getDefault(affectedKey, true);
const affectedDefault = editorStore.getDefault(affectedKey);
const affected = props.componentProps.editedItem.affected;

const documentChangeFields = ref<DocumentChangeTypes.IDocumentChangeFields>({
  priority: props.componentProps.editedItem.priority,
  affected: editorStore.save(affected ? affected : affectedDefault, affectedKey),
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
  docxSource: props.componentProps.editedItem.docxSource,
  tags: props.componentProps.editedItem.tags,
});

const handleEditorDataChange = (key: string) => {
  documentChangeFields.value.affected = editorStore.get(key);
};

// sources

const docxSources: DocumentChangeTypes.TSource[] = [
  {
    title: t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].source.previously_uploaded`), // "Previously uploaded"
    value: "previously_uploaded",
  },
  {
    title: t(
      `tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].source.not_previously_uploaded_new`
    ), // "Not previously uploaded, new document"
    value: "not_previously_uploaded_new",
  },
  {
    title: t(
      `tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].source.not_previously_uploaded_existing`
    ), // "Not previously uploaded, existing document"
    value: "not_previously_uploaded_existing",
  },
];
const docxSourceParse = (): DocumentChangeTypes.TSourceValue => {
  return documentChangeFields.value.docxSource;
};
const docxSourceUpdate = (value: DocumentChangeTypes.TSourceValue): void => {
  if (documentChangeFields.value.docxSource === "not_previously_uploaded_new") {
    documentChangeFields.value.docxNumber = "";
    documentChangeFields.value.docxRevision = 1;
  }

  documentChangeFields.value.docxSource = value;
};

// number
const disableDocxNumber = computed(
  () => documentChangeFields.value.docxSource === "not_previously_uploaded_new"
);
const changeDocxNumberAutocompleteToTextField = computed(
  () => documentChangeFields.value.docxSource === "not_previously_uploaded_existing"
);

const docxNumberComplete: ComputedRef<boolean> = computed(() => {
  if (documentChangeFields.value.docxSource === "not_previously_uploaded_new") return true;
  else return !!documentChangeFields.value.docxNumber;
});
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
  const documentManager: DocumentManager = new DocumentManager(undefined, true);
  const options: Array<IDocumentEntity> = await documentManager.get(new Chips());
  documents.value = options
    .filter((doc) =>
      props.componentProps.gotItems.length
        ? props.componentProps.gotItems.some((item) => item.docxReference !== doc.ref)
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
//   if (!docxNumberComplete.value) return [`This field is required.`];
//   else return [];
// });

// revision
const disableDocxRevision = computed(
  () => documentChangeFields.value.docxSource === "not_previously_uploaded_new"
);

const highestRevisionByDocumentNumber = ref<number>(0);
watch(
  () => documentChangeFields.value.docxNumber,
  async (newDocxNumber) => {
    const manager: DocumentManager = new DocumentManager(undefined, true);
    const documents: IDocumentEntity[] = newDocxNumber
      ? await manager.getByNumber(newDocxNumber)
      : [];
    if (documents.length === 0) highestRevisionByDocumentNumber.value = 0;
    else {
      const highestRevision = documents.reduce((max, doc) =>
        doc.revision > max.revision ? doc : max
      );
      highestRevisionByDocumentNumber.value = highestRevision.revision;
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

const docxRevisionComplete = computed(() => {
  if (documentChangeFields.value.docxSource === "previously_uploaded")
    return documentChangeFields.value.docxRevision > highestRevisionByDocumentNumber.value;
  else return true;
});

// const revisionToLow = computed(
//   () => documentChangeFields.value.docxRevision <= highestRevisionByDocumentNumber.value
// );
const revisionErrorMessages: ComputedRef<string[]> = computed(() => {
  if (!docxRevisionComplete.value)
    return [
      // `Found an uploaded document of such number having revision ${highestRevisionByDocumentNumber.value}. Please enter a higher revision.`,
      t(`tools.change.tabs.dcr.stepper.error.revisionToLow`, {
        revision: highestRevisionByDocumentNumber.value,
      }),
    ];
  else return [];
});
const revisionMessages: ComputedRef<string[]> = computed(() => {
  if (documentChangeFields.value.docxRevision >= highestRevisionByDocumentNumber.value + 2)
    return [
      // `Warning: You have entered a revision number which is greater than the highest found revision ${highestRevisionByDocumentNumber.value} by more than one.`,
      t(`tools.change.tabs.dcr.stepper.message.revisionGreaterThanExpected`),
    ];
  else return [];
});

// tags
const parsedTags = () => {
  return documentChangeFields.value.tags ? JSON.parse(documentChangeFields.value.tags) : [];
};
const updateTags = (tags: string[]): void => {
  documentChangeFields.value.tags =
    tags.length > 0 ? JSON.stringify(tags.map((t: string) => t.trim())) : null;
};

// priority

const priority = [
  {
    title: t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.low`),
    value: "low",
  },
  {
    title: t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.medium`),
    value: "medium",
  },
  {
    title: t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.high`),
    value: "high",
  },
];

// const handleTagsKeydown = (event: KeyboardEvent) => {
//   if (event.key === " ") {
//     const tag = tagComboboxInput.value.trim();
//     if (tag) {
//       const tags = parsedTags();
//       tags.push(tag);
//       updateTags(tags);
//       tagComboboxInput.value = "";
//     }
//     event.preventDefault();
//   }
// };

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

const expandNotificationsAlert = ref<boolean>(false);
const expandReviewersAlert = ref<boolean>(false);

const eligibleReconextUsers = ref<Array<IUserEntity>>([]);
const selectedReconextUsers = computed<Array<string | null>>(() => {
  return [
    documentChangeFields.value.checker,
    documentChangeFields.value.approver,
    documentChangeFields.value.registerer,
  ];
});

const formatUsername = (username: string, variant: "db" | "normalized" = "normalized"): string => {
  if (variant === "normalized")
    return username
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  else if (variant === "db") return username.replace(" ", ".").toLocaleLowerCase();
  else return username;
};

const eligibleApprovers: ComputedRef<string[]> = computed(() => {
  return eligibleReconextUsers.value
    .filter((user) => {
      return user.info.decisionMaker;
    })
    .filter((user) => {
      return !selectedReconextUsers.value
        .filter((element): element is string => element !== null)
        .map((selected: string) => formatUsername(selected, "db"))
        .includes(user.username);
    })
    .map((user) => formatUsername(user.username, "normalized"));
});
const eligibleCheckersAndRegisterers: ComputedRef<string[]> = computed(() =>
  eligibleReconextUsers.value
    .filter((user) => {
      return !selectedReconextUsers.value
        .filter((element): element is string => element !== null)
        .map((selected: string) => formatUsername(selected, "db"))
        .includes(user.username);
    })
    .map((user) => formatUsername(user.username, "normalized"))
);

(async () => {
  const userManager: UserManager = new UserManager();
  const users: Array<IUserEntity> = await userManager.getByGroupAndSubgroup("change");
  eligibleReconextUsers.value = users;
})();

// competences
const competences = ref<Array<DocumentTypes.ICompetenceEntity>>([]);
(async () => {
  const competenceManager: CompetenceManager = new CompetenceManager();
  const options: Array<DocumentTypes.ICompetenceEntity> = await competenceManager.get(new Chips());
  competences.value = options;
})();
const parsedCompetences = () => {
  return documentChangeFields.value.affectedCompetences
    ? JSON.parse(documentChangeFields.value.affectedCompetences)
    : [];
};
const updateCompetences = (value: number[]) => {
  documentChangeFields.value.affectedCompetences = value.length
    ? JSON.stringify(competences.value.filter((c) => value.includes(c.id)))
    : null;
};

// files
// const retrievedFileItems = ref<Array<IFileItem>>([]);

const acceptedExt: CommonTypes.FileTypes.AcceptedType[] = [
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".doc",
  ".docx",
];
const files = ref<IFileItem[]>([]);
(async () => {
  const fileNames: string[] = JSON.parse(props.componentProps.editedItem.fileNames);
  if (fileNames.length > 0) {
    for (const [index, name] of Object.entries(fileNames)) {
      try {
        const retrieved = await new FileHelper(name, "dc", acceptedExt).retrieveFromServer();
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

// training

const requireAcknowledgmentOrTraining = [
  {
    title: t(
      `tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].requireAcknowledgmentOrTraining.acknowledgment`
    ),
    value: "acknowledgment",
  },
  {
    title: t(
      `tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].requireAcknowledgmentOrTraining.training`
    ),
    value: "training",
  },
];

type Completed = { step1: boolean; step2: boolean; step3: boolean; step4: boolean; step5: boolean };
const completed = computed<Completed>(() => {
  const dcf = documentChangeFields.value;

  const step1 = docxRevisionComplete.value && docxNumberComplete.value;
  const step2 = dcf.affected !== affectedDefaultWithBase;
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
    dc: {
      ...props.componentProps.editedItem,
      ...documentChangeFields.value,
      affected:
        documentChangeFields.value.affected === affectedDefaultWithBase
          ? ""
          : documentChangeFields.value.affected,
    },
    files: files.value,
  };
});
watch(activeStep, (newActiveStep) => {
  if (newActiveStep === 6) {
    if (revisionErrorMessages.value.length === 0) {
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
        :color="!completed.step1 || revisionMessages.length > 0 ? 'warning' : 'secondary'"
        :editable="!completed.step1"
        :complete="completed.step1"
        :error="revisionErrorMessages.length > 0"
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
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].source.name`)"
            :items="docxSources"
            item-title="title"
            item-value="value"
            :modelValue="docxSourceParse()"
            @update:modelValue="docxSourceUpdate"
          ></v-select>

          <v-autocomplete
            v-if="!changeDocxNumberAutocompleteToTextField"
            variant="underlined"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.name`)"
            :items="documents"
            item-title="name"
            item-value="ref"
            clearable
            :modelValue="parsedDocxNumber"
            @update:modelValue="updateDocxNumber"
            :disabled="disableDocxNumber"
          ></v-autocomplete>

          <v-text-field
            v-else
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.name`)"
            persistent-hint
            :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].docxNumber.hint`)"
            clearable
            v-model="documentChangeFields.docxNumber"
            :disabled="disableDocxNumber"
          ></v-text-field>

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
            :messages="revisionMessages"
            :disabled="disableDocxRevision"
            id="c2287a11_aa3d_465a"
            :class="{ warn: revisionMessages.length > 0 }"
            :prefix="documentChangeFields.docxRevision < 10 ? '0' : ''"
          ></v-number-input>
          <!-- :rules="[docxRevisionRule]" -->

          <v-select
            v-model="documentChangeFields.priority"
            :items="priority"
            item-title="title"
            item-value="value"
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.name`)"
            persistent-hint
            :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].priority.hint`)"
          ></v-select>

          <v-combobox
            :items="documentChangeFields.tags ? JSON.parse(documentChangeFields.tags) : undefined"
            clearable
            chips
            multiple
            :label="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].tags.name`)"
            persistent-hint
            :hint="$t(`tools.change.tabs.dcr.stepper.vStepperWindowItem['1'].tags.hint`)"
            :modelValue="parsedTags()"
            @update:modelValue="updateTags"
            :delimiters="[' ']"
          ></v-combobox>
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
          <files-form @files="handleFiles" :retrieved="files" :accept="acceptedExt"></files-form>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <v-alert
            class="mb-4 cursor-help prevent-select"
            type="info"
            @click="expandNotificationsAlert = !expandNotificationsAlert"
          >
            <template v-slot:title>
              {{ $t(`tools.change.tabs.dcr.stepper.info.check_and_approve_title`) }}
              <v-icon class="ms-2" size="small" icon="mdi-cursor-default-click-outline"> </v-icon>
            </template>
            <template v-slot:text v-if="expandNotificationsAlert">
              {{ $t(`tools.change.tabs.dcr.stepper.info.check_and_approve_text`) }}
            </template>
          </v-alert>
          <v-alert
            class="mb-4 cursor-help prevent-select"
            type="info"
            @click="expandReviewersAlert = !expandReviewersAlert"
          >
            <template v-slot:title>
              {{ $t(`tools.change.tabs.dcr.stepper.info.reviewers_title`) }}
              <v-icon class="ms-2" size="small" icon="mdi-cursor-default-click-outline"> </v-icon>
            </template>
            <template v-slot:text v-if="expandReviewersAlert">
              {{ $t(`tools.change.tabs.dcr.stepper.info.reviewers_text`) }}
            </template>
          </v-alert>
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
            :modelValue="parsedCompetences()"
            @update:modelValue="updateCompetences"
          ></v-autocomplete>

          <v-select
            :items="requireAcknowledgmentOrTraining"
            item-title="title"
            item-value="value"
            :label="
              $t(
                `tools.change.tabs.dcr.stepper.vStepperWindowItem['5'].requireAcknowledgmentOrTraining.name`
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

<style lang="scss">
.warn #c2287a11_aa3d_465a-messages .v-messages__message {
  color: #ff8c04 !important;
}
</style>
