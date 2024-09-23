<script setup lang="ts">
import { computed, ComputedRef, ref, watchEffect } from "vue";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { useUserStore } from "../../../../../stores/userStore";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { SimpleUser } from "../../../../../models/user/SimpleUser";
import DCRReviewControls from "./DCRReviewControls.vue";
// import DCRRegister from "./DCRRegister.vue";
// import { nodeConfig } from "../../../../../config/env";
// import { Endpoints } from "../../../../../config/Endpoints";
// import axios from "axios";
import { IFileItem } from "../../../../../interfaces/document/DocumentTypes";
import { FileItem } from "../../../../../models/document/FileItem";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";
import { FileHelper } from "../../../../../models/common/files/FileHelper";
import { useI18n } from "vue-i18n";
import { useEditorStore } from "../../../../../stores/editorStore";
import { CommonTypes } from "../../../../../interfaces/common/CommonTypes";
import { TimeHelper } from "../../../../../models/common/TimeHelper";

const emit = defineEmits(["loadItems"]);
const smallScreen = ref<boolean>(window.innerWidth < 960);
const props = defineProps<{
  item: DocumentChangeTypes.TDocumentChange;
  tab: string;
  manager: DocumentChangeManager | DocumentChangeNoticeManager;
}>();
const router: Router = useRouter();

const openDialog = (): void => {
  try {
    router.push({
      path: `/tool/change/browse/${props.tab}/${props.item.id}`,
    });
  } catch (error) {
    console.error(`open dialog at DCRReview, ${error}`);
  }
};

const closeDialog = (): void => {
  try {
    router.push({
      path: `/tool/change/browse/${props.tab}`,
    });
  } catch (error) {
    console.error(`close dialog at DCRReview, ${error}`);
  }
};

const dialog = ref<boolean>(false);

const newRoute: RouteLocationNormalizedLoaded = useRoute();
watchEffect(() => {
  try {
    if (!newRoute) {
      return;
    }

    if (!newRoute.params.tab || !newRoute.params.no) {
      dialog.value = false;
      return;
    }

    if (Array.isArray(newRoute.params.tab) || Array.isArray(newRoute.params.no)) {
      return;
    }

    if (newRoute.params.tab === props.tab && parseInt(newRoute.params.no) === props.item.id) {
      dialog.value = true;
    }
  } catch (error) {
    console.error(`watch for useRoute at DCRReview, ${error}`);
  }
});

// files
const retrievedBlobs = ref<Array<Blob>>([]);
const retrievedFiles = ref<Array<File>>([]);
const retrievedFileItems = ref<Array<IFileItem>>([]);
const acceptedExt: CommonTypes.FileTypes.AcceptedType[] = [
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".doc",
  ".docx",
];
const retrieveFiles = async () => {
  retrievedBlobs.value = [];
  retrievedFiles.value = [];
  retrievedFileItems.value = [];
  const fileNames: string[] = JSON.parse(props.item.fileNames);
  if (fileNames.length > 0) {
    for (const [index, name] of Object.entries(fileNames)) {
      try {
        const retrieved = await new FileHelper(name, "dc", acceptedExt).retrieveFromServer();

        if (!retrieved.file) throw new Error("retrieved file at FileHelper is null");
        if (!retrieved.blob) throw new Error("retrieved blob at FileHelper is null");
        const langs = name.match(/qs_langs=([^&]*)/)![1];
        const fileItem: FileItem = new FileItem(parseInt(index, 10), [retrieved.file], [langs]);
        retrievedBlobs.value.push(retrieved.blob);
        retrievedFiles.value.push(retrieved.file);
        retrievedFileItems.value.push(fileItem);
      } catch (error) {
        console.error(`Error fetching files at DCRReview`, error);
      }
    }
  }
};

watchEffect(() => {
  retrievedBlobs.value = [];
  retrievedFiles.value = [];
  retrievedFileItems.value = [];

  retrieveFiles();
});

const langs = (langs: string[] | undefined): string => {
  if (!langs) return "";
  // return langs.split("_").join(", ");
  return langs.flatMap((lang) => lang.split("_")).join(", ");
};

const fileIcon = (file: File | undefined): { mdi: string; color: string } => {
  if (!file) return { mdi: "", color: "" };

  switch (file.type) {
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation": // PowerPoint
    case "application/vnd.ms-powerpoint":
      return { mdi: "mdi-file-powerpoint-box", color: "#D04423" };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // Excel
    case "application/vnd.ms-excel":
      return { mdi: "mdi-file-excel-box", color: "#1D6F42" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // Word
    case "application/msword":
      return { mdi: "mdi-file-word-box", color: "#2B579A" };

    default:
      return { mdi: "", color: "" };
  }
};

// affected
const { t } = useI18n();
const affected: ComputedRef<{ given: boolean; text: string }> = computed(() => {
  const editorStore = useEditorStore();
  const aff: string = props.item.affected;
  const defaultAff: string = editorStore.getDefault("affected", true);
  const NO_AFFECTED = t(`tools.change.tabs.dcr.review.no_affected`);

  if (aff === defaultAff) return { given: false, text: NO_AFFECTED };
  else if (aff === "") return { given: false, text: NO_AFFECTED };
  else return { given: true, text: aff };
});

// timeline
const timeline: ComputedRef<DocumentChangeTypes.Processing.TTimeline> = computed(() =>
  JSON.parse(props.item.timeline)
);
const getDotColor = (status: DocumentChangeTypes.TStatus): string => {
  return DocumentChangeTypes.Processing.ETimelineElementColor[status];
};

// user for review
const userStore = useUserStore();
const user: IUserEntity | false = userStore.info();
if (!user) throw new Error("User at DCRReview.vue resolve to false.");
const simpleUser = new SimpleUser().build(user).getNormalizedUsername();

const controlsVariant: ComputedRef<"check" | "approve" | "unregister" | "register"> = computed<
  "check" | "approve" | "unregister" | "register"
>(() => {
  const isChecked = props.item.checked;

  const isApproved = props.item.approved;
  const isApprover = props.item.approver === simpleUser;

  const isRegistered = props.item.registered;
  const isRegisterer = props.item.registerer === simpleUser;

  if (isChecked && !isApproved && isApprover) return "approve";
  if (isApproved && !isRegistered && isRegisterer) return "register";
  if (isRegistered && isRegisterer) return "unregister";
  else return "check";
});

const openFile = (name: string, index: number) => {
  const blob = retrievedBlobs.value.at(index);
  if (blob instanceof Blob) new FileHelper(name, "dc", acceptedExt).downloadBlob(blob);
};
const getPerson = (element: DocumentChangeTypes.Processing.ITimelineElement) => {
  const originator = props.item.originator === element.issuer && !props.item.checked;
  const checker = props.item.checker;
  const approver = props.item.approver;
  const registerer = props.item.registerer;

  if (originator) {
    return "Originator";
  }

  switch (element.issuer) {
    case checker:
      return "Checker";
    case approver:
      return "Approver";
    case registerer:
      return "Registerer";

    default:
      return "";
  }
};
</script>

<template>
  <v-dialog
    v-model="dialog"
    @update:modelValue="(value: boolean) => {
    if (!value) closeDialog()
  }"
    :max-width="smallScreen ? '90vw' : '60vw'"
    max-height="80vh"
  >
    <template v-slot:activator>
      <v-tooltip :text="$t(`tools.change.tabs.dcr.review.tooltip`)">
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            color="primary"
            variant="tonal"
            class="rounded-lg"
            :size="56"
            v-bind="{ ...tooltip }"
            @click="openDialog"
          >
            <v-icon icon="mdi-file-sign" :size="24" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default>
      <v-card color="primary" variant="text" class="bg-background rounded-xl">
        <v-card-title :class="smallScreen ? 'px-4' : 'px-10'">
          <span class="text-h5">{{ $t(`tools.change.tabs.dcr.review.title`) }}</span>
        </v-card-title>

        <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
          <v-list lines="three">
            <!-- Files -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.files`) }}</v-list-subheader>
            <v-list-item
              v-if="retrievedFileItems.length"
              v-for="(file, index) in retrievedFileItems"
              :key="file.id"
              :class="{ 'pt-0': index !== 0 }"
            >
              <template v-if="fileIcon(file.file?.at(0) as File).mdi" v-slot:prepend>
                <v-avatar>
                  <v-icon
                    :icon="fileIcon(file.file?.at(0) as File).mdi"
                    :color="fileIcon(file.file?.at(0) as File).color"
                    @click="openFile(file.file!.at(0)!.name, index)"
                  ></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="w-50" v-text="file.file?.at(0)?.name"></v-list-item-title>
              <v-list-item-subtitle v-text="langs(file.langs)"></v-list-item-subtitle>
              <template v-slot:append>
                <v-btn icon variant="text">
                  <v-icon
                    icon="mdi-file-download-outline"
                    color="secondary"
                    @click="openFile(file.file!.at(0)!.name, index)"
                  ></v-icon>
                </v-btn>
              </template>
              <!-- <v-icon icon="mdi-file-search-outline" size="x-large" class="ma-2"></v-icon> -->
            </v-list-item>
            <v-list-item v-else class="ms-4 ps-14">
              <v-list-item-title
                >{{ $t(`tools.change.tabs.dcr.review.no_files`) }}
              </v-list-item-title>
            </v-list-item>

            <!-- Changes -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.changes`) }}</v-list-subheader>
            <v-list-item
              v-if="affected.given"
              v-html="affected.text"
              class="ck-pt-4 pt-0 ms-4 ps-14"
              style="min-height: 0"
            ></v-list-item>
            <v-list-item v-else class="ms-4 ps-14">
              <v-list-item-title v-html="affected.text"> </v-list-item-title>
            </v-list-item>

            <!-- Timeline -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.timeline`) }}</v-list-subheader>
            <v-list-item>
              <v-timeline side="end" align="start">
                <v-timeline-item
                  v-for="element in timeline"
                  :key="element.id"
                  :dot-color="getDotColor(element.status)"
                  size="x-small"
                >
                  <template v-slot:opposite>
                    <v-chip
                      class="ms-0 me-2"
                      :color="getDotColor(element.status)"
                      size="small"
                      label
                    >
                      {{ element.status }}
                    </v-chip>
                  </template>
                  <div class="mb-4">
                    <div class="text-body-1">
                      <strong>{{ element.issuer }}</strong> @{{
                        TimeHelper.removeTimezone(TimeHelper.convertToLocalTime(element.date))
                      }}
                    </div>
                    <v-chip
                      v-if="getPerson(element)"
                      class="ms-0 me-2"
                      size="small"
                      variant="text"
                      prepend-icon="mdi-badge-account-outline"
                    >
                      {{ getPerson(element) }}
                    </v-chip>

                    <!-- <div v-if="getPerson(element)" class="d-flex align-center">
                      <v-icon icon="mdi-badge-account-outline" height="17"></v-icon>
                      {{ getPerson(element) }}
                    </div> -->
                    <div v-if="element.comment" class="ms-2 mt-1 text-body-2">
                      {{ `${$t(`tools.change.tabs.dcr.review.comment`)}: ${element.comment}` }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <d-c-r-review-controls
            v-if="!props.item.registered"
            :user="simpleUser"
            variant="reject"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          >
          </d-c-r-review-controls>
          <d-c-r-review-controls
            :user="simpleUser"
            :variant="controlsVariant"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          >
          </d-c-r-review-controls>

          <!-- <d-c-r-register
            :user="simpleUser"
            :variant="props.item.registered ? 'unregister' : 'register'"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          ></d-c-r-register> -->

          <v-spacer></v-spacer>

          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            :text="$t(`tools.change.tabs.dcr.review.close`)"
            @click="closeDialog()"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
